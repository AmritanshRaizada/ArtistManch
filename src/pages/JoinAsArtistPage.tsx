import { WHATSAPP_NUMBER } from '../data/artists';

export default function JoinAsArtistPage() {
  const whatsappMessage = encodeURIComponent(
    'Hi, I\'m an artist interested in joining ArtistManch. I would like to know more about the onboarding process.'
  );
  const ARTIST_WHATSAPP_NUMBER = '+918810321546';
  const whatsappUrl = `https://wa.me/${ARTIST_WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  const benefits = [
    { icon: 'trending_up', title: 'Grow Your Bookings', desc: 'Access thousands of event hosts actively searching for your category and style of performance.' },
    { icon: 'payments', title: 'Guaranteed Advance', desc: '100% advance protection. Advances are collected and held by ArtistManch — we ensure you always get paid.' },
    { icon: 'verified', title: 'Verified Artist Badge', desc: 'Earn the ArtistManch Verified badge which increases enquiry rates by 3x on average.' },
    { icon: 'support_agent', title: 'Dedicated Manager', desc: 'Your dedicated talent manager coordinates all logistics, riders, and soundcheck requirements.' },
    { icon: 'calendar_month', title: 'Flexible Scheduling', desc: 'You control your calendar. Accept or decline bookings based on your availability.' },
    { icon: 'workspace_premium', title: 'Premium Event Access', desc: 'Get exclusive invitations to curate sets at premium weddings, galas, and corporate events.' },
  ];

  const steps = [
    { num: '01', title: 'WhatsApp Us', desc: 'Start by sending us a WhatsApp message expressing your interest. Include your category, sample videos, and location.' },
    { num: '02', title: 'Profile Creation', desc: 'Our team creates your premium artist profile with professional photos, bio, and genre tags.' },
    { num: '03', title: 'Verification', desc: 'We verify your credentials, experience, and sample performance videos before going live.' },
    { num: '04', title: 'Start Getting Booked', desc: 'Your profile goes live and event hosts start discovering and enquiring for your talent.' },
  ];

  return (
    <div className="w-full min-h-screen bg-background pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden w-full pt-16 pb-24 px-4 md:px-12">
        {/* Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[550px] rounded-full blur-[130px] pointer-events-none -z-10" style={{ background: 'radial-gradient(ellipse, rgba(96,1,209,0.3) 0%, transparent 70%)' }} />
        <div className="absolute top-20 left-16 w-80 h-80 rounded-full blur-[100px] pointer-events-none -z-10" style={{ background: 'rgba(212,175,55,0.1)' }} />

        <div className="max-w-[1320px] mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-high/70 backdrop-blur-md shadow-lg mb-6">
            <span className="material-symbols-outlined text-primary text-[17px]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
            <span className="font-bold text-[12px] uppercase tracking-[0.2em] text-primary">Join the Roster — Applications Open</span>
          </div>

          <h1 className="font-playfair text-[40px] md:text-[56px] font-bold text-on-surface max-w-4xl mx-auto tracking-tight leading-[1.12] mb-4" style={{ letterSpacing: '-0.02em' }}>
            Grow Your Bookings With <span className="italic font-normal text-primary">ArtistManch</span>
          </h1>

          <p className="text-[18px] text-on-surface-variant max-w-2xl mx-auto mb-10 leading-[28px]">
            Join India's most trusted premium artist booking platform. Get discovered by thousands of event hosts for weddings, galas, corporate events, and cultural festivals.
          </p>

          {/* WhatsApp CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="join-whatsapp-cta"
              className="inline-flex items-center gap-3 px-8 py-4 text-white font-bold text-[16px] uppercase tracking-[0.04em] rounded-xl shadow-[0_12px_28px_-6px_rgba(37,211,102,0.4)] hover:scale-[1.03] transition-all"
              style={{ background: '#25D366' }}
            >
              <span className="material-symbols-outlined text-[22px]">chat</span>
              <span>Connect with Us</span>
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-8 py-4 bg-surface-container-high/80 text-on-surface font-bold text-[16px] uppercase tracking-[0.04em] rounded-xl hover:bg-surface-variant transition-all"
            >
              <span>How It Works</span>
              <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
            </a>
          </div>

          {/* Stats */}
          {/* <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { stat: '1,420+', label: 'Events Hosted' },
              { stat: '150+', label: 'Artists on Roster' },
              { stat: '4.9★', label: 'Average Rating' },
              { stat: '₹0', label: 'Platform Fee on First Gig' },
            ].map(({ stat, label }) => (
              <div key={label} className="bg-surface-container rounded-xl p-4 text-center">
                <p className="font-playfair text-[28px] font-bold text-primary">{stat}</p>
                <p className="font-bold text-[11px] text-on-surface-variant uppercase tracking-wider mt-1">{label}</p>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* Benefits */}
      <section className="w-full py-16 px-4 md:px-12 bg-surface">
        <div className="max-w-[1320px] mx-auto">
          <div className="text-center mb-12">
            <span className="font-bold text-[12px] uppercase tracking-[0.18em] text-primary block mb-2">Why ArtistManch?</span>
            <h2 className="font-playfair text-[36px] md:text-[40px] font-semibold text-on-surface" style={{ letterSpacing: '-0.015em' }}>Benefits of Joining Our Team</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map(({ icon, title, desc }) => (
              <div key={title} className="bg-surface-container rounded-xl p-6 border border-outline-variant/20 hover:border-primary/30 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all">
                  <span className="material-symbols-outlined text-primary text-[24px]">{icon}</span>
                </div>
                <h3 className="font-playfair text-[22px] font-semibold text-on-surface mb-2">{title}</h3>
                <p className="text-[15px] text-on-surface-variant leading-[24px]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="w-full py-16 px-4 md:px-12 bg-surface-container-lowest">
        <div className="max-w-[1320px] mx-auto">
          <div className="text-center mb-12">
            <span className="font-bold text-[12px] uppercase tracking-[0.18em] text-primary block mb-2">Simple Onboarding</span>
            <h2 className="font-playfair text-[36px] md:text-[40px] font-semibold text-on-surface" style={{ letterSpacing: '-0.015em' }}>How to Join in 4 Steps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ num, title, desc }) => (
              <div key={num} className="flex flex-col gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-[18px] bg-surface-container border border-outline-variant/40 text-primary">
                  {num}
                </div>
                <h3 className="font-playfair text-[22px] font-semibold text-on-surface">{title}</h3>
                <p className="text-[15px] text-on-surface-variant leading-[24px]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA
      <section className="w-full py-16 px-4 md:px-12 bg-surface">
        <div className="max-w-[1320px] mx-auto">
          <div
            className="rounded-2xl p-8 md:p-12 relative overflow-hidden text-center"
            style={{ background: 'linear-gradient(135deg, #24113d 0%, #1f1f22 50%, #1b1b1e 100%)' }}
          >
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] pointer-events-none" style={{ background: 'rgba(212,175,55,0.12)' }} />
            <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full blur-[80px] pointer-events-none" style={{ background: 'rgba(96,1,209,0.2)' }} />
            <div className="relative z-10">
              <span className="font-bold text-[11px] uppercase tracking-[0.2em] text-primary block mb-3">Limited Roster Slots Available</span>
              <h2 className="font-playfair text-[28px] md:text-[40px] font-semibold text-on-surface mb-4">
                Ready to Get <span className="text-primary italic">Booked?</span>
              </h2>
              <p className="text-[15px] text-on-surface-variant max-w-2xl mx-auto mb-8">
                Send us your details, sample videos, and performance category via WhatsApp. Our talent team will review your profile within 48 hours.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="join-whatsapp-cta-bottom"
                className="inline-flex items-center gap-3 px-8 py-4 text-white font-bold text-[16px] uppercase tracking-[0.04em] rounded-xl shadow-[0_12px_28px_-6px_rgba(37,211,102,0.4)] hover:scale-[1.03] transition-all"
                style={{ background: '#25D366' }}
              >
                <span className="material-symbols-outlined text-[22px]">chat</span>
                <span>Apply Now via WhatsApp</span>
              </a>
              <p className="text-[13px] text-on-surface-variant mt-4">No registration fee. Zero platform cut on your first 3 gigs.</p>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
}
