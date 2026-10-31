
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/artist-manch-logo-transparent-for-light-bg.png';

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/artist.manch/',
    icon: 'instagram',
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61595533253737',
    icon: 'facebook',
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/+917303195782',
    icon: 'whatsapp',
  },
] as const;

const linkClass =
  'group inline-flex w-fit items-center gap-2 text-sm text-white/60 transition-colors duration-200 hover:text-[#d9b8ff]';

function scrollToTop() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'instant',
  });
}

function FooterLink({
  to,
  children,
}: {
  to: string;
  children: ReactNode;
}) {
  return (
    <Link to={to} onClick={scrollToTop} className={linkClass}>
      <span
        className="h-px w-0 shrink-0 bg-[#b779ff] transition-all duration-200 group-hover:w-3"
        aria-hidden="true"
      />
      {children}
    </Link>
  );
}

function SocialIcon({ icon }: { icon: (typeof socialLinks)[number]['icon'] }) {
  const commonProps = {
    width: 21,
    height: 21,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  };

  if (icon === 'instagram') {
    return (
      <svg {...commonProps}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (icon === 'facebook') {
    return (
      <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M13.4 21v-8.2h2.8l.4-3.2h-3.2v-2c0-.9.3-1.5 1.6-1.5h1.7V3.2c-.3 0-1.3-.2-2.5-.2-2.5 0-4.2 1.5-4.2 4.3v2.3H7.2v3.2H10V21h3.4Z" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M20.5 11.8a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.3-4.7a8.5 8.5 0 1 1 16.2-4Z" />
      <path d="M8.5 7.8c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.5l.8 1.8c.1.3.1.5-.1.7l-.6.7c-.2.2-.2.4 0 .7.5.9 1.2 1.6 2.1 2.1.3.2.5.2.7-.1l.8-.9c.2-.2.4-.2.7-.1l1.8.9c.3.1.4.3.4.5 0 .4-.2 1.3-.8 1.8-.6.5-1.3.7-2.1.6-1.1-.2-2.6-.9-4-2.2-1.6-1.4-2.6-3.2-2.7-4.4-.1-.9.4-1.7.8-2.2Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="relative isolate mt-auto overflow-hidden border-t border-white/[0.08] bg-[#08070d] text-white">
      {/* Ambient background lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-28 -top-32 h-[28rem] w-[28rem] rounded-full bg-[#54218d]/20 blur-[100px]" />
        <div className="absolute right-[12%] top-0 h-72 w-72 rounded-full bg-[#8c5b21]/10 blur-[100px]" />
        <div className="absolute bottom-[-12rem] right-[-5rem] h-[26rem] w-[26rem] rounded-full bg-[#40216e]/20 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-[1440px] px-4 pb-5 pt-8 sm:px-8 sm:pt-12 md:pt-20 lg:px-12">
        <div className="grid grid-cols-1 gap-7 sm:gap-9 lg:grid-cols-12 lg:gap-10">
          {/* Brand panel */}
          <div className="relative min-h-0 overflow-hidden rounded-2xl border border-white/[0.12] bg-gradient-to-br from-[#111018] via-[#0b0a10] to-[#171020] p-5 sm:min-h-[260px] sm:rounded-[2rem] sm:p-9 lg:col-span-5 lg:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden"
            >
              <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full border border-[#a8a0bb]/25 bg-black/20" />
              <div className="absolute -right-2 top-16 h-56 w-56 rounded-full bg-[#9b5de5]/10 blur-2xl" />
              <div className="absolute -bottom-20 -left-12 h-52 w-52 rounded-full bg-[#b84a76]/15 blur-2xl" />
              <div className="absolute bottom-[-5rem] right-[-3rem] h-64 w-64 rounded-full border border-[#d6b46a]/20" />
            </div>

            <div className="relative z-10 flex h-full flex-col items-start">
              <Link
                to="/"
                onClick={scrollToTop}
                aria-label="ArtistManch home"
                className="inline-flex items-center gap-3"
              >
                <img
                  src={logo}
                  alt="ArtistManch Logo"
                  className="h-10 w-auto object-contain transition-transform hover:scale-105 sm:h-12"
                />
              </Link>

              <h2 className="mt-5 max-w-md font-playfair text-2xl leading-tight text-white sm:mt-10 sm:text-4xl lg:text-[2.65rem]">
                Har Jashn Ho{' '}
                <span className="italic text-[#d6b46a]">Shaandaar!.</span>
              </h2>

              <p className="mt-2 max-w-sm text-xs leading-5 text-white/55 sm:mt-4 sm:text-base sm:leading-6">
                Discover extraordinary talent and bring the right artist to
                your special moments.
              </p>

              <Link
                to="/browse"
                onClick={scrollToTop}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#c6a15b]/40 bg-[#c6a15b]/10 px-4 py-2.5 text-xs font-semibold text-[#f0d58d] transition hover:border-[#c6a15b] hover:bg-[#c6a15b]/20 sm:mt-7 sm:px-5 sm:py-3 sm:text-sm"
              >
                Explore artists
                <span className="material-symbols-outlined text-[18px]">
                  arrow_outward
                </span>
              </Link>
            </div>
          </div>

          {/* Navigation columns */}
          <div className="grid grid-cols-2 items-start gap-x-4 gap-y-7 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-9 lg:col-span-7 lg:grid-cols-4 lg:gap-x-7 lg:pl-3">
            <div className="flex min-w-0 flex-col items-start gap-3 sm:gap-4">
              <h3 className="text-sm font-bold tracking-wide text-white">
                For Clients
              </h3>
              <FooterLink to="/browse">Browse Artists</FooterLink>
              <FooterLink to="/booking">Start Booking</FooterLink>
            </div>

            <div className="flex min-w-0 flex-col items-start gap-3 sm:gap-4">
              <h3 className="text-sm font-bold tracking-wide text-white">
                For Artists
              </h3>
              <FooterLink to="/join">Join as Artist</FooterLink>
              <FooterLink to="/artist-faq">Artist FAQ</FooterLink>
            </div>

            <div className="flex min-w-0 flex-col items-start gap-3 sm:gap-4">
              <h3 className="text-sm font-bold tracking-wide text-white">
                ArtistManch
              </h3>
              <FooterLink to="/">Our Story</FooterLink>
              <FooterLink to="/browse">Explore Talent</FooterLink>
              <FooterLink to="/contact">Contact Us</FooterLink>
            </div>

            <div className="flex min-w-0 flex-col items-start gap-3 sm:gap-4">
              <h3 className="text-sm font-bold tracking-wide text-white">
                Policies
              </h3>
              <FooterLink to="/privacy-policy">Privacy Policy</FooterLink>
              <FooterLink to="/terms">Terms of Service</FooterLink>
              <FooterLink to="/refund-policy">Refund Policy</FooterLink>
            </div>

            <div className="flex min-w-0 flex-col items-start gap-3 sm:gap-4">
              <h3 className="text-sm font-bold tracking-wide text-white">
                Connect with Us
              </h3>
              <a
                href="https://wa.me/+917303195782"
                target="_blank"
                rel="noreferrer"
                className={linkClass}
              >
                <SocialIcon icon="whatsapp" />
                WhatsApp Us
              </a>
              <a
                href="https://wa.me/+918810321546"
                target="_blank"
                rel="noreferrer"
                className={linkClass}
              >
                <span className="material-symbols-outlined text-sm">person</span>
                For Artists
              </a>
            </div>

            <div className="flex min-w-0 flex-col items-start gap-3 sm:gap-4">
              <h3 className="text-sm font-bold tracking-wide text-white">
                Our Office
              </h3>
              <a
                href="https://share.google/FHyk0IkZb4AT4LXM9"
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-start text-sm leading-6 text-white/60 transition-colors hover:text-[#d9b8ff]"
              >
                <span>Mezz & 1st Floor, A-83,</span>
                <span>Pocket D, Okhla Phase II,</span>
                <span>Okhla Industrial Estate,</span>
                <span>New Delhi, Delhi 110020</span>
                <span className="mt-1 flex items-center gap-1 text-[11px] font-bold text-[#c6a15b] opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="material-symbols-outlined text-[14px]">
                    location_on
                  </span>
                  View on Maps
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col gap-4 border-t border-white/[0.10] pt-5 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:pt-6">
          <p className="text-xs leading-5 text-white/40">
            © {new Date().getFullYear()} ArtistManch. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            <span className="mr-1 text-xs text-white/40">
              Follow the spotlight
            </span>

            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={item.label}
                title={item.label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/65 transition hover:border-[#c6a15b]/50 hover:bg-[#c6a15b]/10 hover:text-[#e7c879]"
              >
                <SocialIcon icon={item.icon} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
