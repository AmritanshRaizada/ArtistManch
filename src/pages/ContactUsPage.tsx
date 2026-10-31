import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

const contactOptions = [
  {
    icon: 'mail',
    eyebrow: 'EMAIL US',
    title: 'Send us an email',
    detail: 'hello@artistmanch.com',
    description: 'For general questions, partnerships, and booking support.',
    href: 'mailto:hello@artistmanch.com',
    action: 'Email our team',
  },
  {
    icon: 'handshake',
    eyebrow: 'BOOKING SUPPORT',
    title: 'Need help with a booking?',
    detail: 'We’re here to help',
    description: 'Share your event details and we’ll help you find the right next step.',
    href: 'https://wa.me/917303195782?text=Hello%20ArtistManch%2C%20I%20would%20like%20to%20make%20an%20enquiry.',
    action: 'Start an enquiry',
  },
  {
    icon: 'location_on',
    eyebrow: 'VISIT US',
    title: 'Our office',
    detail: 'New Delhi, India',
    description: 'Mezz & 1st Floor, A-83, Pocket D, Okhla Phase II, Okhla Industrial Estate, New Delhi, Delhi 110020',
    href: 'https://share.google/FHyk0IkZb4AT4LXM9',
    action: 'View on Maps',
  },
];

const topics = [
  'General enquiry',
  'Booking support',
  'Artist registration',
  'Partnerships',
  'Payments & refunds',
  'Other',
];

function Icon({ name, className = '' }: { name: string; className?: string }) {
  const common = {
    className: `material-symbols-outlined ${className}`,
    'aria-hidden': true as const,
  };
  return <span {...common}>{name}</span>;
}

export default function ContactUsPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    topic: 'General enquiry',
    bookingReference: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const subject = encodeURIComponent(`ArtistManch contact: ${form.topic}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nTopic: ${form.topic}\nBooking reference: ${form.bookingReference || 'Not provided'}\n\nMessage:\n${form.message}`,
    );

    window.location.href = `mailto:hello@artistmanch.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b0910] text-white">
      {/* Ambient ArtistManch brand lighting */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[620px] overflow-hidden">
        <div className="absolute -left-36 -top-36 h-[480px] w-[480px] rounded-full bg-[#6b21a8]/20 blur-[140px]" />
        <div className="absolute right-[-5rem] top-[-8rem] h-[460px] w-[460px] rounded-full bg-[#c6a15b]/[0.10] blur-[140px]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-[#0b0910]" />
      </div>

      <div className="relative mx-auto max-w-[1240px] px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pt-16">
        {/* Page intro */}
        <header className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#c6a15b]/25 bg-[#c6a15b]/[0.07] px-4 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d6b46a] shadow-[0_0_12px_rgba(214,180,106,0.7)]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#e6cc8c] sm:text-[11px]">
              We’d love to hear from you
            </span>
          </div>
          <h1 className="font-playfair text-4xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl md:text-6xl">
            Let’s start a <span className="italic text-[#d6b46a]">conversation.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#b9afc3] sm:text-base">
            Have a question, need a hand with a booking, or want to work with us?
            Send us a message and we’ll point you in the right direction.
          </p>
        </header>

        {/* Contact cards */}
        <section aria-label="Contact options" className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:mb-10">
          {contactOptions.map((option) => {
            const isExternal = option.href.startsWith('mailto:') || option.href.startsWith('http');
            const content = (
              <>
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#c6a15b]/25 bg-[#c6a15b]/[0.08] text-[#e6c978] transition group-hover:border-[#c6a15b]/50 group-hover:bg-[#c6a15b]/[0.13]">
                    <Icon name={option.icon} className="text-[24px]" />
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] text-[#9c8baa] transition group-hover:border-[#c6a15b]/30 group-hover:text-[#e6c978]">
                    <Icon name="arrow_outward" className="text-[18px]" />
                  </span>
                </div>
                <p className="mt-6 text-[10px] font-bold tracking-[0.2em] text-[#c7a9e8]">{option.eyebrow}</p>
                <h2 className="mt-2 font-playfair text-2xl font-semibold text-white">{option.title}</h2>
                <p className="mt-2 text-sm font-medium text-[#e6c978]">{option.detail}</p>
                <p className="mt-3 max-w-md text-sm leading-6 text-[#a99fb3]">{option.description}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white transition group-hover:text-[#e6c978]">
                  {option.action}
                  <Icon name="arrow_right_alt" className="text-[20px]" />
                </span>
              </>
            );

            return isExternal ? (
              <a
                key={option.title}
                href={option.href}
                className="group rounded-[1.5rem] border border-white/[0.10] bg-gradient-to-br from-[#17121e] to-[#100d15] p-6 transition duration-300 hover:-translate-y-0.5 hover:border-[#c6a15b]/35 hover:shadow-[0_20px_60px_rgba(0,0,0,0.2)] sm:p-7"
              >
                {content}
              </a>
            ) : (
              <Link
                key={option.title}
                to={option.href}
                onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
                className="group rounded-[1.5rem] border border-white/[0.10] bg-gradient-to-br from-[#17121e] to-[#100d15] p-6 transition duration-300 hover:-translate-y-0.5 hover:border-[#9b5de5]/40 hover:shadow-[0_20px_60px_rgba(0,0,0,0.2)] sm:p-7"
              >
                {content}
              </Link>
            );
          })}
        </section>

        {/* Form and reassurance panel */}
        <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)] lg:gap-8">
          <div className="rounded-[1.75rem] border border-white/[0.10] bg-[#120e18]/90 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.18)] sm:p-8 lg:p-9">
            <div className="mb-7">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c7a9e8]">CONTACT FORM</p>
              <h2 className="mt-2 font-playfair text-3xl font-semibold text-white">Send us a message</h2>
              <p className="mt-3 text-sm leading-6 text-[#a99fb3]">
                Tell us a little about what you need. Fields marked with * are required.
              </p>
            </div>

            {submitted && (
              <div role="status" className="mb-6 rounded-xl border border-[#c6a15b]/25 bg-[#c6a15b]/[0.07] p-4 text-sm leading-6 text-[#e6d5a5]">
                Your email app should open with your message ready to send. If it didn’t open, email us at{' '}
                <a className="font-semibold underline underline-offset-4" href="mailto:hello@artistmanch.com">hello@artistmanch.com</a>.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[#e6dfed]">Your name <span className="text-[#d6b46a]">*</span></span>
                  <input
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-white/[0.11] bg-[#0c0a11] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-[#71677d] focus:border-[#c6a15b]/60 focus:ring-4 focus:ring-[#c6a15b]/[0.07]"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[#e6dfed]">Email address <span className="text-[#d6b46a]">*</span></span>
                  <input
                    required
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/[0.11] bg-[#0c0a11] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-[#71677d] focus:border-[#c6a15b]/60 focus:ring-4 focus:ring-[#c6a15b]/[0.07]"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[#e6dfed]">What can we help with? <span className="text-[#d6b46a]">*</span></span>
                  <select
                    required
                    value={form.topic}
                    onChange={(event) => setForm({ ...form, topic: event.target.value })}
                    className="w-full appearance-none rounded-xl border border-white/[0.11] bg-[#0c0a11] px-4 py-3.5 text-sm text-white outline-none transition focus:border-[#c6a15b]/60 focus:ring-4 focus:ring-[#c6a15b]/[0.07]"
                  >
                    {topics.map((topic) => <option key={topic} value={topic} className="bg-[#120e18]">{topic}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[#e6dfed]">Booking reference <span className="text-xs font-normal text-[#786e84]">(optional)</span></span>
                  <input
                    value={form.bookingReference}
                    onChange={(event) => setForm({ ...form, bookingReference: event.target.value })}
                    placeholder="e.g. AM-1024"
                    className="w-full rounded-xl border border-white/[0.11] bg-[#0c0a11] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-[#71677d] focus:border-[#c6a15b]/60 focus:ring-4 focus:ring-[#c6a15b]/[0.07]"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#e6dfed]">Your message <span className="text-[#d6b46a]">*</span></span>
                <textarea
                  required
                  rows={6}
                  value={form.message}
                  onChange={(event) => setForm({ ...form, message: event.target.value })}
                  placeholder="Tell us how we can help..."
                  className="w-full resize-y rounded-xl border border-white/[0.11] bg-[#0c0a11] px-4 py-3.5 text-sm leading-6 text-white outline-none transition placeholder:text-[#71677d] focus:border-[#c6a15b]/60 focus:ring-4 focus:ring-[#c6a15b]/[0.07]"
                />
              </label>

              <div className="flex flex-col gap-4 border-t border-white/[0.08] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-sm text-xs leading-5 text-[#83788f]">
                  Please don’t include passwords or sensitive payment details in your message.
                </p>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d6b46a] to-[#c6a15b] px-6 py-3.5 text-sm font-bold text-[#1a1307] shadow-[0_8px_28px_rgba(198,161,91,0.15)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(198,161,91,0.22)] focus:outline-none focus:ring-4 focus:ring-[#c6a15b]/20"
                >
                  Send message
                  <Icon name="arrow_forward" className="text-[19px]" />
                </button>
              </div>
            </form>
          </div>

          <aside className="space-y-5">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-[#c6a15b]/20 bg-gradient-to-br from-[#24182f] via-[#17111f] to-[#100d15] p-6 sm:p-7">
              <div aria-hidden="true" className="absolute -right-14 -top-14 h-48 w-48 rounded-full bg-[#9b5de5]/15 blur-3xl" />
              <div className="relative">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d6b46a]/25 bg-[#d6b46a]/[0.08] text-[#e6c978]">
                  <Icon name="support_agent" className="text-[26px]" />
                </span>
                <h3 className="mt-5 font-playfair text-2xl font-semibold text-white">Here for your next big moment.</h3>
                <p className="mt-3 text-sm leading-6 text-[#b7aabd]">
                  Whether you’re planning an event or building your career as an artist, we’ll help you find the right place to start.
                </p>
                <div className="mt-6 h-px bg-gradient-to-r from-[#d6b46a]/50 to-transparent" />
                <div className="mt-5 flex items-start gap-3">
                  <Icon name="check_circle" className="mt-0.5 text-[19px] text-[#d6b46a]" />
                  <div>
                    <p className="text-sm font-semibold text-white">Clear, helpful guidance</p>
                    <p className="mt-1 text-xs leading-5 text-[#a99bb4]">Share your question and the details we need to understand it.</p>
                  </div>
                </div>
                <div className="mt-4 flex items-start gap-3">
                  <Icon name="lock" className="mt-0.5 text-[19px] text-[#d6b46a]" />
                  <div>
                    <p className="text-sm font-semibold text-white">Keep your details safe</p>
                    <p className="mt-1 text-xs leading-5 text-[#a99bb4]">Only include information relevant to your enquiry.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/[0.09] bg-[#120e18]/75 p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c7a9e8]">QUICK LINKS</p>
              <div className="mt-4 space-y-1">
                <Link to="/artist-faq" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })} className="group flex items-center justify-between rounded-xl px-3 py-3 text-sm text-[#c9bfd3] transition hover:bg-white/[0.04] hover:text-[#e6c978]">
                  Artist FAQs <Icon name="arrow_outward" className="text-[17px]" />
                </Link>
                <a href="https://wa.me/917303195782?text=Hello%20ArtistManch%2C%20I%20would%20like%20to%20make%20an%20enquiry." target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between rounded-xl px-3 py-3 text-sm text-[#c9bfd3] transition hover:bg-white/[0.04] hover:text-[#e6c978]">
                  Start a booking enquiry <Icon name="arrow_outward" className="text-[17px]" />
                </a>
                <Link to="/join" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })} className="group flex items-center justify-between rounded-xl px-3 py-3 text-sm text-[#c9bfd3] transition hover:bg-white/[0.04] hover:text-[#e6c978]">
                  Join as an artist <Icon name="arrow_outward" className="text-[17px]" />
                </Link>
              </div>
            </div>
          </aside>
        </section>

        <div className="mt-10 text-center">
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#8e829b] transition hover:text-[#e6c978]"
          >
            <Icon name="arrow_back" className="text-[17px]" />
            Back to ArtistManch
          </Link>
        </div>
      </div>
    </main>
  );
}
