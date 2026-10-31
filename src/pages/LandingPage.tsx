import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="w-full flex flex-col bg-surface min-h-screen">
      <style>{`
  @keyframes artistmanch-wave-letter {
    0%, 100% {
      transform: translateY(0);
    }
    35% {
      transform: translateY(-12px);
    }
    65% {
      transform: translateY(2px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .wavy-tagline span {
      animation: none !important;
    }
  }
`}</style>

      {/* Section 1: Cinematic Hero */}
<section className="relative w-full overflow-hidden bg-[#0e0e11] px-4 pt-28 pb-8 sm:pt-30 sm:pb-10 md:px-12 md:pt-36 md:pb-12 min-h-[calc(100svh-120px)] flex flex-col justify-center">        {/* Full-bleed Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none z-0 select-none motion-reduce:hidden"
        >
          <source src="/video/hero-background.mp4" type="video/mp4" />
        </video>

        {/* Layered Overlays for High Text Contrast & Cinematic Aesthetics */}
        {/* 1. Overall Dark Tint */}
        <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none" />

        {/* 2. Top-to-Bottom & Bottom Fade Gradients */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, rgba(14,14,17,0.75) 0%, rgba(14,14,17,0.3) 30%, rgba(14,14,17,0.5) 70%, #0e0e11 100%)',
          }}
        />

        {/* 3. Horizontal Vignette Gradients */}
        <div
          className="absolute inset-0 z-0 pointer-events-none hidden md:block"
          style={{
            background:
              'radial-gradient(circle at center, transparent 40%, rgba(14,14,17,0.6) 100%)',
          }}
        />

        {/* 4. Restrained Atmospheric Glows */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[550px] rounded-full blur-[130px] pointer-events-none z-0"
          style={{
            background:
              'radial-gradient(ellipse, rgba(96,1,209,0.2) 0%, rgba(36,17,61,0.25) 50%, transparent 70%)',
          }}
        />
        <div
          className="absolute top-20 left-12 w-96 h-96 rounded-full blur-[100px] pointer-events-none z-0"
          style={{ background: 'rgba(212,175,55,0.08)' }}
        />

        {/* Hero Content */}
        <div className="max-w-[1320px] mx-auto relative z-10 flex flex-col items-center text-center">
          {/* Eyebrow Badge */}
          

          {/* Main Headline — Clean Festive Offer */}
          <div className="max-w-4xl mx-auto mt-4 mb-6 text-center">
            <h1
              className="font-playfair text-[36px] sm:text-[44px] md:text-[60px] font-bold text-on-surface tracking-tight leading-[1.15] mb-5"
              style={{ letterSpacing: '-0.02em' }}
            >
              This Festive Season,
              <br />
              <span className="text-primary">Reserve Verified Artists</span>
            </h1>

            {/* <p className="text-[16px] md:text-[19px] text-on-surface-variant mb-3">
              Secure your favourite artist with a special festive advance of
            </p> */}

            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* <span className="font-playfair text-3xl md:text-4xl font-bold text-primary">
                10% Advance
              </span> */}

              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs md:text-sm">
                <span className="text-on-surface-variant">Regular</span>
                <span className="relative inline-block text-on-surface-variant/80">
                  20%
                  <span className="absolute left-0 right-0 top-1/2 h-px bg-on-surface-variant rotate-[-8deg]" />
                </span>
                <span className="text-primary font-semibold">Festive offer</span>
                <span className="font-semibold text-1xl md:text-2xl font-bold text-primary">
                10% Advance
              </span>
              </span>
            </div>
          </div>

          {/* Supporting Copy */}
          <p className="text-[18px] md:text-[20px] text-on-surface-variant max-w-2xl mx-auto mb-12 leading-[28px] drop-shadow">
            <span
              className="mb-3 block font-playfair text-2xl font-bold italic leading-tight text-primary drop-shadow-[0_2px_14px_rgba(242,202,80,0.22)] sm:text-3xl md:text-4xl"
              aria-label="Har Jashn Ho Shaandaar!"
            >
              {'Har Jashn Ho Shaandaar!'.split('').map((character, index) => (
                <span
                  key={`${character}-${index}`}
                  className="inline-block"
                  style={{
                    animation: 'artistmanch-wave-letter 2.8s ease-in-out infinite',
                    animationDelay: `${index * 45}ms`,
                    whiteSpace: character === ' ' ? 'pre' : undefined,
                  }}
                >
                  {character === ' ' ? '\u00a0' : character}
                </span>
              ))}
            </span>
ArtistManch brings exceptional singers, Sufi artists, and performers to weddings, corporate events, and celebrations, creating unforgettable experiences.          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-12">
            <button
              onClick={() => navigate('/browse')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-on-primary font-bold text-[14px] uppercase tracking-[0.04em] rounded-xl shadow-[0_12px_28px_-6px_rgba(242,202,80,0.35)] hover:scale-[1.03] transition-all"
            >
              <span>Browse Specific Artiist</span>
              <span className="material-symbols-outlined text-[19px]">magic_button</span>
            </button>
            <button
              onClick={() => navigate('/booking')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-surface-container-high/80 backdrop-blur-md text-on-surface font-bold text-[14px] uppercase tracking-[0.04em] rounded-xl hover:bg-surface-variant hover:text-primary transition-all shadow-md border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-secondary text-[19px]">graphic_eq</span>
              <span>Find the Right Artist for My Event</span>
            </button>
          </div>

          {/* Trust Badge Bar */}
          <div className="w-full max-w-3xl pt-8 flex flex-wrap items-center justify-center sm:justify-between gap-y-4 gap-x-6 text-on-surface-variant/90 border-t border-outline-variant/20">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[12px] text-on-surface uppercase tracking-wider">
                Your event. Your artist. Your moment.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex text-primary">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                ))}
              </div>
              <span className="font-bold text-[14px] text-on-surface">4.9 / 5</span>
              <span className="text-[13px] text-on-surface-variant">(1,420+ Events)</span>
            </div>
            <div className="flex items-center gap-2 bg-surface-container/70 backdrop-blur-md px-3 py-1 rounded-full border border-outline-variant/20">
              <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
              <span className="font-bold text-[11px] text-on-surface uppercase tracking-wider">
                100% Verified Talents
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Full-Width Festive Offer Marquee */}
      <div
        className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-y border-primary/25 py-3"
        style={{ background: '#1b1028' }}
      >
        <div
          className="festive-marquee-track flex w-max items-center"
          aria-label="Use code FESTIVE10 to reserve verified artists with just 10% advance. Available only this festive season."
        >
          {[0, 1, 2, 3].map((item) => (
            <div
              key={item}
              aria-hidden={item !== 0}
              className="flex shrink-0 items-center gap-3 px-8 whitespace-nowrap"
            >
              <span className="text-primary">✦</span>
              <span className="text-on-surface font-medium">
                Use code
              </span>
              <span className="rounded-md bg-primary/15 px-2 py-1 font-bold text-primary">
                FESTIVE10
              </span>
              <span className="text-on-surface-variant">
                to reserve verified artists with just
              </span>
              <span className="font-bold text-primary">
                10% advance
              </span>
              <span className="text-on-surface-variant">
                — Available only this festive season.
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: How It Works */}
      <section className="w-full py-16 px-4 md:px-12 bg-surface">
        <div className="max-w-[1320px] mx-auto">
          <div className="text-center mb-12">
            <span className="font-bold text-[12px] uppercase tracking-[0.18em] text-primary block mb-2">Simple & Transparent</span>
            <h2 className="font-playfair text-[40px] font-semibold text-on-surface" style={{ letterSpacing: '-0.015em' }}>How ArtistManch Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '01', icon: 'search', title: 'Browse & Select', desc: 'Explore our verified artists across all genres and categories.' },
              { step: '02', icon: 'assignment', title: 'Submit Enquiry', desc: 'Fill our form with your event details and lock your preferred artist.' },
              { step: '03', icon: 'celebration', title: 'Celebrate!', desc: 'Pay just 20% advance . Your artist performs, you celebrate.' },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="bg-surface-container rounded-2xl p-6 border border-outline-variant/20 hover:border-primary/30 transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-all">
                    <span className="material-symbols-outlined text-primary text-[24px]">{icon}</span>
                  </div>
                  <div>
                    <span className="font-bold text-[11px] text-primary uppercase tracking-[0.08em] block mb-1">Step {step}</span>
                    <h3 className="font-playfair text-[22px] font-semibold text-on-surface mb-2">{title}</h3>
                    <p className="text-[15px] text-on-surface-variant leading-[24px]">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Festive Advance Offer Banner */}
      <section className="w-full bg-surface px-4 py-10 sm:py-14 md:px-12 md:py-16">
        <div className="mx-auto max-w-[1320px]">
          <div
            className="relative isolate overflow-hidden rounded-2xl border border-white/[0.08] px-5 py-8 shadow-[0_20px_60px_-28px_rgba(0,0,0,0.8)] sm:rounded-3xl sm:px-8 sm:py-10 md:px-12 md:py-12"
            style={{ background: 'linear-gradient(135deg, #24113d 0%, #1f1f22 52%, #1b1b1e 100%)' }}
          >
            <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 -z-10 h-64 w-64 rounded-full blur-[90px] sm:h-80 sm:w-80" style={{ background: 'rgba(212,175,55,0.14)' }} />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-16 -z-10 h-56 w-56 rounded-full blur-[80px] sm:h-64 sm:w-64" style={{ background: 'rgba(96,1,209,0.22)' }} />

            <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/[0.08] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary sm:mb-4 sm:text-[11px]">
                <span aria-hidden="true">🎉</span>
                Festive Season Special
              </span>

              <h2 className="mb-3 font-playfair text-[27px] font-semibold leading-tight tracking-[-0.02em] text-on-surface sm:mb-4 sm:text-3xl md:text-[40px]">
                Book Now, Pay Only
                <span className="mt-1 block text-primary italic sm:inline sm:mt-0 sm:pl-2">20% Advance</span>
              </h2>

              <p className="mb-6 max-w-xl text-[13px] leading-6 text-on-surface-variant sm:mb-7 sm:text-[15px] sm:leading-7">
                No more 50% advance payments. Lock your artist with just 20% of your event budget.
              </p>

              {/* First-booking coupon: separate offer card for clear visual hierarchy */}
              <div className="mb-7 w-full max-w-xl rounded-2xl border border-primary/40 bg-black/20 p-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:mb-8 sm:p-5">
                <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
                    <span className="material-symbols-outlined text-[23px] text-primary">sell</span>
                  </div>

                  <div className="min-w-0 flex-1 text-center sm:text-left">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary/90 sm:text-[11px]">
                      First booking bonus
                    </p>
                    <p className="mt-1 text-sm font-semibold leading-5 text-on-surface sm:text-base">
                      Get your first booking with just
                      <span className="text-primary"> 10% advance</span>
                    </p>
                    <p className="mt-1 text-xs leading-5 text-on-surface-variant">
                      Apply this coupon when submitting your booking.
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col items-center rounded-xl border border-dashed border-primary/60 bg-primary/[0.08] px-5 py-2.5 sm:min-w-[132px]">
                    <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                      Use code
                    </span>
                    <span className="font-mono text-xl font-extrabold tracking-[0.16em] text-primary">
                      FIRST10
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  navigate('/booking');
                  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-[13px] font-bold uppercase tracking-[0.04em] text-on-primary shadow-[0_12px_28px_-6px_rgba(242,202,80,0.4)] transition-all hover:scale-[1.02] hover:shadow-[0_14px_32px_-6px_rgba(242,202,80,0.5)] sm:w-auto sm:px-8 sm:py-4 sm:text-sm"
              >
                <span>Start your booking</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Featured Artists */}
      

      {/* Section 5: Testimonials */}
      <section className="w-full py-16 px-4 md:px-12 bg-surface-container-lowest">
        <div className="max-w-[1320px] mx-auto">
          <div className="text-center mb-12">
            <span className="font-bold text-[12px] uppercase tracking-[0.18em] text-primary block mb-2">Client Stories</span>
            <h2 className="font-playfair text-[40px] font-semibold text-on-surface" style={{ letterSpacing: '-0.015em' }}>What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Priya Kapoor', event: 'Wedding Sangeet, Jaipur', text: 'ArtistManch found us the perfect Sufi singer for our sangeet. The advance was just 20% and the artist was absolutely divine. Will use again!', rating: 5 },
              { name: 'Rahul Mehta', event: 'Corporate Gala, Mumbai', text: 'We booked Vincy Wilson as our anchor. Absolutely professional! The booking process was seamless and the concierge team was incredibly responsive.', rating: 5 },
              { name: 'Ananya Singh', event: 'Birthday Party, Delhi', text: 'Used FIRST10 coupon and paid just 10% advance. The acoustic singer was perfect for our intimate gathering. Highly recommended!', rating: 5 },
            ].map(({ name, event, text, rating }) => (
              <div key={name} className="bg-surface-container rounded-2xl p-6 border border-outline-variant/20 hover:border-primary/20 transition-all">
                <div className="flex text-primary mb-3">
                  {[...Array(rating)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p className="text-[15px] text-on-surface-variant leading-[24px] mb-4 italic">"{text}"</p>
                <div>
                  <p className="font-semibold text-[15px] text-on-surface">{name}</p>
                  <p className="text-[13px] text-on-surface-variant">{event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
