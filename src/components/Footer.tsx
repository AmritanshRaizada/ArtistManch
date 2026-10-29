
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/artist-manch-logo-transparent-for-light-bg.png';

const socialLinks = [
  {
    label: 'Instagram',
    href: import.meta.env.VITE_INSTAGRAM_URL as string | undefined,
    icon: 'photo_camera',
  },
  {
    label: 'Facebook',
    href: import.meta.env.VITE_FACEBOOK_URL as string | undefined,
    icon: 'public',
  },
  {
    label: 'YouTube',
    href: import.meta.env.VITE_YOUTUBE_URL as string | undefined,
    icon: 'smart_display',
  },
];

const linkClass =
  'group inline-flex w-fit items-center gap-2 text-sm text-white/60 transition-colors duration-200 hover:text-[#d9b8ff]';

// Reusable scroll-to-top handler for all footer links.
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

// function FooterAnchor({
//   href,
//   children,
// }: {
//   href: string;
//   children: ReactNode;
// }) {
//   return (
//     <a href={href} onClick={scrollToTop} className={linkClass}>
//       <span
//         className="h-px w-0 shrink-0 bg-[#b779ff] transition-all duration-200 group-hover:w-3"
//         aria-hidden="true"
//       />
//       {children}
//     </a>
//   );
// }

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

      <div className="mx-auto max-w-[1440px] px-5 pb-6 pt-14 sm:px-8 md:pt-20 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Brand panel */}
          <div className="relative min-h-[290px] overflow-hidden rounded-[2rem] border border-white/[0.12] bg-gradient-to-br from-[#111018] via-[#0b0a10] to-[#171020] p-7 sm:p-9 lg:col-span-5 lg:p-10">
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
                  className="h-10 sm:h-12 w-auto object-contain transition-transform hover:scale-105" 
                />
              </Link>

              <h2 className="mt-10 max-w-md font-playfair text-3xl leading-tight text-white sm:text-4xl lg:text-[2.65rem]">
                Har Jashn Ho{' '}
                <span className="italic text-[#d6b46a]">
                  Shaandaar!.
                </span>
              </h2>

              <p className="mt-4 max-w-sm text-sm leading-6 text-white/55 sm:text-base">
                Discover extraordinary talent and bring the right artist to
                your special moments.
              </p>

              <Link
                to="/browse"
                onClick={scrollToTop}
                className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#c6a15b]/40 bg-[#c6a15b]/10 px-5 py-3 text-sm font-semibold text-[#f0d58d] transition hover:border-[#c6a15b] hover:bg-[#c6a15b]/20"
              >
                Explore artists
                <span className="material-symbols-outlined text-[18px]">
                  arrow_outward
                </span>
              </Link>
            </div>
          </div>

          {/* Navigation columns */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-7 lg:grid-cols-4 lg:gap-x-7 lg:pl-3">
            <div className="flex flex-col items-start gap-4">
              <h3 className="text-sm font-bold tracking-wide text-white">
                For Clients
              </h3>
              <FooterLink to="/browse">Browse Artists</FooterLink>
              <FooterLink to="/booking">Start Booking</FooterLink>
              {/* <FooterLink to="/">How It Works</FooterLink> */}
            </div>

            <div className="flex flex-col items-start gap-4">
              <h3 className="text-sm font-bold tracking-wide text-white">
                For Artists
              </h3>
              <FooterLink to="/join">Join as Artist</FooterLink>
              <FooterLink to="/artist-faq">Artist FAQ</FooterLink>
            </div>

            <div className="flex flex-col items-start gap-4">
              <h3 className="text-sm font-bold tracking-wide text-white">
                ArtistManch
              </h3>
              <FooterLink to="/">Our Story</FooterLink>
              <FooterLink to="/browse">Explore Talent</FooterLink>
              <FooterLink to="/contact">Contact Us</FooterLink>
            </div>

            <div className="col-span-2 flex flex-col items-start gap-4 sm:col-span-1">
              <h3 className="text-sm font-bold tracking-wide text-white">
                Policies
              </h3>
              <FooterLink to="/privacy-policy">Privacy Policy</FooterLink>
              <FooterLink to="/terms">Terms of Service</FooterLink>
              <FooterLink to="/refund-policy">Refund Policy</FooterLink>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-5 border-t border-white/[0.10] pt-6 sm:mt-16 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-white/40">
            © {new Date().getFullYear()} ArtistManch. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            <span className="mr-1 text-xs text-white/40">
              Follow the spotlight
            </span>

            {socialLinks
              .filter((item) => item.href)
              .map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  title={item.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/65 transition hover:border-[#c6a15b]/50 hover:bg-[#c6a15b]/10 hover:text-[#e7c879]"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {item.icon}
                  </span>
                </a>
              ))}

            {socialLinks.every((item) => !item.href) && (
              <span className="text-xs text-white/35">
                Social links coming soon
              </span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
