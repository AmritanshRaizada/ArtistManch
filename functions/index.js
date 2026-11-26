/* eslint-disable camelcase */
const {onCall, HttpsError} = require("firebase-functions/v2/https");
const {defineSecret} = require("firebase-functions/params");
const {initializeApp} = require("firebase-admin/app");
const {getFirestore, FieldValue} = require("firebase-admin/firestore");
const Razorpay = require("razorpay");
const crypto = require("crypto");

// Initialize Firebase Admin
initializeApp();

const db = getFirestore();

// Razorpay secrets stored in Firebase Secret Manager
const RAZORPAY_KEY_ID = defineSecret("RAZORPAY_KEY_ID");
const RAZORPAY_KEY_SECRET = defineSecret("RAZORPAY_KEY_SECRET");

const REGION = "asia-south1";

// Create Razorpay SDK instance
function getRazorpay() {
  const keyId = RAZORPAY_KEY_ID.value();
  const keySecret = RAZORPAY_KEY_SECRET.value();

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials are not configured.");
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

// Convert amount in rupees to paise
function rupeesToPaise(amount) {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    throw new HttpsError("invalid-argument", "Invalid advance amount.");
  }

  return Math.round(numericAmount * 100);
}

// ----------------------------------------------------
// 1. CREATE RAZORPAY ORDER
// ----------------------------------------------------

exports.createRazorpayOrder = onCall(
    {
      region: REGION,
      secrets: [RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET],
    },
    async (request) => {
      if (!request.auth) {
        throw new HttpsError(
            "unauthenticated",
            "Please sign in before making a payment.",
        );
      }

      const {submissionKey} = request.data || {};
      const uid = request.auth.uid;

      if (
        typeof submissionKey !== "string" ||
      !submissionKey.trim()
      ) {
        throw new HttpsError(
            "invalid-argument",
            "Booking submission key is missing.",
        );
      }

      try {
        const leadRef = db.collection("leads").doc(submissionKey);
        const leadSnap = await leadRef.get();

        if (!leadSnap.exists) {
          throw new HttpsError("not-found", "Booking enquiry not found.");
        }

        const lead = leadSnap.data();

        // Ensure the booking belongs to the signed-in user
        if (lead.uid !== uid) {
          throw new HttpsError(
              "permission-denied",
              "You are not authorized to pay for this booking.",
          );
        }

        // Read the amount from Firestore, never from the browser
        const amountPaise = rupeesToPaise(lead.advanceAmount);

        const razorpay = getRazorpay();

        const order = await razorpay.orders.create({
          amount: amountPaise,
          currency: "INR",
          receipt: `AM-${submissionKey}`.slice(0, 40),
          notes: {
            leadId: lead.leadId || submissionKey,
            submissionKey,
            uid,
          },
        });

        // Save pending payment information in Firestore
        await leadRef.update({
          payment: {
            status: "pending",
            gateway: "razorpay",
            orderId: order.id,
            amount: amountPaise / 100,
            amountPaise,
            currency: "INR",
            createdAt: FieldValue.serverTimestamp(),
          },
          updatedAt: FieldValue.serverTimestamp(),
        });

        return {
          success: true,
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          keyId: RAZORPAY_KEY_ID.value(),
          leadId: lead.leadId || submissionKey,
        };
      } catch (error) {
        console.error("Razorpay order creation failed:", error);

        if (error instanceof HttpsError) {
          throw error;
        }

        throw new HttpsError(
            "internal",
            "Unable to create Razorpay order. Please try again.",
        );
      }
    },
);

// ----------------------------------------------------
// 2. VERIFY RAZORPAY PAYMENT
// ----------------------------------------------------

exports.verifyRazorpayPayment = onCall(
    {
      region: REGION,

      // IMPORTANT: Both secrets are required here.
      secrets: [RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET],
    },
    async (request) => {
      if (!request.auth) {
        throw new HttpsError(
            "unauthenticated",
            "Please sign in before verifying payment.",
        );
      }

      const {
        submissionKey,
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      } = request.data || {};

      const uid = request.auth.uid;

      if (
        typeof submissionKey !== "string" ||
      !submissionKey.trim() ||
      typeof razorpay_payment_id !== "string" ||
      typeof razorpay_order_id !== "string" ||
      typeof razorpay_signature !== "string"
      ) {
        throw new HttpsError(
            "invalid-argument",
            "Required payment verification details are missing.",
        );
      }

      try {
        const leadRef = db.collection("leads").doc(submissionKey);
        const leadSnap = await leadRef.get();

        if (!leadSnap.exists) {
          throw new HttpsError("not-found", "Booking enquiry not found.");
        }

        const lead = leadSnap.data();

        // Confirm booking ownership
        if (lead.uid !== uid) {
          throw new HttpsError(
              "permission-denied",
              "You are not authorized to verify this payment.",
          );
        }

        // Confirm that this is the order created for this booking
        if (lead.payment?.orderId !== razorpay_order_id) {
          throw new HttpsError(
              "failed-precondition",
              "Razorpay order does not match this booking.",
          );
        }

        // Prevent overwriting an already verified payment
        if (
          lead.payment?.status === "paid" &&
        lead.payment?.paymentId === razorpay_payment_id
        ) {
          return {
            success: true,
            leadId: lead.leadId || submissionKey,
            paymentStatus: "paid",
          };
        }

        // Verify Razorpay signature using HMAC SHA256
        const keySecret = RAZORPAY_KEY_SECRET.value();

        const expectedSignature = crypto
            .createHmac("sha256", keySecret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        const expectedBuffer = Buffer.from(expectedSignature, "hex");
        const receivedBuffer = Buffer.from(razorpay_signature, "hex");

        if (
          expectedBuffer.length !== receivedBuffer.length ||
        !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
        ) {
          throw new HttpsError(
              "permission-denied",
              "Razorpay payment signature is invalid.",
          );
        }

        // Fetch payment directly from Razorpay
        const razorpay = getRazorpay();

        const payment = await razorpay.payments.fetch(
            razorpay_payment_id,
        );

        // Validate payment details independently
        if (payment.order_id !== razorpay_order_id) {
          throw new HttpsError(
              "failed-precondition",
              "Payment order ID does not match.",
          );
        }

        const expectedAmountPaise =
        Number(lead.payment?.amountPaise) ||
        rupeesToPaise(lead.advanceAmount);

        if (Number(payment.amount) !== expectedAmountPaise) {
          throw new HttpsError(
              "failed-precondition",
              "Payment amount does not match the booking.",
          );
        }

        if (payment.currency !== "INR") {
          throw new HttpsError(
              "failed-precondition",
              "Payment currency is incorrect.",
          );
        }

        if (payment.status !== "captured") {
          throw new HttpsError(
              "failed-precondition",
              `Payment is not captured. Current status: ${payment.status}`,
          );
        }

        // Update Firestore only after all checks pass
        await db.runTransaction(async (transaction) => {
          const freshLeadSnap = await transaction.get(leadRef);

          if (!freshLeadSnap.exists) {
            throw new HttpsError("not-found", "Booking enquiry not found.");
          }

          const freshLead = freshLeadSnap.data();

          if (freshLead.uid !== uid) {
            throw new HttpsError(
                "permission-denied",
                "Booking ownership could not be verified.",
            );
          }

          if (freshLead.payment?.orderId !== razorpay_order_id) {
            throw new HttpsError(
                "failed-precondition",
                "Booking payment order has changed.",
            );
          }

          if (
            freshLead.payment?.status === "paid" &&
          freshLead.payment?.paymentId === razorpay_payment_id
          ) {
            return;
          }

          transaction.update(leadRef, {
            "payment.status": "paid",
            "payment.paymentId": razorpay_payment_id,
            "payment.orderId": razorpay_order_id,
            "payment.signature": razorpay_signature,
            "payment.amount": payment.amount / 100,
            "payment.amountPaise": payment.amount,
            "payment.currency": payment.currency,
            "payment.method": payment.method || null,
            "payment.paidAt": FieldValue.serverTimestamp(),
            "payment.verifiedAt": FieldValue.serverTimestamp(),
            "status": "payment_completed",
            "updatedAt": FieldValue.serverTimestamp(),
          });
        });

        console.log(
            `Payment verified successfully for booking: ${submissionKey}`,
        );

        return {
          success: true,
          leadId: lead.leadId || submissionKey,
          paymentStatus: "paid",
        };
      } catch (error) {
        console.error("Razorpay payment verification failed:", error);

        if (error instanceof HttpsError) {
          throw error;
        }

        throw new HttpsError(
            "internal",
            "Unable to verify payment. Please contact support if money was deducted.",
        );
      }
    },
);
