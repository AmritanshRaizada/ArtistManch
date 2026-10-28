import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="w-full flex flex-col bg-surface min-h-screen">
      {/* Section 1: Cinematic Hero */}
      <section className="relative w-full overflow-hidden bg-[#0e0e11] px-4 py-8 sm:py-10 md:px-12 md:py-12 min-h-[calc(100svh-120px)] flex flex-col justify-center">
        {/* Full-bleed Background Video */}
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-high/80 backdrop-blur-md shadow-lg shadow-black/50 mb-6 border border-outline-variant/30">
            <span
              className="material-symbols-outlined text-primary text-[17px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              stars
            </span>
            <span className="font-bold text-[12px] uppercase tracking-[0.2em] text-secondary">
              Make Every Celebration Unforgettable
            </span>
          </div>

          {/* Main Headline — Clean Festive Offer */}
          <div className="max-w-4xl mx-auto mb-6 text-center">
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
            Discover handpicked vocalists, soulful sufi maestros, and dynamic live performers for royal weddings, private galas, corporate festivals, and life's most memorable moments.
          </p>

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
      <section className="w-full py-16 px-4 md:px-12 bg-surface">
        <div className="max-w-[1320px] mx-auto">
          <div
            className="rounded-2xl p-8 md:p-12 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #24113d 0%, #1f1f22 50%, #1b1b1e 100%)' }}
          >
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] pointer-events-none" style={{ background: 'rgba(212,175,55,0.12)' }} />
            <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full blur-[80px] pointer-events-none" style={{ background: 'rgba(96,1,209,0.2)' }} />
            <div className="relative z-10 text-center">
              <span className="font-bold text-[11px] uppercase tracking-[0.2em] text-primary block mb-3">🎉 Festive Season Special</span>
              <h2 className="font-playfair text-[28px] md:text-[40px] font-semibold text-on-surface mb-4" style={{ letterSpacing: '-0.015em' }}>
                Book Now, Pay Only <span className="text-primary italic">20% Advance</span>
              </h2>
              <p className="text-[15px] text-on-surface-variant max-w-2xl mx-auto mb-2">
                No more 50% advance payments! Lock your artist for just 20% of the budget as advance. First time on ArtistManch?
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8">
                <span className="material-symbols-outlined text-primary text-[18px]">local_offer</span>
                <span className="font-bold text-[14px] text-primary">Use coupon <span className="font-bold tracking-[0.1em]">FIRST10</span> for just 10% advance on your first booking!</span>
              </div>
              <div>
                <button
                  onClick={() => navigate('/booking')}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-on-primary font-bold text-[14px] uppercase tracking-[0.04em] rounded-xl shadow-[0_12px_28px_-6px_rgba(242,202,80,0.4)] hover:scale-[1.03] transition-all"
                >
                  <span>Start your booking</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
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
