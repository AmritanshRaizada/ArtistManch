
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInAnonymously } from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';

import { auth, db } from '../lib/firebase';
import { useBooking } from '../contexts/BookingContext';

function generateLeadId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'AM-';

  for (let i = 0; i < 8; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
}

export default function BookingReviewPage() {
  const navigate = useNavigate();
  const { wizardData, updateWizard } = useBooking();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [leadId, setLeadId] = useState(wizardData.leadId || '');

  // Safely handle optional WizardData properties
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

  const couponApplied =
    couponCode === 'FIRST10' || couponCode === 'FESTIVE10';

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
    wizardData.termsAccepted
  );

  async function handleConfirmBooking() {
    if (!hasRequiredDetails || !budget) {
      setError(
        'Some booking details are missing. Please return to the form and complete them.'
      );
      return;
    }

    if (saving) return;

    setSaving(true);
    setError('');

    try {
      let bookingUser = auth.currentUser;

      if (!bookingUser) {
        const credential = await signInAnonymously(auth);
        bookingUser = credential.user;
      }

      const finalLeadId = wizardData.leadId || generateLeadId();

      const submissionKey =
        wizardData.submissionKey ||
        `sk_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

      const normalizedPhone = customerPhone.replace(/\D/g, '');

      const payload = {
        leadId: finalLeadId,
        submissionKey,
        uid: bookingUser.uid,

        artistType: artistType.trim(),
        eventType: eventType.trim(),
        city: city.trim(),

        budgetLabel: budget.displayLabel,
        budgetLower: budget.lower,
        budgetUpper: budget.upper,

        couponCode: couponApplied ? couponCode : null,
        advanceAmount,

        eventDate: eventDate || null,
        eventTime: eventTime || null,

        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: normalizedPhone,
        venueAddress: venueAddress.trim(),

        status: 'enquiry_saved',

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(
        doc(collection(db, 'leads'), submissionKey),
        payload,
        { merge: true }
      );

      updateWizard({
        leadId: finalLeadId,
        submissionKey,
      });

      setLeadId(finalLeadId);
      setSubmitted(true);

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    } catch (err) {
      console.error('Booking submission error:', err);

      setError(
        'We could not save your enquiry. Please check your connection and try again. Your booking details are still available.'
      );
    } finally {
      setSaving(false);
    }
  }

  // ============================
  // SUCCESS SCREEN
  // ============================

  if (submitted) {
    return (
      <main className="min-h-screen bg-surface px-4 pt-32 pb-16">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 rounded-2xl border border-primary/30 bg-surface-container-low p-7 py-10 text-center md:p-12">

          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
            <span className="material-symbols-outlined text-[42px] text-primary">
              celebration
            </span>
          </div>

          <div>
            <h1 className="mb-2 font-playfair text-[34px] font-bold text-on-surface">
              Enquiry <span className="text-primary">Submitted!</span>
            </h1>

            <p className="text-[15px] leading-6 text-on-surface-variant">
              Your enquiry has been saved successfully. The ArtistManch team
              will contact you to coordinate artist availability and advance
              payment.
            </p>
          </div>

          <div className="rounded-xl border border-primary/20 bg-surface-container px-6 py-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              Your Lead ID
            </p>

            <p className="mt-1 text-[20px] font-bold tracking-wider text-primary">
              {leadId}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-[14px] font-bold text-on-primary shadow-gold transition hover:scale-[1.02]"
            >
              View My Bookings

              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </button>

            <a
              href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210'}?text=${encodeURIComponent(
                `Hi, I've submitted a booking enquiry on ArtistManch. My Lead ID is ${leadId}. Please help me with the next steps.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-[14px] font-bold text-white"
              style={{ background: '#25D366' }}
            >
              <span className="material-symbols-outlined">
                chat
              </span>

              Contact on WhatsApp
            </a>
          </div>
        </div>
      </main>
    );
  }

  // ============================
  // MISSING DETAILS SCREEN
  // ============================

  if (!hasRequiredDetails || !budget) {
    return (
      <main className="min-h-screen bg-surface px-4 pt-32 pb-16">
        <div className="mx-auto max-w-xl rounded-2xl border border-outline-variant/30 bg-surface-container p-8 text-center">

          <span className="material-symbols-outlined text-4xl text-primary">
            info
          </span>

          <h1 className="mt-3 font-playfair text-2xl font-bold text-on-surface">
            Booking details not found
          </h1>

          <p className="mt-2 text-sm text-on-surface-variant">
            Please complete your booking form before opening the review page.
          </p>

          <button
            onClick={() => navigate('/booking')}
            className="mt-6 rounded-xl bg-primary px-6 py-3 font-bold text-on-primary"
          >
            Return to Booking Form
          </button>
        </div>
      </main>
    );
  }

  // ============================
  // REVIEW DETAILS
  // ============================

  const rows: [string, string][] = [
    ['Occasion', eventType],
    ['City', city],
    ['Artist type', artistType],
    ['Budget', budget.displayLabel],
    ['Event date', eventDate],
    ['Showtime', eventTime || 'Not specified'],
    ['Full name', customerName],
    ['Email address', customerEmail],
    ['Mobile number', `+91 ${customerPhone}`],
    ['Venue address', venueAddress],
    ['Coupon code', couponApplied ? couponCode : 'Not applied'],
  ];

  return (
    <main className="min-h-screen bg-surface px-4 pt-28 pb-16">
      <div className="mx-auto max-w-5xl">

        {/* PAGE HEADING */}

        <div className="mb-8">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
            ArtistManch Booking Enquiry
          </p>

          <h1 className="font-playfair text-3xl font-semibold text-on-surface md:text-4xl">
            Review Your{' '}
            <span className="italic text-primary">Booking</span>
          </h1>

          <p className="mt-2 text-sm text-on-surface-variant">
            Please verify all your details before submitting your enquiry.
          </p>
        </div>

        {/* ERROR MESSAGE */}

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-error/30 bg-error-container/30 p-4 text-sm text-error"
          >
            {error}
          </div>
        )}

        {/* REVIEW CARD */}

        <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-5 md:p-8">

          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-playfair text-2xl font-semibold text-on-surface">
                Your Enquiry Details
              </h2>

              <p className="mt-1 text-sm text-on-surface-variant">
                Check that everything is correct.
              </p>
            </div>

            <span className="material-symbols-outlined text-3xl text-primary">
              receipt_long
            </span>
          </div>

          {/* CUSTOMER DETAILS */}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {rows.map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl border border-outline-variant/20 bg-surface-container p-4"
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                  {label}
                </p>

                <p className="mt-1 break-words text-[14px] font-semibold text-on-surface">
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* ADVANCE AMOUNT */}

          <div className="mt-6 rounded-xl border border-primary/25 bg-primary/10 p-5">
            <p className="text-[12px] font-bold uppercase tracking-wider text-on-surface-variant">
              Estimated advance
            </p>

            <p className="mt-1 font-playfair text-3xl font-bold text-primary">
              ₹{advanceAmount.toLocaleString('en-IN')}
            </p>

            <p className="mt-1 text-[12px] text-on-surface-variant">
              {couponApplied
                ? '10% advance with coupon applied.'
                : 'Standard 20% advance.'}{' '}
              Payment is coordinated after your enquiry is reviewed.
            </p>
          </div>

          {/* TERMS ACCEPTED */}

          <div className="mt-5 rounded-xl border border-outline-variant/20 bg-surface-container p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-on-surface">
              <span className="material-symbols-outlined text-primary">
                verified_user
              </span>

              Booking terms accepted
            </p>

            <p className="mt-1 text-xs text-on-surface-variant">
              You have accepted the ArtistManch Booking Terms & Conditions.
            </p>
          </div>

          {/* ACTION BUTTONS */}

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">

            <button
              type="button"
              onClick={() => navigate('/booking')}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-outline-variant/40 px-6 py-4 text-sm font-bold text-on-surface transition hover:bg-surface-container disabled:opacity-50"
            >
              <span className="material-symbols-outlined">
                arrow_back
              </span>

              Edit Details
            </button>

            <button
              type="button"
              onClick={handleConfirmBooking}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-4 text-sm font-bold text-on-primary shadow-gold transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? (
                <>
                  <span className="material-symbols-outlined animate-spin">
                    progress_activity
                  </span>

                  Submitting Enquiry...
                </>
              ) : (
                <>
                  Confirm & Submit Enquiry

                  <span className="material-symbols-outlined">
                    arrow_forward
                  </span>
                </>
              )}
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-on-surface-variant">
            Submitting saves your enquiry. It does not charge your card or
            confirm artist availability.
          </p>

        </section>
      </div>
    </main>
  );
}
