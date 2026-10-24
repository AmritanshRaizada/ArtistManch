import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInAnonymously } from 'firebase/auth';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { ARTIST_TYPES, EVENT_TYPES, MAJOR_CITIES, BUDGET_BRACKETS } from '../data/artists';
import type { BudgetBracket } from '../types';

const STEPS = [
  { num: 1, label: 'Occasion' },
  { num: 2, label: 'Artist Type' },
  { num: 3, label: 'Budget' },
  { num: 4, label: 'Date & Time' },
  { num: 5, label: 'Sound & Rider' },
  { num: 6, label: 'Contact Info' },
  { num: 7, label: 'Review' },
  { num: 8, label: 'Payment' },
  { num: 9, label: 'Confirmed' },
];

function generateSubmissionKey(): string {
  return `sk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateLeadId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'AM-';
  for (let i = 0; i < 8; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

export default function BookingWizardPage() {
  const { user } = useAuth();
  const { wizardData, updateWizard } = useBooking();

  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Step 1: Event type & city
  const [eventType, setEventType] = useState(wizardData.eventType || '');
  const [city, setCity] = useState(wizardData.city || '');

  // Step 2: Artist type
  const [artistType, setArtistType] = useState(wizardData.artistType || '');

  // Step 3: Budget
  const [selectedBudget, setSelectedBudget] = useState<BudgetBracket | null>(wizardData.budget || null);
  const [couponCode, setCouponCode] = useState(wizardData.couponCode || '');

  // Step 4: Date & Time
  const [eventDate, setEventDate] = useState(wizardData.eventDate || '');
  const [eventTime, setEventTime] = useState(wizardData.eventTime || '');

  // Step 5: Sound & Rider
  const [soundRequirements, setSoundRequirements] = useState(wizardData.soundRequirements || '');

  // Step 6: Customer details
  const [customerName, setCustomerName] = useState(wizardData.customerName || user?.displayName || '');
  const [customerEmail, setCustomerEmail] = useState(wizardData.customerEmail || user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(wizardData.customerPhone || '');
  const [venueAddress, setVenueAddress] = useState(wizardData.venueAddress || '');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Populate from selected artist if navigated from browse
  useEffect(() => {
    if (wizardData.selectedArtist && !artistType) {
      setArtistType(wizardData.selectedArtist.category);
    }
    if (user?.displayName && !customerName) setCustomerName(user.displayName);
    if (user?.email && !customerEmail) setCustomerEmail(user.email);
  }, [wizardData.selectedArtist, user]);

  // Persist submission key so retries don't create duplicates
  const [submissionKey] = useState(wizardData.submissionKey || generateSubmissionKey());

  const couponApplied = couponCode.trim().toUpperCase() === 'FIRST10';
  const advanceAmount = selectedBudget
    ? couponApplied ? selectedBudget.advanceFirst10 : selectedBudget.advanceStandard
    : 0;

  function progressPct() {
    return ((currentStep - 1) / (STEPS.length - 1)) * 100;
  }

  function validateStep(step: number): string {
    if (step === 1) {
      if (!eventType) return 'Please select an event type.';
      if (!city.trim()) return 'Please enter your event city.';
    }
    if (step === 2) {
      if (!artistType) return 'Please select an artist type.';
    }
    if (step === 3) {
      if (!selectedBudget) return 'Please select a budget bracket.';
    }
    if (step === 4) {
      if (!eventDate) return 'Please enter the event date.';
    }
    if (step === 6) {
      if (!customerName.trim()) return 'Full name is required.';
      if (!customerEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) return 'Please enter a valid email address.';
      if (!customerPhone.trim() || customerPhone.replace(/\D/g, '').length < 10) return 'Please enter a valid 10-digit phone number.';
      if (!termsAccepted) return 'Please accept the Terms & Conditions to proceed.';
    }
    return '';
  }

  async function handleNext() {
    const error = validateStep(currentStep);
    if (error) {
      setSaveError(error);
      return;
    }
    setSaveError('');

    // Sync to context
    updateWizard({
      eventType, city, artistType, budget: selectedBudget || undefined, couponCode,
      eventDate, eventTime, soundRequirements,
      customerName, customerEmail, customerPhone, venueAddress,
      termsAccepted, submissionKey,
    });

    // === CRITICAL: Save to Firestore at Step 6 ===
    if (currentStep === 6) {
      if (!selectedBudget) { setSaveError('Budget information is missing. Please go back and select a budget.'); return; }
      setSaving(true);
      try {
        // Allow both signed-in customers and guests to submit bookings.
        let bookingUser = auth.currentUser;

        if (!bookingUser) {
          const credential = await signInAnonymously(auth);
          bookingUser = credential.user;
        }

        // Use submissionKey as idempotency key (doc ID) to prevent duplicates
        const leadId = wizardData.leadId || generateLeadId();
        const leadsCol = collection(db, 'leads');
        const docRef = doc(leadsCol, submissionKey);

        await setDoc(docRef, {
          leadId,
          submissionKey,
          uid: bookingUser.uid,
          // Artist details
          selectedArtistId: wizardData.selectedArtist?.id || null,
          selectedArtistName: wizardData.selectedArtist?.professional_name || null,
          // Event details
          artistType,
          eventType,
          city,
          // Budget
          budgetLabel: selectedBudget.displayLabel,
          budgetLower: selectedBudget.lower,
          budgetUpper: selectedBudget.upper,
          couponCode: couponCode.trim().toUpperCase() || null,
          advanceAmount,
          // Schedule
          eventDate: eventDate || null,
          eventTime: eventTime || null,
          // Rider
          soundRequirements: soundRequirements || null,
          // Customer
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          customerPhone: customerPhone.trim(),
          venueAddress: venueAddress.trim() || null,
          // Metadata
          status: 'enquiry_saved',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }, { merge: true }); // merge: true = idempotent — won't duplicate if retried

        // Save leadId to context so review page can display it
        updateWizard({ leadId, submissionKey });

        setSaving(false);
        setCurrentStep(7);
      } catch (err) {
        console.error('Firestore save error:', err);
        setSaving(false);
        setSaveError('Failed to save your enquiry. Please check your connection and try again. Your form data is preserved.');
        return; // Do NOT navigate — keep user on step 6
      }
      return; // Navigation handled above
    }

    setCurrentStep((prev) => Math.min(prev + 1, 9));
  }

  function handleBack() {
    setSaveError('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }

  return (
    <div className="w-full pt-28 min-h-screen bg-surface">
      <div className="relative w-full max-w-[1320px] mx-auto px-4 md:px-12 py-4 md:py-10">
        {/* Atmospheric Glows */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[540px] h-[280px] rounded-full blur-[110px] pointer-events-none -z-10" style={{ background: 'rgba(96,1,209,0.2)' }} />

        {/* Header */}
        <section className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-outline-variant/20">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-[12px] uppercase tracking-wider mb-2">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                <span>Secure 9-Stage Concierge Booking</span>
                <span className="text-on-surface-variant">•</span>
                <span className="text-secondary font-semibold">Festive Season 2025</span>
              </div>
              <h1 className="font-playfair text-[28px] md:text-[40px] font-semibold text-on-surface" style={{ letterSpacing: '-0.015em' }}>
                Reserve Your Artist <span className="italic font-normal text-primary">with Just 20%</span>
              </h1>
              <p className="text-[15px] text-on-surface-variant max-w-2xl mt-1">
                Zero full advance lock-ins. Verified stage availability and 100% deposit protection.
              </p>
            </div>
            <div className="flex flex-col items-start lg:items-end gap-2">
              <div className="flex items-center gap-2 bg-surface-container-high px-4 py-1.5 rounded-full">
                <span className="font-bold text-[11px] uppercase tracking-wider text-on-surface-variant">Active Stage:</span>
                <span className="font-bold text-[12px] text-primary">Step {currentStep} of 9: {STEPS[currentStep - 1]?.label}</span>
                <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse ml-1" />
              </div>
              <div className="w-full lg:w-72 bg-surface-container-highest rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPct()}%`, background: 'linear-gradient(to right, #f2ca50, #ffe088, #d2bbff)' }}
                />
              </div>
              <span className="font-bold text-[11px] text-on-surface-variant">Completion: {Math.round(progressPct())}%</span>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="mt-4 overflow-x-auto pb-2">
            <div className="min-w-[860px] flex items-center justify-between relative">
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-surface-variant" />
              {STEPS.map((step) => {
                const isDone = currentStep > step.num;
                const isActive = currentStep === step.num;
                return (
                  <div key={step.num} className="relative z-10 flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] transition-all ${
                      isDone ? 'bg-secondary-container text-on-secondary shadow-[0_0_12px_rgba(96,1,209,0.3)]'
                        : isActive ? 'bg-primary text-on-primary ring-4 ring-primary/20 shadow-[0_0_24px_rgba(212,175,55,0.45)] scale-110'
                          : 'bg-surface-container border border-outline-variant/60 text-on-surface-variant'
                    }`}>
                      {isDone ? <span className="material-symbols-outlined text-[16px]">check</span> : step.num}
                    </div>
                    <span className={`font-bold text-[11px] text-center ${isActive ? 'text-primary' : isDone ? 'text-on-surface-variant' : 'text-on-surface-variant/50'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Save Error Banner */}
        {saveError && (
          <div className="mb-4 p-4 rounded-xl bg-error-container/30 border border-error/30 flex items-start gap-3">
            <span className="material-symbols-outlined text-error text-[20px] shrink-0 mt-0.5">error</span>
            <div className="flex-1">
              <p className="font-bold text-[14px] text-error mb-1">Action Required</p>
              <p className="text-[13px] text-error">{saveError}</p>
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            {currentStep === 1 && <Step1 eventType={eventType} setEventType={setEventType} city={city} setCity={setCity} />}
            {currentStep === 2 && <Step2 artistType={artistType} setArtistType={setArtistType} selectedArtist={wizardData.selectedArtist} />}
            {currentStep === 3 && <Step3 selectedBudget={selectedBudget} setSelectedBudget={setSelectedBudget} />}
            {currentStep === 4 && <Step4 eventDate={eventDate} setEventDate={setEventDate} eventTime={eventTime} setEventTime={setEventTime} />}
            {currentStep === 5 && <Step5 soundRequirements={soundRequirements} setSoundRequirements={setSoundRequirements} />}
            {currentStep === 6 && (
              <Step6
                customerName={customerName} setCustomerName={setCustomerName}
                customerEmail={customerEmail} setCustomerEmail={setCustomerEmail}
                customerPhone={customerPhone} setCustomerPhone={setCustomerPhone}
                venueAddress={venueAddress} setVenueAddress={setVenueAddress}
                termsAccepted={termsAccepted} setTermsAccepted={setTermsAccepted}
              />
            )}
            {currentStep === 7 && (
              <Step7
                wizardData={wizardData}
                advanceAmount={advanceAmount}
                onEdit={(step: number) => setCurrentStep(step)}
              />
            )}
            {currentStep === 8 && <Step8 wizardData={wizardData} advanceAmount={advanceAmount} />}
            {currentStep === 9 && <Step9 wizardData={wizardData} />}
          </div>

          {/* Right Sidebar: Advance Calculator */}
          <div className="lg:col-span-4">
            <div className="bg-surface-container p-6 rounded-xl flex flex-col gap-4 shadow-lg sticky top-32">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[11px] uppercase tracking-wider text-secondary">Smart Transparent Quote</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  <span className="material-symbols-outlined text-[13px]">shield</span> SECURE
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-on-surface-variant text-[13px]">
                  <span>Selected Budget:</span>
                  <span className="font-semibold text-[18px] text-on-surface font-bold">{selectedBudget?.displayLabel || 'Not selected'}</span>
                </div>
                <div className="flex items-center justify-between text-on-surface-variant text-[13px]">
                  <span>Regular Advance (20%):</span>
                  <span className="text-on-surface font-bold">₹{selectedBudget ? selectedBudget.advanceStandard.toLocaleString('en-IN') : '—'}</span>
                </div>
                {/* Coupon Box */}
                <div className="p-3 rounded-lg bg-surface-container-lowest">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-[18px]">local_offer</span>
                      <span className="font-bold text-[12px] text-primary">FIRST10 Code</span>
                    </div>
                    <span className="font-bold text-[11px] text-secondary uppercase">10% Advance</span>
                  </div>
                  <div className="flex items-baseline justify-between mt-1 pt-1">
                    <span className="text-[13px] text-on-surface-variant">Pay now to reserve:</span>
                    <span className="font-playfair text-[22px] font-semibold text-primary">₹{selectedBudget ? selectedBudget.advanceFirst10.toLocaleString('en-IN') : '—'}</span>
                  </div>
                </div>

                {/* Applied Coupon */}
                {currentStep >= 3 && (
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-[12px] text-on-surface-variant uppercase tracking-wider">Apply Coupon</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="FIRST10"
                        className="flex-1 bg-surface-container-low text-on-surface px-3 py-2 rounded-lg text-[14px] focus:outline-none focus:border-primary border border-transparent"
                      />
                      {couponApplied && (
                        <span className="flex items-center px-2 rounded-lg bg-primary/10 border border-primary/30 text-primary">
                          <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        </span>
                      )}
                    </div>
                    {couponApplied && <p className="text-[11px] text-primary font-bold">✓ FIRST10 applied — pay only 10%!</p>}
                  </div>
                )}

                {/* Your advance */}
                {selectedBudget && (
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="font-bold text-[12px] text-on-surface uppercase tracking-wider mb-1">Your Advance to Pay</p>
                    <p className="font-playfair text-[28px] font-bold text-primary">₹{advanceAmount.toLocaleString('en-IN')}</p>
                    {couponApplied && <p className="text-[11px] text-primary">With FIRST10 (10% of ₹{selectedBudget.lower.toLocaleString('en-IN')})</p>}
                    {!couponApplied && <p className="text-[11px] text-on-surface-variant">20% of ₹{selectedBudget.lower.toLocaleString('en-IN')}</p>}
                  </div>
                )}
              </div>

              {/* Guarantees */}
              <div className="space-y-1.5 pt-2">
                {[
                  'Balance payable directly at event venue',
                  '100% full refund if artist unavailable',
                  'Verified artists only — no surprises',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-on-surface-variant text-[13px]">
                    <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        {currentStep < 9 && (
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-outline-variant/20">
            {currentStep > 1 ? (
              <button onClick={handleBack} className="flex items-center gap-1 text-[14px] text-on-surface-variant hover:text-on-surface transition-colors font-bold">
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                <span>Back</span>
              </button>
            ) : <div />}

            {currentStep < 8 && (
              <button
                id={`wizard-next-step-${currentStep}`}
                onClick={handleNext}
                disabled={saving}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-container hover:bg-primary text-on-primary font-bold text-[14px] rounded-xl shadow-gold hover:shadow-gold-lg transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                    <span>Saving Enquiry...</span>
                  </>
                ) : (
                  <>
                    <span>{currentStep === 6 ? 'Save & Review Booking' : 'Continue'}</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================
// Step 1: Occasion & City
// ============================
function Step1({ eventType, setEventType, city, setCity }: {
  eventType: string; setEventType: (v: string) => void;
  city: string; setCity: (v: string) => void;
}) {
  return (
    <div className="bg-surface-container-low p-6 md:p-8 rounded-xl border border-outline-variant/30 flex flex-col gap-6">
      <div>
        <h2 className="font-playfair text-[28px] font-semibold text-on-surface mb-1">Tell us about your celebration</h2>
        <p className="text-[15px] text-on-surface-variant">Start by selecting your event type and location.</p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold text-[12px] text-on-surface uppercase tracking-wider">Celebration Occasion *</label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-3.5 text-on-surface-variant text-[20px]">event</span>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            id="event-type-select"
            className="w-full bg-surface-container-high text-on-surface pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary appearance-none text-[15px]"
          >
            <option value="">Select event type...</option>
            {EVENT_TYPES.map((et) => <option key={et} value={et}>{et}</option>)}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-3.5 text-on-surface-variant text-[20px] pointer-events-none">expand_more</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold text-[12px] text-on-surface uppercase tracking-wider">Event City / Destination *</label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-3.5 text-on-surface-variant text-[20px]">location_on</span>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter venue city..."
            id="event-city-input"
            list="cities-list"
            className="w-full bg-surface-container-high text-on-surface pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-[15px]"
          />
          <datalist id="cities-list">
            {MAJOR_CITIES.map((c) => <option key={c} value={c} />)}
          </datalist>
        </div>
      </div>
    </div>
  );
}

// ============================
// Step 2: Artist Type
// ============================
function Step2({ artistType, setArtistType, selectedArtist }: {
  artistType: string; setArtistType: (v: string) => void;
  selectedArtist?: { professional_name: string; category: string; profile_pic: string };
}) {
  return (
    <div className="bg-surface-container-low p-6 md:p-8 rounded-xl border border-outline-variant/30 flex flex-col gap-6">
      <div>
        <h2 className="font-playfair text-[28px] font-semibold text-on-surface mb-1">Select Performer Type</h2>
        <p className="text-[15px] text-on-surface-variant">What kind of artist are you looking for?</p>
      </div>

      {selectedArtist && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 border border-primary/20">
          <img src={selectedArtist.profile_pic} alt={selectedArtist.professional_name} className="w-10 h-10 rounded-lg object-cover" />
          <div>
            <p className="font-bold text-[13px] text-primary">Selected Artist: {selectedArtist.professional_name}</p>
            <p className="text-[12px] text-on-surface-variant">Category: {selectedArtist.category}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ARTIST_TYPES.map(({ value, icon, subtitle }) => (
          <button
            key={value}
            type="button"
            onClick={() => setArtistType(value)}
            id={`artist-type-${value.replace(/\s+/g, '-').toLowerCase()}`}
            className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all text-center ${
              artistType === value
                ? 'bg-surface-container ring-2 ring-primary text-primary'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[28px] mb-1">{icon}</span>
            <span className="font-bold text-[12px]">{value}</span>
            <span className="font-bold text-[11px] opacity-80 mt-0.5">{subtitle}</span>
          </button>
        ))}
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
                  <span className={`font-bold text-[11px] uppercase tracking-wider block mb-1 ${isSelected ? 'text-primary' : 'text-on-surface-variant'}`}>{bracket.label}</span>
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
  const today = new Date().toISOString().split('T')[0];
  return (
    <div className="bg-surface-container-low p-6 md:p-8 rounded-xl border border-outline-variant/30 flex flex-col gap-6">
      <div>
        <h2 className="font-playfair text-[28px] font-semibold text-on-surface mb-1">Event Date & Time</h2>
        <p className="text-[15px] text-on-surface-variant">When is your celebration?</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-bold text-[12px] text-on-surface uppercase tracking-wider" htmlFor="event-date">Event Date *</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-3.5 text-on-surface-variant text-[20px]">calendar_today</span>
            <input
              id="event-date"
              type="date"
              value={eventDate}
              min={today}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full bg-surface-container-high text-on-surface pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-[15px]"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-bold text-[12px] text-on-surface uppercase tracking-wider" htmlFor="event-time">Showtime (Approximate)</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-3.5 text-on-surface-variant text-[20px]">schedule</span>
            <input
              id="event-time"
              type="time"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              className="w-full bg-surface-container-high text-on-surface pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-[15px]"
            />
          </div>
        </div>
      </div>
      <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/20 flex items-start gap-3">
        <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">info</span>
        <p className="text-[13px] text-on-surface-variant">
          Artists typically arrive 2 hours before showtime for soundcheck. We'll coordinate the exact schedule after your booking is confirmed.
        </p>
      </div>
    </div>
  );
}

// ============================
// Step 5: Sound & Rider
// ============================
function Step5({ soundRequirements, setSoundRequirements }: {
  soundRequirements: string; setSoundRequirements: (v: string) => void;
}) {
  return (
    <div className="bg-surface-container-low p-6 md:p-8 rounded-xl border border-outline-variant/30 flex flex-col gap-6">
      <div>
        <h2 className="font-playfair text-[28px] font-semibold text-on-surface mb-1">Sound & Rider Requirements</h2>
        <p className="text-[15px] text-on-surface-variant">Tell us about your venue's PA setup and any special requirements. (Optional)</p>
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-bold text-[12px] text-on-surface uppercase tracking-wider" htmlFor="sound-requirements">Venue & Sound Details</label>
        <textarea
          id="sound-requirements"
          value={soundRequirements}
          onChange={(e) => setSoundRequirements(e.target.value)}
          placeholder="e.g., 24ft x 16ft stage, in-house PA with sound engineer, wireless mics needed, outdoor garden setting..."
          rows={4}
          className="w-full bg-surface-container-high text-on-surface placeholder:text-on-surface-variant/40 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-[15px]"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {['Outdoor Venue', 'In-house PA System', 'Wireless Mics Needed', 'Projector / LED Wall', 'Dhol Player', 'Background Dancers'].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setSoundRequirements(soundRequirements ? `${soundRequirements}, ${item}` : item)}
            className="px-3 py-2 rounded-lg bg-surface-container border border-outline-variant/30 hover:border-primary/40 text-on-surface-variant hover:text-on-surface text-[13px] font-bold text-left transition-all"
          >
            + {item}
          </button>
        ))}
      </div>
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
          Clicking "Save & Review Booking" will save your complete enquiry to our system and generate a Lead ID.
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

// ============================
// Step 7: Booking Review
// ============================
function Step7({ wizardData, advanceAmount, onEdit }: {
  wizardData: ReturnType<typeof useBooking>['wizardData'];
  advanceAmount: number;
  onEdit: (step: number) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Lead ID Banner */}
      {wizardData.leadId && (
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          <div>
            <p className="font-bold text-[14px] text-primary">Enquiry Saved Successfully!</p>
            <p className="text-[13px] text-on-surface-variant">Your Lead ID: <strong className="text-primary tracking-wider">{wizardData.leadId}</strong></p>
          </div>
        </div>
      )}

      <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/30">
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20 mb-4">
          <div className="flex items-center gap-2 text-primary font-bold text-[12px] uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>Stage Booking Specification</span>
          </div>
          <button onClick={() => onEdit(1)} className="font-bold text-[12px] text-primary hover:underline flex items-center gap-0.5">
            Edit <span className="material-symbols-outlined text-[14px]">edit</span>
          </button>
        </div>

        {/* Selected Artist */}
        {wizardData.selectedArtist && (
          <div className="flex items-center gap-4 pb-4 border-b border-outline-variant/10 mb-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-primary/40 shrink-0">
              <img src={wizardData.selectedArtist.profile_pic} alt={wizardData.selectedArtist.professional_name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-playfair text-[22px] font-semibold text-on-surface">{wizardData.selectedArtist.professional_name}</h3>
              <p className="text-[13px] text-on-surface-variant">{wizardData.selectedArtist.category}</p>
            </div>
          </div>
        )}

        {/* Booking Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: 'celebration', label: 'Event Type', value: wizardData.eventType || '—' },
            { icon: 'location_on', label: 'City', value: wizardData.city || '—' },
            { icon: 'calendar_today', label: 'Event Date', value: wizardData.eventDate || '—' },
            { icon: 'schedule', label: 'Showtime', value: wizardData.eventTime || '—' },
            { icon: 'mic', label: 'Artist Type', value: wizardData.artistType || '—' },
            { icon: 'payments', label: 'Budget', value: wizardData.budget?.displayLabel || '—' },
          ].map(({ icon, label, value }) => (
            <div key={label} className="p-3 bg-surface-container rounded-lg">
              <span className="font-bold text-[11px] text-on-surface-variant block uppercase tracking-wider">{label}</span>
              <span className="font-semibold text-[15px] text-on-surface flex items-center gap-1.5 mt-0.5">
                <span className="material-symbols-outlined text-[18px] text-primary">{icon}</span>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Details */}
      <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-[14px] text-on-surface uppercase tracking-wider">Contact Details</h3>
          <button onClick={() => onEdit(6)} className="font-bold text-[12px] text-primary hover:underline flex items-center gap-0.5">
            Edit <span className="material-symbols-outlined text-[14px]">edit</span>
          </button>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[15px]">
            <span className="material-symbols-outlined text-primary text-[18px]">person</span>
            <span className="text-on-surface">{wizardData.customerName || '—'}</span>
          </div>
          <div className="flex items-center gap-2 text-[15px]">
            <span className="material-symbols-outlined text-primary text-[18px]">mail</span>
            <span className="text-on-surface">{wizardData.customerEmail || '—'}</span>
          </div>
          <div className="flex items-center gap-2 text-[15px]">
            <span className="material-symbols-outlined text-primary text-[18px]">phone</span>
            <span className="text-on-surface">+91 {wizardData.customerPhone || '—'}</span>
          </div>
        </div>
      </div>

      {/* Pricing Summary */}
      <div className="bg-surface-container-low p-6 rounded-xl border border-primary/20">
        <h3 className="font-bold text-[14px] text-on-surface uppercase tracking-wider mb-4">Pricing Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-[15px]">
            <span className="text-on-surface-variant">Estimated Budget:</span>
            <span className="font-bold text-on-surface">{wizardData.budget?.displayLabel || '—'}</span>
          </div>
          {wizardData.couponCode === 'FIRST10' && (
            <div className="flex justify-between text-[15px]">
              <span className="text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-primary">local_offer</span>
                Coupon Applied (FIRST10):
              </span>
              <span className="font-bold text-primary">10% Advance</span>
            </div>
          )}
          <div className="flex justify-between text-[18px] pt-2 border-t border-outline-variant/20">
            <span className="font-bold text-on-surface">Advance to Pay Now:</span>
            <span className="font-playfair font-bold text-primary">₹{advanceAmount.toLocaleString('en-IN')}</span>
          </div>
          <p className="text-[12px] text-on-surface-variant">Balance payable directly to artist at venue after performance.</p>
          <p className="text-[12px] text-on-surface-variant">Status: <span className="text-emerald-400 font-bold">Enquiry Saved</span></p>
        </div>
      </div>
    </div>
  );
}

// ============================
// Step 8: Payment (Placeholder)
// ============================
function Step8({ wizardData, advanceAmount }: {
  wizardData: ReturnType<typeof useBooking>['wizardData'];
  advanceAmount: number;
}) {
  return (
    <div className="bg-surface-container-low p-6 md:p-8 rounded-xl border border-outline-variant/30 flex flex-col gap-6">
      <div>
        <h2 className="font-playfair text-[28px] font-semibold text-on-surface mb-1">Pay Advance</h2>
        <p className="text-[15px] text-on-surface-variant">Lock your artist by paying the advance amount.</p>
      </div>
      <div className="p-6 rounded-xl bg-surface-container border border-primary/20 text-center">
        <p className="font-bold text-[12px] text-on-surface-variant uppercase tracking-wider mb-2">Advance Amount</p>
        <p className="font-playfair text-[48px] font-bold text-primary">₹{advanceAmount.toLocaleString('en-IN')}</p>
        <p className="text-[13px] text-on-surface-variant mt-1">
          {wizardData.couponCode === 'FIRST10' ? '10% advance (FIRST10 applied)' : '20% advance (standard rate)'}
        </p>
        <p className="text-[13px] text-on-surface-variant">Lead ID: <span className="text-primary font-bold">{wizardData.leadId}</span></p>
      </div>
      <div className="p-4 rounded-xl bg-surface-container-high border border-outline-variant/20 flex items-center gap-3">
        <span className="material-symbols-outlined text-secondary text-[22px]">info</span>
        <p className="text-[14px] text-on-surface-variant">
          <strong className="text-on-surface">Payment integration coming soon.</strong> Our concierge team will reach out on your WhatsApp to arrange advance payment and confirm your booking.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <a
          href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210'}?text=Hi, I've submitted a booking enquiry on ArtistManch. My Lead ID is ${wizardData.leadId}. Please help me with the advance payment.`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-4 rounded-xl text-on-primary font-bold text-[14px] flex items-center justify-center gap-2 shadow-gold transition-all hover:scale-[1.02]"
          style={{ background: '#25D366' }}
        >
          <span className="material-symbols-outlined text-[20px]">chat</span>
          Contact Us on WhatsApp
        </a>
      </div>
    </div>
  );
}

// ============================
// Step 9: Confirmation
// ============================
function Step9({ wizardData }: { wizardData: ReturnType<typeof useBooking>['wizardData'] }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center text-center gap-6 py-8">
      <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
        <span className="material-symbols-outlined text-primary text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>celebration</span>
      </div>
      <div>
        <h2 className="font-playfair text-[36px] font-bold text-on-surface mb-2">
          Enquiry <span className="text-primary">Submitted!</span>
        </h2>
        <p className="text-[18px] text-on-surface-variant max-w-lg">
          Your booking enquiry has been saved. Our concierge team will match you with the perfect artist and be in touch within 28 minutes.
        </p>
      </div>
      {wizardData.leadId && (
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-container border border-primary/20">
          <span className="material-symbols-outlined text-primary text-[20px]">receipt_long</span>
          <div className="text-left">
            <p className="font-bold text-[12px] text-on-surface-variant uppercase tracking-wider">Your Lead ID</p>
            <p className="font-bold text-[18px] text-primary tracking-wider">{wizardData.leadId}</p>
          </div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={() => navigate('/dashboard')} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-bold text-[14px] rounded-xl shadow-gold transition-all hover:scale-[1.02]">
          <span>View My Bookings</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
        <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 px-6 py-3 bg-surface-container text-on-surface font-bold text-[14px] rounded-xl transition-all hover:bg-surface-container-high">
          <span>Back to Home</span>
        </button>
      </div>
    </div>
  );
}
