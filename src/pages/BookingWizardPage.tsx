import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInAnonymously } from 'firebase/auth';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { ARTIST_TYPES, EVENT_TYPES, MAJOR_CITIES, BUDGET_BRACKETS } from '../data/artists';
import type { BudgetBracket } from '../types';

function generateSubmissionKey(): string {
  return `sk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateLeadId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'AM-';
  for (let i = 0; i < 8; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

function LockedSection({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <section className="relative overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-low/60 p-5 md:p-6 opacity-75">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-outline-variant/40 bg-surface-container text-on-surface-variant">
          <span className="material-symbols-outlined text-[19px]">lock</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-[15px] text-on-surface">{number}. {title}</p>
          <p className="mt-0.5 text-[13px] text-on-surface-variant">{description}</p>
        </div>
        <span className="hidden rounded-full bg-surface-container px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant sm:inline-flex">Locked</span>
      </div>
    </section>
  );
}

function SectionHeading({ number, title, description, complete = false }: { number: number; title: string; description: string; complete?: boolean }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold text-[13px] ${complete ? 'bg-primary text-on-primary' : 'border border-primary/30 bg-primary/10 text-primary'}`}>
        {complete ? <span className="material-symbols-outlined text-[19px]">check</span> : number}
      </div>
      <div>
        <h2 className="font-playfair text-[23px] md:text-[26px] font-semibold text-on-surface">{title}</h2>
        <p className="mt-1 text-[14px] text-on-surface-variant">{description}</p>
      </div>
    </div>
  );
}

export default function BookingWizardPage() {
  const { user } = useAuth();
  const { wizardData, updateWizard } = useBooking();
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [leadId, setLeadId] = useState(wizardData.leadId || '');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [offerSecondsLeft, setOfferSecondsLeft] = useState<number | null>(null);

  const [eventType, setEventType] = useState(wizardData.eventType || '');
  const [otherEventType, setOtherEventType] = useState('');
  const [city, setCity] = useState(wizardData.city || '');
  const [artistType, setArtistType] = useState(wizardData.artistType || wizardData.selectedArtist?.category || '');
  const [otherArtistType, setOtherArtistType] = useState('');
  const [selectedBudget, setSelectedBudget] = useState<BudgetBracket | null>(wizardData.budget || null);
  const [couponCode, setCouponCode] = useState(wizardData.couponCode || '');
  const [eventDate, setEventDate] = useState(wizardData.eventDate || '');
  const [eventTime, setEventTime] = useState(wizardData.eventTime || '');
  const [customerName, setCustomerName] = useState(wizardData.customerName || user?.displayName || '');
  const [customerEmail, setCustomerEmail] = useState(wizardData.customerEmail || user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(wizardData.customerPhone || '');
  const [venueAddress, setVenueAddress] = useState(wizardData.venueAddress || '');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submissionKey] = useState(wizardData.submissionKey || generateSubmissionKey());

  useEffect(() => {
    if (offerSecondsLeft === null || offerSecondsLeft <= 0) return;
    const timer = window.setInterval(() => setOfferSecondsLeft((seconds) => {
      if (seconds === null) return null;
      if (seconds <= 1) { setCouponCode(''); return 0; }
      return seconds - 1;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [offerSecondsLeft !== null && offerSecondsLeft > 0]);

  useEffect(() => {
    if (wizardData.selectedArtist && !artistType) setArtistType(wizardData.selectedArtist.category);
    if (user?.displayName && !customerName) setCustomerName(user.displayName);
    if (user?.email && !customerEmail) setCustomerEmail(user.email);
  }, [wizardData.selectedArtist, user, artistType, customerName, customerEmail]);

  // Keep the progress bar tied to the user's scroll position through the full form.
  useEffect(() => {
    const updateScrollProgress = () => {
      const root = document.documentElement;
      const scrollable = root.scrollHeight - window.innerHeight;
      setScrollProgress(scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0);
    };
    updateScrollProgress();
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress);
    return () => {
      window.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('resize', updateScrollProgress);
    };
  }, []);


  const couponApplied = couponCode.trim().toUpperCase() === 'FIRST10' || couponCode.trim().toUpperCase() === 'FESTIVE10';
  const advanceAmount = selectedBudget
    ? couponApplied ? selectedBudget.advanceFirst10 : selectedBudget.advanceStandard
    : 0;

  const resolvedEventType = eventType === 'Other' ? otherEventType.trim() : eventType;
  const resolvedArtistType = artistType === 'Other' ? otherArtistType.trim() : artistType;
  const occasionComplete = Boolean(resolvedEventType && city.trim() && resolvedArtistType);
  const budgetComplete = Boolean(selectedBudget);
  const dateComplete = Boolean(eventDate);
  const contactComplete = Boolean(
    customerName.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim()) &&
    customerPhone.replace(/\D/g, '').length === 10 && termsAccepted
  );

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function validateForm(): string {
    if (!resolvedEventType) return 'Please select or enter your celebration occasion.';
    if (!city.trim()) return 'Please enter your event city.';
    if (!resolvedArtistType) return 'Please select or enter an artist type.';
    if (!selectedBudget) return 'Please select a budget bracket.';
    if (!eventDate) return 'Please enter the event date.';
    if (!customerName.trim()) return 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) return 'Please enter a valid email address.';
    if (customerPhone.replace(/\D/g, '').length !== 10) return 'Please enter a valid 10-digit mobile number.';
    if (!termsAccepted) return 'Please accept the Booking Terms & Conditions.';
    return '';
  }

  async function handleSubmit() {
    const error = validateForm();
    if (error) {
      setSaveError(error);
      if (!occasionComplete) scrollToSection('booking-section-1');
      else if (!budgetComplete) scrollToSection('booking-section-2');
      else if (!dateComplete) scrollToSection('booking-section-3');
      else scrollToSection('booking-section-4');
      return;
    }

    setSaveError('');
    setSaving(true);
    try {
      let bookingUser = auth.currentUser;
      if (!bookingUser) {
        const credential = await signInAnonymously(auth);
        bookingUser = credential.user;
      }

      const finalLeadId = leadId || generateLeadId();
      const normalizedCoupon = couponCode.trim().toUpperCase();
      const payload = {
        leadId: finalLeadId,
        submissionKey,
        uid: bookingUser.uid,
        selectedArtistId: wizardData.selectedArtist?.id || null,
        selectedArtistName: wizardData.selectedArtist?.professional_name || null,
        artistType: resolvedArtistType,
        eventType: resolvedEventType,
        city: city.trim(),
        budgetLabel: selectedBudget!.displayLabel,
        budgetLower: selectedBudget!.lower,
        budgetUpper: selectedBudget!.upper,
        couponCode: normalizedCoupon || null,
        advanceAmount,
        eventDate: eventDate || null,
        eventTime: eventTime || null,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.replace(/\D/g, ''),
        venueAddress: venueAddress.trim() || null,
        status: 'enquiry_saved',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(collection(db, 'leads'), submissionKey), payload, { merge: true });
      updateWizard({
        eventType: resolvedEventType, city, artistType: resolvedArtistType, budget: selectedBudget || undefined, couponCode: normalizedCoupon,
        eventDate, eventTime, customerName: customerName.trim(),
        customerEmail: customerEmail.trim(), customerPhone: customerPhone.replace(/\D/g, ''),
        venueAddress, termsAccepted, submissionKey, leadId: finalLeadId,
      });
      setLeadId(finalLeadId);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Firestore save error:', err);
      setSaveError('We could not save your enquiry. Please check your connection and try again. Your form details are still here.');
    } finally {
      setSaving(false);
    }
  }

  const sectionCard = 'scroll-mt-32 rounded-xl border border-outline-variant/30 bg-surface-container-low p-5 md:p-7';

  return (
    <div className="min-h-screen w-full bg-surface pt-28">
      <div className="fixed left-0 right-0 top-0 z-[60] h-1 bg-surface-container-highest" aria-label="Form scroll progress">
        <div className="h-full transition-[width] duration-150" style={{ width: `${scrollProgress}%`, background: 'linear-gradient(to right, #f2ca50, #ffe088, #d2bbff)' }} />
      </div>
      <div className="mx-auto w-full max-w-[1320px] px-4 py-5 md:px-12 md:py-10">
        <section className="mb-7">
          <div className="flex flex-col gap-4 border-b border-outline-variant/20 pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-primary">
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                <span>ArtistManch Booking Enquiry</span>
                <span className="text-on-surface-variant">•</span>
                <span className="text-secondary">Festive Season Offer</span>
              </div>
              <h1 className="font-playfair text-[30px] font-semibold text-on-surface md:text-[40px]">
                Reserve Your  <span className="italic font-normal text-primary">Artist</span>
              </h1>
              {/* <p className="mt-2 max-w-2xl text-[15px] text-on-surface-variant">
                Complete each section as it unlocks below. Your details stay on this page—no Next or Back buttons between sections.
              </p> */}
            </div>
            {/* <div className="min-w-[220px] rounded-xl border border-outline-variant/20 bg-surface-container p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Form progress</span>
                <span className="text-[12px] font-bold text-primary">{Math.round(scrollProgress)}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-container-highest">
                <div className="h-full rounded-full transition-all" style={{ width: `${scrollProgress}%`, background: 'linear-gradient(to right, #f2ca50, #d2bbff)' }} />
              </div>
              <p className="mt-2 text-[12px] text-on-surface-variant">Viewing: {FORM_SECTIONS[activeSection]}</p>
            </div> */}
          </div>
        </section>

        {saveError && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-error/30 bg-error-container/30 p-4" role="alert">
            <span className="material-symbols-outlined mt-0.5 text-[20px] text-error">error</span>
            <div><p className="text-[14px] font-bold text-error">Action required</p><p className="mt-1 text-[13px] text-error">{saveError}</p></div>
          </div>
        )}

        {submitted ? (
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 rounded-2xl border border-primary/30 bg-surface-container-low p-7 py-10 text-center md:p-12">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
              <span className="material-symbols-outlined text-[42px] text-primary">celebration</span>
            </div>
            <div>
              <h2 className="mb-2 font-playfair text-[34px] font-bold text-on-surface">Enquiry <span className="text-primary">Submitted!</span></h2>
              <p className="text-[15px] leading-6 text-on-surface-variant">Your enquiry has been saved successfully. The ArtistManch team will contact you to coordinate artist availability and advance payment.</p>
            </div>
            <div className="rounded-xl border border-primary/20 bg-surface-container px-6 py-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Your Lead ID</p>
              <p className="mt-1 text-[20px] font-bold tracking-wider text-primary">{leadId}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button onClick={() => navigate('/dashboard')} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-[14px] font-bold text-on-primary shadow-gold transition hover:scale-[1.02]">View My Bookings <span className="material-symbols-outlined text-[18px]">arrow_forward</span></button>
              <a href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210'}?text=${encodeURIComponent(`Hi, I've submitted a booking enquiry on ArtistManch. My Lead ID is ${leadId}. Please help me with the next steps.`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-[14px] font-bold text-white" style={{ background: '#25D366' }}><span className="material-symbols-outlined">chat</span> Contact on WhatsApp</a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            <div className="flex flex-col gap-5 lg:col-span-8">
              <section id="booking-section-1" className={sectionCard}>
                <SectionHeading number={1} title="Occasion & Artist Type" description="Tell us what you're celebrating, where it is, and which performer you need." complete={occasionComplete} />
                <Step1 eventType={eventType} setEventType={setEventType} otherEventType={otherEventType} setOtherEventType={setOtherEventType} city={city} setCity={setCity} artistType={artistType} setArtistType={setArtistType} otherArtistType={otherArtistType} setOtherArtistType={setOtherArtistType} selectedArtist={wizardData.selectedArtist} />
                {!occasionComplete && <p className="mt-4 text-[12px] text-on-surface-variant">Select an occasion, enter the city, and choose an artist type to unlock the next section.</p>}
              </section>

              {occasionComplete ? (
                <section id="booking-section-2" className={sectionCard}>
                  <SectionHeading number={2} title="Choose Your Budget" description="Select the estimated artist budget that works for your event." complete={budgetComplete} />
                  <Step3 selectedBudget={selectedBudget} setSelectedBudget={setSelectedBudget} />
                  <div className="mt-5 rounded-xl border border-outline-variant/20 bg-surface-container p-4">
                    <label htmlFor="booking-coupon" className="mb-2 block text-[12px] font-bold uppercase tracking-wider text-on-surface-variant">Festive Coupon</label>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input id="booking-coupon" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="FESTIVE10" className="min-w-0 flex-1 rounded-lg border border-outline-variant/40 bg-surface-container-high px-3 py-2.5 text-[14px] text-on-surface outline-none focus:border-primary" />
                      <button type="button" onClick={() => { setCouponCode('FESTIVE10'); setOfferSecondsLeft(300); }} className="rounded-lg bg-primary px-4 py-2.5 text-[13px] font-bold text-on-primary transition hover:opacity-90">Apply FESTIVE10</button>
                    </div>
                    {couponApplied && <p className="mt-2 text-[12px] font-semibold text-primary">Coupon applied. Your estimated advance has been updated.</p>}
                  </div>
                </section>
              ) : <LockedSection number={2} title="Choose Your Budget" description="Complete Occasion & Artist Type to unlock budget options." />}

              {occasionComplete && budgetComplete ? (
                <section id="booking-section-3" className={sectionCard}>
                  <SectionHeading number={3} title="Event Date & Time" description="Choose the date and approximate start time for your celebration." complete={dateComplete} />
                  <Step4 eventDate={eventDate} setEventDate={setEventDate} eventTime={eventTime} setEventTime={setEventTime} />
                </section>
              ) : <LockedSection number={3} title="Event Date & Time" description="Select a budget to unlock event scheduling." />}

              {occasionComplete && budgetComplete && dateComplete ? (
                <section id="booking-section-4" className={sectionCard}>
                  <SectionHeading number={4} title="Contact & Venue Details" description="Share your contact information so our team can coordinate your booking." complete={contactComplete} />
                  <Step6 customerName={customerName} setCustomerName={setCustomerName} customerEmail={customerEmail} setCustomerEmail={setCustomerEmail} customerPhone={customerPhone} setCustomerPhone={(value) => setCustomerPhone(value.replace(/\D/g, '').slice(0, 10))} venueAddress={venueAddress} setVenueAddress={setVenueAddress} termsAccepted={termsAccepted} setTermsAccepted={setTermsAccepted} />
                </section>
              ) : <LockedSection number={4} title="Contact & Venue Details" description="Complete the event date to unlock your contact details." />}

              {contactComplete && selectedBudget ? (
                <section id="booking-section-5" className={sectionCard}>
                  <SectionHeading number={5} title="Review & Submit Enquiry" description="Check your booking details and submit your enquiry when you're ready." complete={false} />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {[
                      ['Occasion', resolvedEventType], ['City', city], ['Artist type', resolvedArtistType],
                      ['Budget', selectedBudget.displayLabel], ['Event date', eventDate],
                      ['Showtime', eventTime || 'Not specified'], ['Name', customerName],
                      ['Email', customerEmail], ['Mobile', `+91 ${customerPhone}`],
                      ['Venue', venueAddress || 'To be confirmed'],
                    ].map(([label, value]) => <div key={label} className="rounded-lg bg-surface-container p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">{label}</p><p className="mt-1 break-words text-[14px] font-semibold text-on-surface">{value}</p></div>)}
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-primary/25 bg-primary/10 p-4">
                    <div><p className="text-[12px] font-bold uppercase tracking-wider text-on-surface-variant">Estimated advance</p><p className="mt-1 font-playfair text-[30px] font-bold text-primary">₹{advanceAmount.toLocaleString('en-IN')}</p><p className="text-[12px] text-on-surface-variant">{couponApplied ? '10% advance with coupon' : 'Standard 20% advance'}. Payment is coordinated after the enquiry is reviewed.</p></div>
                    <span className="material-symbols-outlined text-[30px] text-primary">receipt_long</span>
                  </div>
                  <button type="button" onClick={handleSubmit} disabled={saving} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-[15px] font-bold text-on-primary shadow-gold transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70">
                    {saving ? <><span className="material-symbols-outlined animate-spin">progress_activity</span> Saving your enquiry...</> : <>Submit Booking Enquiry <span className="material-symbols-outlined">arrow_forward</span></>}
                  </button>
                  <p className="mt-3 text-center text-[12px] text-on-surface-variant">Submitting saves your enquiry; it does not charge your card or confirm artist availability.</p>
                </section>
              ) : <LockedSection number={5} title="Review & Submit Enquiry" description="Complete your required contact details and accept the terms to review and submit." />}
            </div>

            <aside className="lg:sticky lg:top-28 lg:col-span-4">
              <div className="flex flex-col gap-4 rounded-xl border border-outline-variant/20 bg-surface-container p-5 shadow-lg md:p-6">
                <div className="flex items-center justify-between"><span className="text-[11px] font-bold uppercase tracking-wider text-secondary">Booking estimate</span><span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary"><span className="material-symbols-outlined text-[13px]">shield</span> ENQUIRY ONLY</span></div>
                {offerSecondsLeft !== null && <div className={`rounded-xl border p-3 ${offerSecondsLeft > 0 ? 'border-primary/30 bg-primary/10' : 'border-error/30 bg-error-container/20'}`}><div className="flex items-center justify-between gap-3"><div><p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Festive offer timer</p><p className="mt-1 text-[12px] text-on-surface-variant">{offerSecondsLeft > 0 ? 'Complete your enquiry before the offer timer ends.' : 'Timer ended. Apply the coupon again to restart the 5-minute window.'}</p></div><span className={`font-mono text-[24px] font-bold tabular-nums ${offerSecondsLeft > 0 ? 'text-primary' : 'text-error'}`}>{String(Math.floor(offerSecondsLeft / 60)).padStart(2, '0')}:{String(offerSecondsLeft % 60).padStart(2, '0')}</span></div></div>}
                <div><p className="text-[12px] text-on-surface-variant">Selected budget</p><p className="mt-1 text-[20px] font-bold text-on-surface">{selectedBudget?.displayLabel || 'Not selected'}</p></div>
                <div className="flex items-center justify-between border-t border-outline-variant/20 pt-3 text-[13px]"><span className="text-on-surface-variant">Standard advance (20%)</span><span className="font-bold text-on-surface">₹{selectedBudget ? selectedBudget.advanceStandard.toLocaleString('en-IN') : '—'}</span></div>
                <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-3"><div><p className="text-[12px] text-on-surface-variant">Your estimated advance</p><p className="mt-1 font-playfair text-[26px] font-bold text-primary">₹{selectedBudget ? advanceAmount.toLocaleString('en-IN') : '—'}</p></div><span className="material-symbols-outlined text-[24px] text-primary">payments</span></div>
                <p className="text-[12px] text-on-surface-variant">{couponApplied ? 'FESTIVE10 / FIRST10 rate is reflected in the estimate.' : 'Apply FESTIVE10 to unlock the festive advance estimate and start the 5-minute timer.'}</p>
                <div className="space-y-2 border-t border-outline-variant/20 pt-4">{['Your enquiry is saved securely', 'Artist availability is confirmed separately', 'Payment instructions follow review'].map((item) => <div key={item} className="flex items-start gap-2 text-[12px] text-on-surface-variant"><span className="material-symbols-outlined text-[16px] text-primary">check_circle</span><span>{item}</span></div>)}</div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================
// Step 1: Occasion & City
// ============================
function Step1({ eventType, setEventType, otherEventType, setOtherEventType, city, setCity, artistType, setArtistType, otherArtistType, setOtherArtistType, selectedArtist }: {
  eventType: string; setEventType: (v: string) => void;
  otherEventType: string; setOtherEventType: (v: string) => void;
  city: string; setCity: (v: string) => void;
  artistType: string; setArtistType: (v: string) => void;
  otherArtistType: string; setOtherArtistType: (v: string) => void;
  selectedArtist?: { professional_name: string; category: string; profile_pic: string };
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="font-bold text-[12px] text-on-surface uppercase tracking-wider">Celebration Occasion *</label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-3.5 text-on-surface-variant text-[20px]">event</span>
          <select value={eventType} onChange={(e) => setEventType(e.target.value)} id="event-type-select" className="w-full appearance-none rounded-xl bg-surface-container-high py-3 pl-10 pr-4 text-[15px] text-on-surface focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Select event type...</option>
            {EVENT_TYPES.map((et) => <option key={et} value={et}>{et}</option>)}
            <option value="Other">Other</option>
          </select>
          <span className="material-symbols-outlined pointer-events-none absolute right-3 top-3.5 text-[20px] text-on-surface-variant">expand_more</span>
        </div>
        {eventType === 'Other' && <input value={otherEventType} onChange={(e) => setOtherEventType(e.target.value)} placeholder="Enter your celebration occasion" className="w-full rounded-xl bg-surface-container-high px-4 py-3 text-[15px] text-on-surface focus:outline-none focus:ring-2 focus:ring-primary" aria-label="Other celebration occasion" />}
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-bold text-[12px] text-on-surface uppercase tracking-wider">Event City / Destination *</label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-3.5 text-[20px] text-on-surface-variant">location_on</span>
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter venue city..." id="event-city-input" list="cities-list" className="w-full rounded-xl bg-surface-container-high py-3 pl-10 pr-4 text-[15px] text-on-surface focus:outline-none focus:ring-2 focus:ring-primary" />
          <datalist id="cities-list">{MAJOR_CITIES.map((c) => <option key={c} value={c} />)}</datalist>
        </div>
      </div>
      {selectedArtist && <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/10 p-3"><img src={selectedArtist.profile_pic} alt={selectedArtist.professional_name} className="h-11 w-11 rounded-lg object-cover" /><div><p className="text-[13px] font-bold text-primary">Selected artist: {selectedArtist.professional_name}</p><p className="text-[12px] text-on-surface-variant">Category: {selectedArtist.category}</p></div></div>}
      <div>
        <div className="mb-3"><label className="font-bold text-[12px] uppercase tracking-wider text-on-surface">What type of artist are you looking for? *</label><p className="mt-1 text-[13px] text-on-surface-variant">Choose a category to unlock the budget section.</p></div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {ARTIST_TYPES.map(({ value, icon, subtitle }) => <button key={value} type="button" onClick={() => setArtistType(value)} id={`artist-type-${value.replace(/\s+/g, '-').toLowerCase()}`} className={`flex min-h-[104px] flex-col items-center justify-center rounded-xl p-3 text-center transition-all ${artistType === value ? 'bg-primary/10 text-primary ring-2 ring-primary' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'}`}><span className="material-symbols-outlined mb-1 text-[27px]">{icon}</span><span className="text-[12px] font-bold">{value}</span><span className="mt-1 text-[11px] opacity-80">{subtitle}</span></button>)}
          <button type="button" onClick={() => setArtistType('Other')} className={`flex min-h-[104px] flex-col items-center justify-center rounded-xl p-3 text-center transition-all ${artistType === 'Other' ? 'bg-primary/10 text-primary ring-2 ring-primary' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'}`}><span className="material-symbols-outlined mb-1 text-[27px]">edit_note</span><span className="text-[12px] font-bold">Other</span><span className="mt-1 text-[11px] opacity-80">Specify artist type</span></button>
        </div>
        {artistType === 'Other' && <input value={otherArtistType} onChange={(e) => setOtherArtistType(e.target.value)} placeholder="Enter the artist or performer type" className="mt-3 w-full rounded-xl bg-surface-container-high px-4 py-3 text-[15px] text-on-surface focus:outline-none focus:ring-2 focus:ring-primary" aria-label="Other artist type" />}
      </div>
    </div>
  );
}

// ============================
// Step 3: Budget
// ============================
function Step3({ selectedBudget, setSelectedBudget }: {
  selectedBudget: BudgetBracket | null; setSelectedBudget: (b: BudgetBracket) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="p-4 rounded-xl border border-primary/30 flex items-center gap-4 shadow-lg" style={{ background: 'linear-gradient(to right, #24113d, #1f1f22, #1b1b1e)' }}>
        <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0 text-primary">
          <span className="material-symbols-outlined">payments</span>
        </div>
        <div>
          <p className="font-semibold text-[18px] text-on-surface font-bold">Advance = 20% of the lower budget limit</p>
          <p className="text-[13px] text-on-surface-variant">First booking? Use <strong className="text-primary tracking-wide">FIRST10</strong> to cut advance to 10%!</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-playfair text-[22px] font-semibold text-on-surface">Select Artist Budget Bracket</h2>
          <span className="font-bold text-[13px] text-on-surface-variant">All taxes & standard audio kit inclusive</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BUDGET_BRACKETS.map((bracket) => {
            const isSelected = selectedBudget?.id === bracket.id;
            return (
              <div
                key={bracket.id}
                onClick={() => setSelectedBudget(bracket)}
                id={`budget-${bracket.id}`}
                className={`cursor-pointer p-6 rounded-xl border transition-all flex flex-col justify-between relative overflow-hidden ${
                  isSelected
                    ? 'bg-surface-container border-2 border-primary shadow-[0_0_24px_rgba(212,175,55,0.22)]'
                    : 'bg-surface-container-low border-outline-variant/30 hover:border-primary/50'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 bg-primary text-on-primary font-bold text-[11px] px-2 py-0.5 rounded-bl-lg">SELECTED</div>
                )}
                <div>
                  {/* <span className={`font-bold text-[11px] uppercase tracking-wider block mb-1 ${isSelected ? 'text-primary' : 'text-on-surface-variant'}`}>{bracket.label}</span> */}
                  <span className={`font-playfair text-[22px] font-bold ${isSelected ? 'text-primary' : 'text-on-surface'}`}>{bracket.displayLabel}</span>
                  <p className="text-[13px] text-on-surface-variant mt-2">{bracket.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[11px] text-on-surface-variant block">Advance: ₹{bracket.advanceStandard.toLocaleString('en-IN')}</span>
                    <span className="font-bold text-[12px] text-primary">With FIRST10: ₹{bracket.advanceFirst10.toLocaleString('en-IN')}</span>
                  </div>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center ${isSelected ? 'bg-primary text-on-primary' : 'border border-outline-variant text-on-surface'}`}>
                    {isSelected && <span className="material-symbols-outlined text-[16px]">check</span>}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================
// Step 4: Date & Time
// ============================
function Step4({ eventDate, setEventDate, eventTime, setEventTime }: {
  eventDate: string; setEventDate: (v: string) => void;
  eventTime: string; setEventTime: (v: string) => void;
}) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const initial = eventDate ? new Date(`${eventDate}T12:00:00`) : new Date();
    return new Date(initial.getFullYear(), initial.getMonth(), 1);
  });
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const selectedDate = eventDate ? new Date(`${eventDate}T12:00:00`) : null;
  const monthStart = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
  const mondayOffset = (monthStart.getDay() + 6) % 7;
  const daysInMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();
  const calendarCells = Array.from({ length: Math.ceil((mondayOffset + daysInMonth) / 7) * 7 }, (_, index) => {
    const day = index - mondayOffset + 1;
    return day < 1 || day > daysInMonth ? null : new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day);
  });
  const displayDate = selectedDate ? selectedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Choose your event date';
  const parsedTime = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(eventTime);
  const hour24 = parsedTime ? Number(parsedTime[1]) : 19;
  const minuteValue = parsedTime ? parsedTime[2] : '00';
  const period = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 || 12;
  const displayTime = parsedTime ? `${hour12}:${minuteValue} ${period}` : 'Choose showtime';
  const setTimeParts = (hour: number, minute: string, meridiem: string) => {
    const h24 = meridiem === 'PM' ? (hour % 12) + 12 : hour % 12;
    setEventTime(`${String(h24).padStart(2, '0')}:${minute}`);
  };

  return (
    <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-5 md:p-7">
      <div className="mb-6"><h2 className="font-playfair text-[28px] font-semibold text-on-surface md:text-[30px]">Event Date & Time</h2><p className="mt-1 text-[15px] text-on-surface-variant">When is your celebration?</p></div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="relative min-w-0">
          <label className="mb-2 block text-[12px] font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="event-date-trigger">Event date <span className="text-primary">*</span></label>
          <button id="event-date-trigger" type="button" aria-haspopup="dialog" aria-expanded={calendarOpen} onClick={() => { setCalendarOpen(v => !v); setTimeOpen(false); }} className={`group flex min-h-[76px] w-full items-center gap-4 rounded-xl border bg-surface-container-high px-4 py-4 text-left transition-all hover:border-primary/60 hover:bg-surface-container ${calendarOpen ? 'border-primary ring-2 ring-primary/20' : 'border-outline-variant/30'}`}>
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${eventDate ? 'border-primary/40 bg-primary/15 text-primary' : 'border-outline-variant/30 bg-surface-container text-on-surface-variant group-hover:text-primary'}`}><span className="material-symbols-outlined text-[23px]">calendar_month</span></span>
            <span className="min-w-0 flex-1"><span className={`block truncate text-[15px] font-semibold ${eventDate ? 'text-on-surface' : 'text-on-surface-variant'}`}>{displayDate}</span><span className="mt-1 block text-[11px] text-on-surface-variant">Select a date for your event</span></span>
            <span className={`material-symbols-outlined text-[20px] transition-transform ${calendarOpen ? 'rotate-180 text-primary' : 'text-on-surface-variant'}`}>expand_more</span>
          </button>
          {calendarOpen && <div role="dialog" aria-label="Choose event date" className="absolute left-0 top-full z-40 mt-3 w-full min-w-[290px] rounded-2xl border border-primary/25 bg-[#19171d] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.55)] sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Choose a date</p><h3 className="mt-1 font-playfair text-[21px] font-semibold text-[#f7f1e8]">{visibleMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</h3></div><div className="flex gap-1"><button type="button" aria-label="Previous month" disabled={visibleMonth.getFullYear() === today.getFullYear() && visibleMonth.getMonth() === today.getMonth()} onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))} className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-[#e9dfd0] transition hover:border-primary/50 hover:text-primary disabled:opacity-25"><span className="material-symbols-outlined">chevron_left</span></button><button type="button" aria-label="Next month" onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))} className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-[#e9dfd0] transition hover:border-primary/50 hover:text-primary"><span className="material-symbols-outlined">chevron_right</span></button></div></div>
            <div className="mb-2 grid grid-cols-7 gap-1 text-center">{['M','T','W','T','F','S','S'].map((day, i) => <span key={`${day}-${i}`} className="py-2 text-[11px] font-bold text-[#9f968b]">{day}</span>)}</div>
            <div className="grid grid-cols-7 gap-1">{calendarCells.map((date, i) => { if (!date) return <span key={`blank-${i}`} className="aspect-square" />; const key = dateKey(date); const disabled = date < today; const selected = eventDate === key; const isToday = key === dateKey(today); return <button key={key} type="button" disabled={disabled} onClick={() => { setEventDate(key); setCalendarOpen(false); }} className={`relative aspect-square rounded-lg text-[13px] font-semibold transition-all disabled:cursor-not-allowed disabled:text-white/20 ${selected ? 'bg-primary text-[#211a0b] shadow-[0_0_0_2px_rgba(242,202,80,0.22)]' : disabled ? '' : 'text-[#f0e9df] hover:bg-primary/15 hover:text-primary'} ${isToday && !selected ? 'border border-primary/60' : ''}`}>{date.getDate()}{isToday && !selected && <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />}</button>; })}</div>
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3"><button type="button" onClick={() => setEventDate('')} className="text-[12px] font-semibold text-[#bcb1a3] hover:text-white">Clear date</button><button type="button" onClick={() => { setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1)); setEventDate(dateKey(today)); setCalendarOpen(false); }} className="rounded-lg px-3 py-2 text-[12px] font-bold text-primary hover:bg-primary/10">Today</button></div>
          </div>}
        </div>
        <div className="relative min-w-0">
          <label className="mb-2 block text-[12px] font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="event-time-trigger">Showtime <span className="font-medium normal-case tracking-normal text-on-surface-variant/70"></span></label>
          <button id="event-time-trigger" type="button" aria-haspopup="dialog" aria-expanded={timeOpen} onClick={() => { setTimeOpen(v => !v); setCalendarOpen(false); }} className={`group flex min-h-[76px] w-full items-center gap-4 rounded-xl border bg-surface-container-high px-4 py-4 text-left transition-all hover:border-primary/60 hover:bg-surface-container ${timeOpen ? 'border-primary ring-2 ring-primary/20' : 'border-outline-variant/30'}`}>
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${eventTime ? 'border-primary/40 bg-primary/15 text-primary' : 'border-outline-variant/30 bg-surface-container text-on-surface-variant group-hover:text-primary'}`}><span className="material-symbols-outlined text-[23px]">schedule</span></span><span className="min-w-0 flex-1"><span className={`block text-[15px] font-semibold ${eventTime ? 'text-on-surface' : 'text-on-surface-variant'}`}>{displayTime}</span><span className="mt-1 block text-[11px] text-on-surface-variant">Choose an approximate start time</span></span><span className={`material-symbols-outlined text-[20px] transition-transform ${timeOpen ? 'rotate-180 text-primary' : 'text-on-surface-variant'}`}>expand_more</span>
          </button>
          {timeOpen && <div role="dialog" aria-label="Choose showtime" className="absolute left-0 top-full z-40 mt-3 w-full min-w-[290px] rounded-2xl border border-primary/25 bg-[#19171d] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.55)] sm:p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Set showtime</p><div className="my-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-center"><span className="font-playfair text-[32px] font-semibold tracking-wide text-[#f7f1e8]">{hour12}:{minuteValue} <span className="text-primary">{period}</span></span><p className="mt-1 text-[11px] text-[#a99f92]">Approximate performance start</p></div>
            <div className="grid grid-cols-3 gap-3"><div><label htmlFor="time-hour" className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-[#a99f92]">Hour</label><select id="time-hour" value={hour12} onChange={e => setTimeParts(Number(e.target.value), minuteValue, period)} className="w-full rounded-xl border border-white/10 bg-[#242129] px-3 py-3 text-[15px] font-semibold text-[#f7f1e8] outline-none focus:border-primary">{Array.from({ length: 12 }, (_, i) => i + 1).map(hour => <option key={hour} value={hour}>{String(hour).padStart(2, '0')}</option>)}</select></div><div><label htmlFor="time-minute" className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-[#a99f92]">Minute</label><select id="time-minute" value={minuteValue} onChange={e => setTimeParts(hour12, e.target.value, period)} className="w-full rounded-xl border border-white/10 bg-[#242129] px-3 py-3 text-[15px] font-semibold text-[#f7f1e8] outline-none focus:border-primary">{['00','15','30','45'].map(minute => <option key={minute} value={minute}>{minute}</option>)}</select></div><div><label htmlFor="time-period" className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-[#a99f92]">Period</label><select id="time-period" value={period} onChange={e => setTimeParts(hour12, minuteValue, e.target.value)} className="w-full rounded-xl border border-white/10 bg-[#242129] px-3 py-3 text-[15px] font-semibold text-[#f7f1e8] outline-none focus:border-primary"><option value="AM">AM</option><option value="PM">PM</option></select></div></div>
            <div className="mt-4 flex gap-2"><button type="button" onClick={() => { setEventTime(''); setTimeOpen(false); }} className="flex-1 rounded-lg border border-white/10 px-3 py-2.5 text-[12px] font-semibold text-[#bcb1a3] hover:text-white">Clear</button><button type="button" onClick={() => { setTimeParts(hour12, minuteValue, period); setTimeOpen(false); }} className="flex-1 rounded-lg bg-primary px-3 py-2.5 text-[12px] font-bold text-[#211a0b] hover:brightness-110">Confirm time</button></div>
          </div>}
        </div>
      </div>
      <div className="mt-5 flex items-start gap-3 rounded-xl border border-primary/15 bg-primary/5 p-4"><span className="material-symbols-outlined mt-0.5 shrink-0 text-[20px] text-primary">info</span><p className="text-[13px] leading-5 text-on-surface-variant">Artists typically arrive 2 hours before showtime for soundcheck. We'll coordinate the exact schedule after your booking is confirmed.</p></div>
    </div>
  );
}

// ============================
// Step 6: Customer Details (CRITICAL - Firestore Save Happens Here)
// ============================
function Step6({
  customerName, setCustomerName,
  customerEmail, setCustomerEmail,
  customerPhone, setCustomerPhone,
  venueAddress, setVenueAddress,
  termsAccepted, setTermsAccepted,
}: {
  customerName: string; setCustomerName: (v: string) => void;
  customerEmail: string; setCustomerEmail: (v: string) => void;
  customerPhone: string; setCustomerPhone: (v: string) => void;
  venueAddress: string; setVenueAddress: (v: string) => void;
  termsAccepted: boolean; setTermsAccepted: (v: boolean) => void;
}) {
  return (
    <div className="bg-surface-container-low p-6 md:p-8 rounded-xl border border-outline-variant/30 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-playfair text-[28px] font-semibold text-on-surface">Customer Contact & Venue</h2>
          <p className="text-[13px] text-on-surface-variant mt-1">We need your details for performer coordination and logistics.</p>
        </div>
        <span className="px-3 py-1 rounded bg-secondary-container/30 text-secondary font-bold text-[11px] uppercase tracking-wider">Verification Step</span>
      </div>

      <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-3">
        <span className="material-symbols-outlined text-primary text-[20px]">save</span>
        <p className="text-[13px] text-primary font-semibold">
          Your details will be saved when you submit the enquiry in the final review section.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-[12px] text-on-surface-variant" htmlFor="customer-name">Full Name *</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-3 text-[20px] text-on-surface-variant">person</span>
              <input
                id="customer-name"
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Your Full Name"
                className="w-full bg-surface-container border border-outline-variant/40 rounded-lg pl-10 pr-4 py-2.5 text-on-surface text-[15px] focus:border-primary focus:outline-none transition-all"
              />
            </div>
          </div>
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-[12px] text-on-surface-variant" htmlFor="customer-email">Email Address *</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-3 text-[20px] text-on-surface-variant">mail</span>
              <input
                id="customer-email"
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-surface-container border border-outline-variant/40 rounded-lg pl-10 pr-4 py-2.5 text-on-surface text-[15px] focus:border-primary focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1">
          <label className="font-bold text-[12px] text-on-surface-variant" htmlFor="customer-phone">Mobile Number (WhatsApp) *</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-3 text-on-surface-variant font-bold text-[14px]">+91</span>
              <input
                id="customer-phone"
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="98201 44520"
                className="w-full bg-surface-container border border-outline-variant/40 rounded-lg pl-12 pr-4 py-2.5 text-on-surface text-[15px] focus:border-primary focus:outline-none transition-all"
              />
            </div>
          </div>
          <span className="font-bold text-[11px] text-secondary flex items-center gap-1 mt-0.5">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            Contract PDF & sound rider will be sent to this number
          </span>
        </div>

        {/* Venue Address */}
        <div className="flex flex-col gap-1">
          <label className="font-bold text-[12px] text-on-surface-variant" htmlFor="venue-address">Complete Venue Address (Optional)</label>
          <textarea
            id="venue-address"
            value={venueAddress}
            onChange={(e) => setVenueAddress(e.target.value)}
            placeholder="The Grand Ballroom, Hotel Name, Address, Pincode. Stage: 24ft x 16ft..."
            rows={3}
            className="w-full bg-surface-container border border-outline-variant/40 rounded-lg p-3 text-on-surface text-[15px] focus:border-primary focus:outline-none transition-all"
          />
        </div>

        {/* Privacy Note */}
        <div className="p-3 bg-surface-container rounded-lg border border-outline-variant/20 flex items-start gap-3">
          <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">lock</span>
          <p className="text-[13px] text-on-surface-variant">
            <strong className="text-on-surface">Strict Privacy Assurance:</strong> Your phone number and venue address are disclosed only to the confirmed performer 24 hours before soundcheck.
          </p>
        </div>

        {/* Terms */}
        <div className="flex items-start gap-3 pt-1">
          <label className="relative flex items-center p-0.5 cursor-pointer mt-0.5">
            <input
              type="checkbox"
              id="terms-checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="w-5 h-5 rounded appearance-none bg-surface-container border border-outline-variant/50 checked:bg-primary checked:border-primary transition-all cursor-pointer"
            />
            <span className="material-symbols-outlined text-on-primary text-[16px] absolute left-0.5 top-0.5 pointer-events-none" style={{ opacity: termsAccepted ? 1 : 0 }}>check</span>
          </label>
          <span className="text-[13px] text-on-surface-variant">
            I agree to the ArtistManch <a href="#" className="text-primary underline">Booking Terms & Conditions</a> and acknowledge the 100% advance refund policy window.
          </span>
        </div>
      </div>
    </div>
  );
}
