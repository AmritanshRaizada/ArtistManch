import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInAnonymously } from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { useBooking } from '../contexts/BookingContext';
import { useAuth } from '../contexts/AuthContext';
import { MAJOR_CITIES } from '../data/artists';

const BUDGET_MILESTONES = [
  10_000,
  50_000,
  500_000,
  2_500_000,
  5_000_000,
  10_000_000,
  50_000_000,
  100_000_000,
] as const;

const MIN_BUDGET = BUDGET_MILESTONES[0];
const MAX_BUDGET = BUDGET_MILESTONES[BUDGET_MILESTONES.length - 1];

const BUDGET_MILESTONE_LABELS = [
  '₹10K',
  '₹50K',
  '₹5L',
  '₹25L',
  '₹50L',
  '₹1Cr',
  '₹5Cr',
  '₹10Cr',
];

function formatINR(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

function parseBudget(value: string) {
  const parsed = Number(value.replace(/[,\s₹]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function ArtistBookingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { wizardData } = useBooking();
  const artist = wizardData.selectedArtist;

  const [eventType, setEventType] = useState('');
  const [customEventType, setCustomEventType] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [city, setCity] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [attendees, setAttendees] = useState('');
  const [duration, setDuration] = useState('');
  const [budget, setBudget] = useState<number>(MIN_BUDGET);
  const [budgetText, setBudgetText] = useState(String(MIN_BUDGET));
  const [customerName, setCustomerName] = useState(user?.displayName || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [requirements, setRequirements] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successId, setSuccessId] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const artistLanguages = useMemo(() => {
    const value = (artist as (typeof artist & {
      languages?: string[] | string;
      language?: string[] | string;
      duration?: string;
      performance_duration?: string;
    }) | undefined)?.languages ??
      (artist as (typeof artist & { language?: string[] | string }) | undefined)?.language;
    return Array.isArray(value) ? value.join(', ') : value || 'Not specified';
  }, [artist]);

  const artistDuration = (artist as (typeof artist & {
    duration?: string;
    performance_duration?: string;
  }) | undefined)?.duration ||
    (artist as (typeof artist & { performance_duration?: string }) | undefined)?.performance_duration ||
    'To be discussed';

  function getBudgetMilestoneIndex(value: number) {
    return BUDGET_MILESTONES.reduce((closestIndex, milestone, index) => {
      const currentDistance = Math.abs(BUDGET_MILESTONES[closestIndex] - value);
      const nextDistance = Math.abs(milestone - value);
      return nextDistance < currentDistance ? index : closestIndex;
    }, 0);
  }

  function updateBudgetFromSlider(index: number) {
    const selectedBudget = BUDGET_MILESTONES[index] ?? MIN_BUDGET;
    setBudget(selectedBudget);
    setBudgetText(String(selectedBudget));
  }

  function updateBudgetFromInput(value: string) {
    setBudgetText(value);
    const parsed = parseBudget(value);
    if (parsed >= MIN_BUDGET && parsed <= MAX_BUDGET) {
      setBudget(parsed);
    }
  }

  function continueFromEventDetails() {
    setError('');
    if (!eventType || (eventType === 'Other' && !customEventType.trim()) ||
        !eventDate || !city || (city === 'Other' && !customCity.trim()) ||
        !venueAddress.trim() || !attendees || Number(attendees) < 1) {
      setError('Please complete all required event details before continuing.');
      return;
    }
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function continueToReview() {
    setError('');
    if (!customerName.trim() || !customerEmail.trim() ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim()) ||
        customerPhone.replace(/\D/g, '').length !== 10) {
      setError('Please enter your name, a valid email address and a 10-digit mobile number.');
      return;
    }
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!artist) {
      setError('Please select an artist first. Return to Browse Artists and choose Book Now.');
      return;
    }

    if (eventType === 'Other' && !customEventType.trim()) {
      setError('Please enter your occasion.');
      return;
    }

    if (city === 'Other' && !customCity.trim()) {
      setError('Please enter your venue city.');
      return;
    }

    const finalEventType = eventType === 'Other' ? customEventType.trim() : eventType;
    const finalCity = city === 'Other' ? customCity.trim() : city;

    const parsedBudget = parseBudget(budgetText);
    if (parsedBudget < MIN_BUDGET || parsedBudget > MAX_BUDGET) {
      setError('Please enter a budget between ₹10,000 and ₹10 crore.');
      return;
    }

    if (customerPhone.replace(/\D/g, '').length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setSaving(true);
    try {
      let currentUser = auth.currentUser;
      if (!currentUser) {
        const credential = await signInAnonymously(auth);
        currentUser = credential.user;
      }

      const docRef = await addDoc(collection(db, 'Artist_Booking'), {
        bookingType: 'individual_artist',
        artist: {
          id: artist.id,
          slug: artist.slug,
          professionalName: artist.professional_name,
          category: artist.category,
        },
        event: {
          type: finalEventType,
          date: eventDate,
          time: eventTime || null,
          city: finalCity,
          venueAddress,
          expectedAttendees: Number(attendees),
          performanceDuration: duration,
        },
        budget: {
          amount: parsedBudget,
          currency: 'INR',
          formatted: formatINR(parsedBudget),
        },
        customer: {
          uid: currentUser.uid,
          name: customerName.trim(),
          email: customerEmail.trim(),
          phone: customerPhone.replace(/\D/g, ''),
        },
        additionalRequirements: requirements.trim() || null,
        status: 'new',
        source: 'browse_artists',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setSuccessId(docRef.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (submitError) {
      console.error('Artist booking save failed:', submitError);
      setError('We could not submit your booking request. Please try again. Your entered details are still on this page.');
    } finally {
      setSaving(false);
    }
  }

  if (!artist) {
    return (
      <main className="min-h-screen bg-[#0d0b12] px-4 pt-32 pb-16 text-white">
        <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-[#15121c] p-8 text-center">
          <h1 className="font-playfair text-3xl font-bold text-[#e7c879]">Choose an artist first</h1>
          <p className="mt-3 text-white/65">Open Browse Artists and select Book Now on the artist you want.</p>
          <button onClick={() => navigate('/browse')} className="mt-6 rounded-xl bg-gradient-to-r from-amber-500 to-pink-500 px-6 py-3 font-semibold text-white">
            Browse Artists
          </button>
        </div>
      </main>
    );
  }

  if (successId) {
    return (
      <main className="min-h-screen bg-[#0d0b12] px-4 pt-32 pb-16 text-white">
        <div className="mx-auto max-w-2xl rounded-2xl border border-[#d6b46a]/30 bg-[#15121c] p-8 text-center">
          <span className="material-symbols-outlined text-5xl text-[#e7c879]">check_circle</span>
          <h1 className="mt-4 font-playfair text-3xl font-bold text-[#e7c879]">Request submitted!</h1>
          <p className="mt-3 text-white/70">Your booking request for {artist.professional_name} has been saved.</p>
          <p className="mt-2 text-sm text-white/50">Reference: {successId}</p>
          <button onClick={() => navigate('/')} className="mt-6 rounded-xl bg-gradient-to-r from-amber-500 to-pink-500 px-6 py-3 font-semibold text-white">
            Back to Home
          </button>
        </div>
      </main>
    );
  }

  const fieldClass = 'mt-2 w-full rounded-xl border border-white/10 bg-[#100e17] px-4 py-3.5 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-[#d6b46a] focus:ring-2 focus:ring-[#d6b46a]/20';
  const labelClass = 'block text-sm font-medium text-white/75';

  const steps = [
    { number: 1, title: 'Event details', subtitle: 'Plan the performance' },
    { number: 2, title: 'Your details', subtitle: 'How can we reach you?' },
    { number: 3, title: 'Review', subtitle: 'Confirm your enquiry' },
  ];

  const finalEventType = eventType === 'Other' ? customEventType.trim() : eventType;
  const finalCity = city === 'Other' ? customCity.trim() : city;

  return (
    <main className="min-h-screen bg-[#09080e] px-4 pb-20 pt-28 text-white md:px-8">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-purple-700/10 blur-[130px]" />
        <div className="absolute -right-40 top-72 h-96 w-96 rounded-full bg-amber-500/10 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <header className="mb-8">
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.35em] text-[#d6b46a]">ARTISTMANCH / BOOKING STUDIO</p>
          <h1 className="mt-3 text-center text-3xl font-semibold tracking-tight md:text-5xl">
            Let’s make your event <span className="bg-gradient-to-r from-[#f5cf65] via-[#f1c0a4] to-[#d99bd7] bg-clip-text text-transparent">unforgettable.</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-6 text-white/50">
            A few details are all we need to get your artist booking started.
          </p>
        </header>

        {/* Selected artist */}
        <section className="mb-5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl md:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#d6b46a]/25 bg-[#d6b46a]/10 text-[#e7c879]">
                <span className="material-symbols-outlined text-2xl">artist</span>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">You’re booking</p>
                <h2 className="mt-1 break-words text-xl font-semibold tracking-tight md:text-2xl">{artist.professional_name}</h2>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/50">
                  <span className="rounded-full border border-[#d6b46a]/30 bg-[#d6b46a]/10 px-2.5 py-1 text-[#e7c879]">{artist.category}</span>
                  <span>{artistLanguages}</span>
                  <span className="text-white/20">•</span>
                  <span>{artistDuration}</span>
                </div>
              </div>
            </div>
            <button type="button" onClick={() => navigate('/browse')} className="self-start rounded-lg border border-white/10 px-4 py-2 text-xs font-semibold text-white/60 transition hover:border-[#d6b46a]/50 hover:text-[#e7c879] sm:self-center">
              Change artist ↗
            </button>
          </div>
        </section>

        {/* Budget control sits above the three-step flow */}
        <section className="mb-5 rounded-2xl border border-[#d6b46a]/25 bg-gradient-to-br from-[#211a29] via-[#17131f] to-[#111019] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[#d6b46a]">
                <span className="material-symbols-outlined text-base">payments</span>
                Set your budget
              </div>
              <p className="mt-1 text-xs text-white/45">What are you comfortable investing in this performance?</p>
            </div>
            <div className="sm:text-right">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">Your budget</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-[#f5cf65] md:text-3xl">{formatINR(budget)}</p>
            </div>
          </div>
          <div className="mt-5">
            <input
              aria-label="Booking budget slider"
              type="range"
              min={0}
              max={BUDGET_MILESTONES.length - 1}
              step={1}
              value={getBudgetMilestoneIndex(budget)}
              onChange={e => updateBudgetFromSlider(Number(e.target.value))}
              className="h-8 w-full cursor-pointer touch-pan-x accent-[#e8bd62]"
            />
            <div className="mt-3 grid grid-cols-4 gap-2 text-center sm:grid-cols-8 sm:gap-1">
              {BUDGET_MILESTONE_LABELS.map((label, index) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => updateBudgetFromSlider(index)}
                  aria-label={`Set budget to ${formatINR(BUDGET_MILESTONES[index])}`}
                  className={`min-h-9 rounded-lg px-1 py-2 text-[10px] font-semibold transition sm:min-h-0 sm:rounded-md sm:py-1 sm:text-[10px] ${
                    getBudgetMilestoneIndex(budget) === index
                      ? 'bg-[#d6b46a]/15 text-[#f5cf65]'
                      : 'text-white/40 hover:text-white/75'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <label className="text-xs text-white/55" htmlFor="custom-budget">Or enter a custom amount</label>
            <div className="relative sm:w-64">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#d6b46a]">₹</span>
              <input
                id="custom-budget"
                type="number"
                min={MIN_BUDGET}
                max={MAX_BUDGET}
                step="1000"
                value={budgetText}
                onChange={e => updateBudgetFromInput(e.target.value)}
                onBlur={() => {
                  const parsed = parseBudget(budgetText);
                  if (parsed >= MIN_BUDGET && parsed <= MAX_BUDGET) {
                    setBudget(parsed);
                    setBudgetText(String(parsed));
                  }
                }}
                className="w-full rounded-xl border border-white/10 bg-black/25 py-3 pl-9 pr-4 text-sm text-white outline-none transition focus:border-[#d6b46a]"
                placeholder="Enter amount"
              />
            </div>
          </div>
          <p className="mt-2 text-[10px] text-white/35">Budget range: ₹10,000 – ₹10 crore. This is an indicative budget, not a payment.</p>
        </section>

        {/* Step progress */}
        <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.025] p-4 md:p-5">
          <div className="flex items-center justify-between gap-2">
            {steps.map((step, index) => (
              <div key={step.number} className="flex min-w-0 flex-1 items-center">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition ${
                    currentStep > step.number
                      ? 'border-[#d6b46a] bg-[#d6b46a] text-[#17121a]'
                      : currentStep === step.number
                        ? 'border-[#e7c879] bg-[#d6b46a]/15 text-[#f5cf65] shadow-[0_0_22px_rgba(214,180,106,0.12)]'
                        : 'border-white/15 bg-white/[0.03] text-white/35'
                  }`}>
                    {currentStep > step.number ? <span className="material-symbols-outlined text-lg">check</span> : `0${step.number}`}
                  </div>
                  <div className="hidden min-w-0 sm:block">
                    <p className={`truncate text-xs font-semibold ${currentStep === step.number ? 'text-[#f5cf65]' : currentStep > step.number ? 'text-white/75' : 'text-white/35'}`}>{step.title}</p>
                    <p className="mt-0.5 truncate text-[10px] text-white/30">{step.subtitle}</p>
                  </div>
                </div>
                {index < steps.length - 1 && <div className={`mx-2 h-px flex-1 sm:mx-4 ${currentStep > step.number ? 'bg-[#d6b46a]/70' : 'bg-white/10'}`} />}
              </div>
            ))}
          </div>
          <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/5">
            <div className="h-full rounded-full bg-gradient-to-r from-[#d6b46a] to-[#e6a7c7] transition-all duration-500" style={{ width: `${(currentStep / 3) * 100}%` }} />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* STEP 1 */}
          {currentStep === 1 && (
            <section className="rounded-2xl border border-white/10 bg-[#14111b]/95 p-5 shadow-2xl backdrop-blur-xl md:p-8">
              <div className="mb-7 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#d6b46a]">Step 01 / 03</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">Tell us about your event</h2>
                  <p className="mt-2 text-sm text-white/45">Let’s get the important details in place.</p>
                </div>
                <span className="material-symbols-outlined hidden text-4xl text-[#d6b46a]/70 sm:block">event_available</span>
              </div>

              <div className="grid gap-x-5 gap-y-5 md:grid-cols-2">
                <label className={labelClass}>Occasion <span className="text-[#e7c879]">*</span>
                  <select required value={eventType} onChange={e => { setEventType(e.target.value); setCustomEventType(''); }} className={fieldClass}>
                    <option value="">Choose your occasion</option>
                    {['Wedding / Sangeet', 'Birthday', 'Corporate Event', 'College Festival', 'Private Party', 'Concert / Public Event', 'Religious / Cultural Event', 'Other'].map(item => <option key={item} value={item}>{item}</option>)}
                  </select>
                  {eventType === 'Other' && <input required type="text" value={customEventType} onChange={e => setCustomEventType(e.target.value)} placeholder="Tell us your occasion" className={fieldClass} />}
                </label>

                <div className="md:col-span-2">
                  <DateTimePicker
                    eventDate={eventDate}
                    setEventDate={setEventDate}
                    eventTime={eventTime}
                    setEventTime={setEventTime}
                  />
                </div>

                <label className={labelClass}>Venue city <span className="text-[#e7c879]">*</span>
                  <select required value={city} onChange={e => { setCity(e.target.value); setCustomCity(''); }} className={fieldClass}>
                    <option value="">Choose a city</option>
                    {MAJOR_CITIES.map(item => <option key={item} value={item}>{item}</option>)}
                    <option value="Other">Other</option>
                  </select>
                  {city === 'Other' && <input required type="text" value={customCity} onChange={e => setCustomCity(e.target.value)} placeholder="Enter your city" className={fieldClass} />}
                </label>

                <label className={`${labelClass} md:col-span-2`}>Complete venue address <span className="text-[#e7c879]">*</span>
                  <textarea required rows={3} value={venueAddress} onChange={e => setVenueAddress(e.target.value)} placeholder="Venue name, street, area, landmark and PIN code" className={fieldClass} />
                </label>

                <label className={labelClass}>Expected audience size <span className="text-[#e7c879]">*</span>
                  <input required type="number" min="1" max="1000000" value={attendees} onChange={e => setAttendees(e.target.value)} placeholder="e.g. 250 guests" className={fieldClass} />
                </label>

                <label className={labelClass}>Performance duration <span className="text-white/30">(optional)</span>
                  <select value={duration} onChange={e => setDuration(e.target.value)} className={fieldClass}>
                    <option value="">Select duration</option>
                    <option>30 minutes</option>
                    <option>1 hour</option>
                    <option>1.5 hours</option>
                    <option>2 hours</option>
                    <option>3+ hours</option>
                    <option>Multiple sets / To be discussed</option>
                  </select>
                </label>
              </div>
            </section>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <section className="rounded-2xl border border-white/10 bg-[#14111b]/95 p-5 shadow-2xl backdrop-blur-xl md:p-8">
              <div className="mb-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#d6b46a]">Step 02 / 03</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">Where should we reach you?</h2>
                <p className="mt-2 text-sm text-white/45">Share your contact details so our team can follow up.</p>
              </div>
              <div className="mb-6 rounded-xl border border-[#d6b46a]/15 bg-[#d6b46a]/[0.06] p-4">
                <p className="text-xs leading-5 text-white/60">Your details will only be used to discuss this artist booking enquiry and coordinate the next steps.</p>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <label className={labelClass}>Full name <span className="text-[#e7c879]">*</span>
                  <input required value={customerName} onChange={e => setCustomerName(e.target.value)} autoComplete="name" className={fieldClass} placeholder="Your full name" />
                </label>
                <label className={labelClass}>Email address <span className="text-[#e7c879]">*</span>
                  <input required type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} autoComplete="email" className={fieldClass} placeholder="you@example.com" />
                </label>
                <label className={`${labelClass} md:col-span-2`}>Mobile number <span className="text-[#e7c879]">*</span>
                  <input required type="tel" inputMode="numeric" maxLength={10} value={customerPhone} onChange={e => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} autoComplete="tel" className={fieldClass} placeholder="10-digit mobile number" />
                </label>
                <label className={`${labelClass} md:col-span-2`}>Anything else we should know? <span className="text-white/30">(optional)</span>
                  <textarea rows={4} value={requirements} onChange={e => setRequirements(e.target.value)} placeholder="Special requests, setup details, preferred songs, technical needs..." className={fieldClass} />
                </label>
              </div>
            </section>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <section className="rounded-2xl border border-white/10 bg-[#14111b]/95 p-5 shadow-2xl backdrop-blur-xl md:p-8">
              <div className="mb-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#d6b46a]">Step 03 / 03</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">Review your booking enquiry</h2>
                <p className="mt-2 text-sm text-white/45">Make sure everything looks right before sending it to our team.</p>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-white/10 bg-black/20 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-[#e7c879]">Artist & budget</h3>
                    <button type="button" onClick={() => setCurrentStep(1)} className="text-xs font-semibold text-white/45 hover:text-[#e7c879]">Edit event</button>
                  </div>
                  <p className="mt-3 text-lg font-semibold">{artist.professional_name}</p>
                  <p className="mt-1 text-xs text-white/45">{artist.category} · {artistLanguages}</p>
                  <p className="mt-4 text-2xl font-semibold text-[#f5cf65]">{formatINR(parseBudget(budgetText) || budget)}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-[#e7c879]">Event details</h3>
                    <button type="button" onClick={() => setCurrentStep(1)} className="text-xs font-semibold text-white/45 hover:text-[#e7c879]">Edit</button>
                  </div>
                  <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                    <div><dt className="text-xs text-white/35">Occasion</dt><dd className="mt-1 break-words text-white/80">{finalEventType}</dd></div>
                    <div><dt className="text-xs text-white/35">Date & time</dt><dd className="mt-1 text-white/80">{eventDate}{eventTime ? ` · ${eventTime}` : ''}</dd></div>
                    <div><dt className="text-xs text-white/35">City</dt><dd className="mt-1 break-words text-white/80">{finalCity}</dd></div>
                    <div><dt className="text-xs text-white/35">Audience</dt><dd className="mt-1 text-white/80">{attendees}</dd></div>
                    <div><dt className="text-xs text-white/35">Duration</dt><dd className="mt-1 text-white/80">{duration || 'To be discussed'}</dd></div>
                    <div className="sm:col-span-2"><dt className="text-xs text-white/35">Venue address</dt><dd className="mt-1 break-words text-white/80">{venueAddress}</dd></div>
                  </dl>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-[#e7c879]">Contact details</h3>
                    <button type="button" onClick={() => setCurrentStep(2)} className="text-xs font-semibold text-white/45 hover:text-[#e7c879]">Edit</button>
                  </div>
                  <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                    <div><dt className="text-xs text-white/35">Name</dt><dd className="mt-1 text-white/80">{customerName}</dd></div>
                    <div><dt className="text-xs text-white/35">Email</dt><dd className="mt-1 break-all text-white/80">{customerEmail}</dd></div>
                    <div><dt className="text-xs text-white/35">Mobile</dt><dd className="mt-1 text-white/80">{customerPhone}</dd></div>
                    {requirements.trim() && <div className="sm:col-span-2"><dt className="text-xs text-white/35">Additional requirements</dt><dd className="mt-1 whitespace-pre-wrap text-white/80">{requirements}</dd></div>}
                  </dl>
                </div>
              </div>
            </section>
          )}

          {error && <p role="alert" className="mt-5 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}

          <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] leading-5 text-white/35">This is a booking enquiry, not a confirmed reservation or payment.</p>
            <div className="flex w-full gap-3 sm:w-auto">
              {currentStep > 1 && (
                <button type="button" onClick={() => { setError(''); setCurrentStep(currentStep - 1); }} className="flex-1 rounded-xl border border-white/10 px-5 py-3.5 text-sm font-semibold text-white/70 transition hover:border-white/25 hover:text-white sm:flex-none">
                  Back
                </button>
              )}
              {currentStep === 1 && (
                <button type="button" onClick={continueFromEventDetails} className="flex-1 rounded-xl bg-gradient-to-r from-[#d6b46a] to-[#e6a7c7] px-7 py-3.5 text-sm font-bold text-[#17121a] shadow-lg shadow-[#d6b46a]/10 transition hover:brightness-110 sm:flex-none">
                  Continue to contact <span className="ml-2">→</span>
                </button>
              )}
              {currentStep === 2 && (
                <button type="button" onClick={continueToReview} className="flex-1 rounded-xl bg-gradient-to-r from-[#d6b46a] to-[#e6a7c7] px-7 py-3.5 text-sm font-bold text-[#17121a] shadow-lg shadow-[#d6b46a]/10 transition hover:brightness-110 sm:flex-none">
                  Review booking <span className="ml-2">→</span>
                </button>
              )}
              {currentStep === 3 && (
                <button disabled={saving} type="submit" className="flex-1 rounded-xl bg-gradient-to-r from-[#f5cf65] to-[#e6a7c7] px-7 py-3.5 text-sm font-bold text-[#17121a] shadow-lg shadow-[#d6b46a]/10 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none">
                  {saving ? 'Submitting…' : 'Submit booking enquiry'} <span className="ml-2">↗</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

// Reused calendar and showtime picker from BookingWizardPage.
function DateTimePicker({ eventDate, setEventDate, eventTime, setEventTime }: {
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
