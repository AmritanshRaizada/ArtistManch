import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../contexts/BookingContext';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { auth } from '../lib/firebase';

type RazorpaySuccessResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  handler: (response: RazorpaySuccessResponse) => void | Promise<void>;
  modal: { ondismiss: () => void };
};

type RazorpayInstance = {
  open: () => void;
  on: (event: string, callback: (response: { error?: { description?: string } }) => void) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const functions = getFunctions(auth.app, 'asia-south1');

function formatINR(amount: number) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true), { once: true });
      existingScript.addEventListener('error', () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function BookingReviewPage() {
  const navigate = useNavigate();
  const { wizardData } = useBooking();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [paid, setPaid] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [leadId] = useState(wizardData.leadId || '');
  const isHandlingBack = useRef(false);

  const eventType = wizardData.eventType ?? '';
  const city = wizardData.city ?? '';
  const artistType = wizardData.artistType ?? '';
  const eventDate = wizardData.eventDate ?? '';
  const eventTime = wizardData.eventTime ?? '';
  const customerName = wizardData.customerName ?? '';
  const customerEmail = wizardData.customerEmail ?? '';
  const customerPhone = wizardData.customerPhone ?? '';
  const venueAddress = wizardData.venueAddress ?? '';
  const couponCode = wizardData.couponCode ?? '';
  const budget = wizardData.budget;

  const couponApplied = couponCode === 'FIRST10' || couponCode === 'FESTIVE10';
  const advanceAmount = budget
    ? couponApplied
      ? budget.advanceFirst10
      : budget.advanceStandard
    : 0;

  const hasRequiredDetails = Boolean(
    eventType.trim() &&
      city.trim() &&
      artistType.trim() &&
      budget &&
      eventDate &&
      customerName.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim()) &&
      customerPhone.replace(/\D/g, '').length === 10 &&
      venueAddress.trim() &&
      wizardData.termsAccepted &&
      wizardData.leadId &&
      wizardData.submissionKey
  );

  const rows: [string, string][] = useMemo(
    () => [
      ['Occasion', eventType],
      ['City', city],
      ['Artist type', artistType],
      ['Budget', budget?.displayLabel ?? ''],
      ['Event date', eventDate],
      ['Showtime', eventTime || 'Not specified'],
      ['Full name', customerName],
      ['Email address', customerEmail],
      ['Mobile number', `+91 ${customerPhone}`],
      ['Venue address', venueAddress],
      ['Coupon code', couponApplied ? couponCode : 'Not applied'],
    ],
    [eventType, city, artistType, budget, eventDate, eventTime, customerName, customerEmail, customerPhone, venueAddress, couponApplied, couponCode]
  );

  const openExitPrompt = useCallback(() => {
    setShowExitModal(true);
  }, []);

  // Catch browser back navigation and show the same exit-choice popup.
  useEffect(() => {
    window.history.pushState({ artistManchReview: true }, '', window.location.href);

    const handlePopState = () => {
      if (isHandlingBack.current) return;
      isHandlingBack.current = true;
      window.history.pushState({ artistManchReview: true }, '', window.location.href);
      setShowExitModal(true);
      window.setTimeout(() => {
        isHandlingBack.current = false;
      }, 0);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  function submitWithoutAdvance() {
    setShowExitModal(false);
    setError('');
    setPaid(false);
    setSubmitted(true);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }

  async function handlePayment() {
    if (
      !hasRequiredDetails ||
      !budget ||
      !wizardData.leadId ||
      !wizardData.submissionKey
    ) {
      setError(
        'Your booking details could not be found. Please return to the booking form and try again.'
      );
      return;
    }

    // Capture validated values locally for use in asynchronous callbacks.
    const submissionKey: string = wizardData.submissionKey;
    const currentLeadId: string = wizardData.leadId;

    if (!Number.isFinite(advanceAmount) || advanceAmount <= 0) {
      setError(
        'The advance amount is invalid. Please return to the booking form and check your budget.'
      );
      return;
    }

    setSaving(true);
    setError('');

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error(
          'Unable to load Razorpay Checkout. Please check your internet connection and try again.'
        );
      }

      // The backend reads the saved lead and calculates the amount securely.
      const createOrder = httpsCallable<
        { submissionKey: string },
        {
          orderId: string;
          amount: number;
          currency: string;
          keyId: string;
          leadId: string;
        }
      >(functions, 'createRazorpayOrder');

      const orderResult = await createOrder({ submissionKey });
      const orderData = orderResult.data;

      if (
        !orderData.orderId ||
        !orderData.amount ||
        !orderData.keyId ||
        !orderData.currency
      ) {
        throw new Error(
          'The server did not return complete Razorpay order details. Please try again.'
        );
      }

      const RazorpayConstructor = window.Razorpay;
      const checkout = new RazorpayConstructor({
        key: orderData.keyId,
        amount: Number(orderData.amount),
        currency: orderData.currency,
        name: 'ArtistManch',
        description: `Booking advance - ${currentLeadId}`,
        order_id: orderData.orderId,
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone.replace(/\D/g, ''),
        },
        theme: { color: '#F4C84A' },
        handler: async (response) => {
          try {
            const verifyPayment = httpsCallable<
              {
                submissionKey: string;
                razorpay_payment_id: string;
                razorpay_order_id: string;
                razorpay_signature: string;
              },
              {
                success: boolean;
                leadId: string;
                paymentStatus: string;
              }
            >(functions, 'verifyRazorpayPayment');

            const verifyResult = await verifyPayment({
              submissionKey,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (
              verifyResult.data.success !== true ||
              verifyResult.data.paymentStatus !== 'paid'
            ) {
              throw new Error(
                'Payment verification failed. Please contact support before retrying.'
              );
            }

            setPaid(true);
            setSubmitted(true);
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
          } catch (verificationError) {
            console.error('Razorpay verification error:', verificationError);
            setError(
              verificationError instanceof Error
                ? verificationError.message
                : 'We received a payment response but could not verify it. Please contact ArtistManch support with your Lead ID.'
            );
          } finally {
            setSaving(false);
          }
        },
        modal: {
          ondismiss: () => setSaving(false),
        },
      });

      checkout.on('payment.failed', (response) => {
        setSaving(false);
        setError(
          response.error?.description ||
            'Payment failed. You can try again or submit your enquiry without advance.'
        );
      });

      checkout.open();
    } catch (paymentError) {
      console.error('Razorpay checkout error:', paymentError);
      setError(
        paymentError instanceof Error
          ? paymentError.message
          : 'Unable to start payment. Please try again.'
      );
      setSaving(false);
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-surface px-4 pt-32 pb-16">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 rounded-2xl border border-primary/30 bg-surface-container-low p-7 py-10 text-center md:p-12">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
            <span className="material-symbols-outlined text-[42px] text-primary">
              {paid ? 'check_circle' : 'celebration'}
            </span>
          </div>

          <div>
            <h1 className="mb-2 font-playfair text-[34px] font-bold text-on-surface">
              {paid ? 'Payment Successful!' : 'Enquiry Submitted!'}
            </h1>
            <p className="text-[15px] leading-6 text-on-surface-variant">
              {paid
                ? 'Your advance payment has been received and verified. The ArtistManch team will contact you with the next steps.'
                : 'Your enquiry has been saved successfully without an advance payment. The ArtistManch team will contact you to coordinate artist availability and the next steps.'}
            </p>
          </div>

          <div className="rounded-xl border border-primary/20 bg-surface-container px-6 py-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Your Lead ID</p>
            <p className="mt-1 text-[20px] font-bold tracking-wider text-primary">{leadId}</p>
          </div>

          {paid && (
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-5 py-3">
              <p className="text-sm font-semibold text-green-400">Advance paid: {formatINR(advanceAmount)}</p>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-[14px] font-bold text-on-primary shadow-gold transition hover:scale-[1.02]"
            >
              View My Bookings
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>

            <a
              href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210'}?text=${encodeURIComponent(
                `Hi, I've submitted a booking enquiry on ArtistManch. My Lead ID is ${leadId}. ${paid ? `My advance payment of ${formatINR(advanceAmount)} was successful.` : 'I have submitted the enquiry without advance payment.'} Please help me with the next steps.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-[14px] font-bold text-white"
              style={{ background: '#25D366' }}
            >
              <span className="material-symbols-outlined">chat</span>
              Contact on WhatsApp
            </a>
          </div>
        </div>
      </main>
    );
  }

  if (!hasRequiredDetails || !budget) {
    return (
      <main className="min-h-screen bg-surface px-4 pt-32 pb-16">
        <div className="mx-auto max-w-xl rounded-2xl border border-outline-variant/30 bg-surface-container p-8 text-center">
          <span className="material-symbols-outlined text-4xl text-primary">info</span>
          <h1 className="mt-3 font-playfair text-2xl font-bold text-on-surface">Booking details not found</h1>
          <p className="mt-2 text-sm text-on-surface-variant">Please complete your booking form before opening the review page.</p>
          <button onClick={() => navigate('/booking')} className="mt-6 rounded-xl bg-primary px-6 py-3 font-bold text-on-primary">
            Return to Booking Form
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface px-4 pt-28 pb-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">ArtistManch Booking Enquiry</p>
          <h1 className="font-playfair text-3xl font-semibold text-on-surface md:text-4xl">
            Review Your <span className="italic text-primary">Booking</span>
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant">Please verify all your details before proceeding with payment.</p>
        </div>

        {error && (
          <div role="alert" className="mb-5 rounded-xl border border-error/30 bg-error-container/30 p-4 text-sm text-error">
            {error}
          </div>
        )}

        <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-5 md:p-8">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-playfair text-2xl font-semibold text-on-surface">Your Enquiry Details</h2>
              <p className="mt-1 text-sm text-on-surface-variant">Check that everything is correct.</p>
            </div>
            <span className="material-symbols-outlined text-3xl text-primary">receipt_long</span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {rows.map(([label, value]) => (
              <div key={label} className="rounded-xl border border-outline-variant/20 bg-surface-container p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">{label}</p>
                <p className="mt-1 break-words text-[14px] font-semibold text-on-surface">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-primary/25 bg-primary/10 p-5">
            <p className="text-[12px] font-bold uppercase tracking-wider text-on-surface-variant">Advance amount payable now</p>
            <p className="mt-1 font-playfair text-3xl font-bold text-primary">{formatINR(advanceAmount)}</p>
            <p className="mt-1 text-[12px] text-on-surface-variant">
              {couponApplied ? '10% advance with coupon applied.' : 'Standard 20% advance.'} This is the amount that will be charged through Razorpay.
            </p>
          </div>

          <div className="mt-5 rounded-xl border border-outline-variant/20 bg-surface-container p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-on-surface">
              <span className="material-symbols-outlined text-primary">verified_user</span>
              Booking terms accepted
            </p>
            <p className="mt-1 text-xs text-on-surface-variant">You have accepted the ArtistManch Booking Terms & Conditions.</p>
          </div>

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={openExitPrompt}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-outline-variant/40 px-6 py-4 text-sm font-bold text-on-surface transition hover:bg-surface-container disabled:opacity-50"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Back
            </button>

            <button
              type="button"
              onClick={handlePayment}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-4 text-sm font-bold text-on-primary shadow-gold transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? (
                <>
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  Processing...
                </>
              ) : (
                <>
                  Pay Now {formatINR(advanceAmount)}
                  <span className="material-symbols-outlined">arrow_forward</span>
                </>
              )}
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-on-surface-variant">
            You can pay the advance now or submit your enquiry without advance. Artist availability is subject to confirmation.
          </p>
        </section>
      </div>

      {showExitModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 py-6" role="dialog" aria-modal="true" aria-labelledby="exit-booking-title">
          <div className="w-full max-w-md rounded-2xl border border-primary/30 bg-surface-container-low p-6 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <span className="material-symbols-outlined text-2xl text-primary">payments</span>
            </div>
            <h2 id="exit-booking-title" className="font-playfair text-2xl font-bold text-on-surface">Don't want to pay an advance?</h2>
            <p className="mt-2 text-sm leading-6 text-on-surface-variant">
              No problem. You can still submit your booking enquiry without paying now. Our team will contact you about the next steps.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => { setShowExitModal(false); void handlePayment(); }}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-on-primary shadow-gold disabled:opacity-60"
              >
                Pay Now {formatINR(advanceAmount)}
              </button>
              <button
                type="button"
                onClick={submitWithoutAdvance}
                disabled={saving}
                className="inline-flex items-center justify-center rounded-xl border border-primary/40 px-5 py-3 text-sm font-bold text-primary transition hover:bg-primary/10 disabled:opacity-60"
              >
                Submit Enquiry Without Advance
              </button>
              <button
                type="button"
                onClick={() => { setShowExitModal(false); navigate('/booking'); }}
                disabled={saving}
                className="rounded-xl px-5 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface-container"
              >
                Go back and edit details
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
