import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/artist-manch-logo-transparent-for-light-bg.png';
import { ARTIST_CATEGORIES } from '../data/artists';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [artistDropdownOpen, setArtistDropdownOpen] = useState(false);
  const [forArtistsDropdownOpen, setForArtistsDropdownOpen] = useState(false);
  const [mobileArtistsOpen, setMobileArtistsOpen] = useState(false);
  const [mobileForArtistsOpen, setMobileForArtistsOpen] = useState(false);
  const [whatsappOpen, setWhatsappOpen] = useState(false);

  const isActive = (path: string) =>
    location.pathname === path
      ? 'text-primary font-bold'
      : 'text-on-surface-variant hover:text-on-surface';

  function closeMenus() {
    setMobileOpen(false);
    setUserMenuOpen(false);
    setArtistDropdownOpen(false);
    setForArtistsDropdownOpen(false);
    setMobileArtistsOpen(false);
    setMobileForArtistsOpen(false);
  }

  async function handleLogout() {
    await logout();
    closeMenus();
    navigate('/');
  }

  return (
    <header
      className="fixed top-0 left-0 w-full z-[100] flex flex-col"
      onClick={(event) => {
        const target = event.target as HTMLElement;
        if (target.closest('a, button')) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }}
    >
      <style>{`
        @keyframes artistmanch-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .artistmanch-marquee-track {
          display: flex;
          width: max-content;
          animation: artistmanch-marquee 30s linear infinite;
        }

        .artistmanch-marquee-track:hover {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .artistmanch-marquee-track {
            animation: none;
          }
        }
      `}</style>

      {/* Main Navigation: above the announcement marquee */}
      <div className="relative z-[70] w-full h-16 sm:h-20 shrink-0 bg-surface-container-lowest/95 backdrop-blur-xl border-b border-outline-variant/20 shadow-[0_12px_32px_-4px_rgba(36,17,61,0.25)]">
        <div className="max-w-[1440px] mx-auto h-full px-3 sm:px-4 md:px-8 xl:px-12 flex items-center gap-2 sm:gap-4 lg:gap-7">

          {/* ArtistManch Logo: Far Left */}
          <Link
  to="/"
  onClick={closeMenus}
  className="flex items-center gap-2 shrink-0 group"
  aria-label="ArtistManch home"
>
  <img
    src={logo}
    alt="ArtistManch Logo"
    className="h-10 xs:h-11 sm:h-14 md:h-16 w-auto max-w-[148px] sm:max-w-none object-contain transition-transform group-hover:scale-105"
  />
</Link>

          <div className="flex-1 min-w-0" />

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="lg:hidden w-11 h-11 shrink-0 flex items-center justify-center text-on-surface rounded-lg hover:bg-surface-container-high"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileOpen ? 'close' : 'menu'}
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center gap-5 xl:gap-7"
            aria-label="Main navigation"
          >
            <Link
              to="/"
              className={`whitespace-nowrap text-[14px] transition-colors ${isActive('/')}`}
            >
              Home
            </Link>

            {/* Book an Artist Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => {
                setArtistDropdownOpen(true);
                setForArtistsDropdownOpen(false);
              }}
              onMouseLeave={() => setArtistDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => {
                  setArtistDropdownOpen((open) => !open);
                  setForArtistsDropdownOpen(false);
                }}
                className={`flex items-center gap-1 whitespace-nowrap text-[14px] transition-colors ${
                  artistDropdownOpen
                    ? 'text-primary font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                aria-expanded={artistDropdownOpen}
              >
                Book an Artist
                <span className="material-symbols-outlined text-[18px]">
                  {artistDropdownOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                </span>
              </button>

              {artistDropdownOpen && (
                <div className="absolute left-0 top-full w-[min(850px,85vw)] pt-3 z-[90]">
                  <div className="grid grid-cols-2 xl:grid-cols-4 gap-x-5 gap-y-1 rounded-2xl border border-white/10 bg-[#111019] p-5 xl:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.65)]">
                    {ARTIST_CATEGORIES.map((category) => (
                      <Link
                        key={category}
                        to={`/browse?category=${encodeURIComponent(category)}`}
                        className="rounded-lg px-3 py-3 text-[12px] xl:text-sm uppercase font-medium text-on-surface hover:text-primary hover:bg-white/5 transition-colors"
                        onClick={closeMenus}
                      >
                        {category}
                      </Link>
                    ))}

                    {/* More Options: for categories not listed above */}
                    <div className="col-span-2 xl:col-span-4 mt-3 border-t border-white/10 pt-4">
                      <Link
                        to="/post-requirement"
                        onClick={closeMenus}
                        className="flex items-center justify-between gap-4 rounded-xl border border-primary/25 bg-primary/5 px-4 py-4 text-on-surface transition-all hover:border-primary/60 hover:bg-primary/10"
                      >
                        <span>
                          <span className="block text-sm font-bold uppercase tracking-wide text-primary">
                            More Options
                          </span>
                          <span className="mt-1 block text-xs text-on-surface-variant">
                            Can't find your category? Tell us what you're looking for.
                          </span>
                        </span>
                        <span className="material-symbols-outlined shrink-0 text-primary">
                          arrow_forward
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/booking"
              className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap px-3 xl:px-4 py-2.5 bg-primary text-black font-bold text-[12px] xl:text-[14px] rounded-xl shadow-gold hover:scale-[1.02] transition-all ${location.pathname === '/booking' ? 'ring-1 ring-primary/60' : ''}`}
            >
              Last-Minute Booking
            </Link>

            {/* For Artists Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => {
                setForArtistsDropdownOpen(true);
                setArtistDropdownOpen(false);
              }}
              onMouseLeave={() => setForArtistsDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => {
                  setForArtistsDropdownOpen((open) => !open);
                  setArtistDropdownOpen(false);
                }}
                className={`flex items-center gap-1 whitespace-nowrap text-[14px] transition-colors ${
                  forArtistsDropdownOpen
                    ? 'text-primary font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                aria-expanded={forArtistsDropdownOpen}
              >
                For Artists
                <span className="material-symbols-outlined text-[18px]">
                  {forArtistsDropdownOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                </span>
              </button>

              {forArtistsDropdownOpen && (
                <div className="absolute left-0 top-full w-64 pt-3 z-[90]">
                  <div className="rounded-2xl border border-white/10 bg-[#111019] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.65)]">
                    <Link
                      to="/join"
                      className="block rounded-lg px-4 py-3 text-sm text-on-surface hover:bg-white/5 hover:text-primary transition-colors"
                      onClick={closeMenus}
                    >
                      Active Gigs
                    </Link>

                    <Link
                      to="/artist-faq"
                      className="block rounded-lg px-4 py-3 text-sm text-on-surface hover:bg-white/5 hover:text-primary transition-colors"
                      onClick={closeMenus}
                    >
                      Artist FAQ
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Side: Requirement + Authentication */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-3 shrink-0">

            <Link
              to="/post-requirement"
              className="hidden md:inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-[14px] transition-all px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/60 shadow-[0_0_15px_rgba(212,175,55,0.1)]"
            >
              <span>Post Your Requirement</span>
              <span className="material-symbols-outlined text-[17px]">
                arrow_forward
              </span>
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="hidden sm:inline-flex items-center gap-1 px-3 py-2 bg-primary-container hover:bg-primary text-on-primary font-bold text-[13px] rounded-xl shadow-gold transition-all"
                >
                  <span>My Bookings</span>
                  <span className="material-symbols-outlined text-[17px]">
                    arrow_forward
                  </span>
                </Link>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen((open) => !open)}
                    className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-[0_0_12px_rgba(212,175,55,0.3)] hover:scale-105 transition-all"
                    aria-label="Open user menu"
                    aria-expanded={userMenuOpen}
                  >
                    <span
                      className="material-symbols-outlined text-on-primary text-[18px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      person
                    </span>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-12 w-52 bg-[#17151d] rounded-xl shadow-2xl border border-white/10 overflow-hidden z-[100]">
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="font-bold text-[13px] text-on-surface truncate">
                          {user.displayName || 'Customer'}
                        </p>
                        <p className="text-[11px] text-on-surface-variant truncate">
                          {user.email}
                        </p>
                      </div>

                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-4 py-2.5 text-on-surface hover:bg-white/5 text-[13px] transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <span className="material-symbols-outlined text-[18px] text-primary">
                          dashboard
                        </span>
                        My Bookings
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-on-surface-variant hover:text-on-surface hover:bg-white/5 text-[13px] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          logout
                        </span>
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-flex font-bold text-[14px] text-on-surface-variant hover:text-on-surface px-2 py-1.5 transition-colors"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="font-bold text-[12px] sm:text-[14px] bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary px-2.5 sm:px-4 py-2.5 sm:py-2 rounded-xl shadow-gold transition-all whitespace-nowrap"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain bg-[#111019] border-b border-white/10 shadow-2xl py-3 sm:py-4 px-3 sm:px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] flex flex-col gap-1 z-[100]">
            <Link
              to="/"
              className={`min-h-11 flex items-center py-3 px-3 rounded-lg text-sm ${isActive('/')}`}
              onClick={closeMenus}
            >
              Home
            </Link>

            {/* Mobile Book an Artist Accordion */}
            <button
              type="button"
              onClick={() => setMobileArtistsOpen((open) => !open)}
              className="min-h-11 flex items-center justify-between py-3 px-3 rounded-lg text-sm text-on-surface-variant hover:text-on-surface"
              aria-expanded={mobileArtistsOpen}
            >
              Book an Artist
              <span className="material-symbols-outlined">
                {mobileArtistsOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {mobileArtistsOpen && (
              <div className="ml-3 pl-3 border-l border-white/15 grid grid-cols-2 gap-1">
                {ARTIST_CATEGORIES.map((category) => (
                  <Link
                    key={category}
                    to={`/browse?category=${encodeURIComponent(category)}`}
                    className="min-h-10 flex items-center py-2 px-2 rounded-md text-xs text-on-surface-variant hover:text-primary"
                    onClick={closeMenus}
                  >
                    {category}
                  </Link>
                ))}
                <Link
                  to="/post-requirement"
                  className="col-span-2 mt-2 rounded-lg border border-primary/25 bg-primary/5 px-3 py-3 text-sm font-bold text-primary hover:bg-primary/10"
                  onClick={closeMenus}
                >
                  <span className="flex items-center justify-between gap-2">
                    More Options – Post Your Requirement
                    <span className="material-symbols-outlined text-base">
                      arrow_forward
                    </span>
                  </span>
                </Link>
              </div>
            )}

            <Link
              to="/booking"
              className={`my-1 mx-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold bg-primary text-black shadow-gold transition-all hover:scale-[1.01] ${
                location.pathname === '/booking' ? 'ring-1 ring-primary/60' : ''
              }`}
              onClick={closeMenus}
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">
                  alarm
                </span>
                Last-Minute Booking
              </span>
            </Link>

            {/* Mobile For Artists Accordion */}
            <button
              type="button"
              onClick={() => setMobileForArtistsOpen((open) => !open)}
              className="min-h-11 flex items-center justify-between py-3 px-3 rounded-lg text-sm text-on-surface-variant hover:text-on-surface"
              aria-expanded={mobileForArtistsOpen}
            >
              For Artists
              <span className="material-symbols-outlined">
                {mobileForArtistsOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {mobileForArtistsOpen && (
              <div className="ml-3 pl-3 border-l border-white/15">
                <Link
                  to="/active-gigs"
                  className="min-h-11 flex items-center py-3 px-3 text-sm text-on-surface-variant hover:text-primary"
                  onClick={closeMenus}
                >
                  Active Gigs
                </Link>

                <Link
                  to="/artist-faq"
                  className="min-h-11 flex items-center py-3 px-3 text-sm text-on-surface-variant hover:text-primary"
                  onClick={closeMenus}
                >
                  Artist FAQ
                </Link>
              </div>
            )}

            <Link
              to="/post-requirement"
              className="flex items-center justify-center gap-2 mt-2 py-3 px-4 rounded-xl text-sm font-bold border border-primary/25 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all"
              onClick={closeMenus}
            >
              Post Your Requirement
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="min-h-11 flex items-center py-3 px-3 rounded-lg text-sm text-on-surface-variant hover:text-primary"
                  onClick={closeMenus}
                >
                  My Bookings
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="min-h-11 text-left py-3 px-3 rounded-lg text-sm text-on-surface-variant hover:text-primary"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-3 pt-3 mt-2 border-t border-white/10">
                <Link
                  to="/login"
                  className="flex-1 text-center py-2.5 rounded-lg border border-white/15 text-on-surface text-sm font-semibold"
                  onClick={closeMenus}
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="flex-1 text-center py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold"
                  onClick={closeMenus}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Festive Announcement Marquee: Below Navbar */}
      <aside
        id="festive-banner"
        className="relative z-[10] w-full shrink-0 overflow-hidden border-b border-outline-variant/30 py-1.5 whitespace-nowrap"
        style={{
          background: 'linear-gradient(to right, #24113d, #0e0e11, #131316)',
        }}
        aria-label="Festive season announcement"
      >
        <div className="artistmanch-marquee-track">
          {[0, 1].map((group) => (
            <div
              key={group}
              aria-hidden={group === 1}
              className="flex shrink-0 items-center"
            >
              <span className="font-bold text-[14px] sm:text-[17px] text-primary tracking-wide px-8">
                ✨ No need to pay 50% advance! Book your favourite artist with just 20%.
              </span>
            </div>
          ))}
        </div>
      </aside>

      {/* Floating WhatsApp Contact Menu */}
      <div
        className="fixed bottom-5 right-5 z-[150] flex flex-col items-end gap-3"
        onMouseEnter={() => setWhatsappOpen(true)}
        onMouseLeave={() => setWhatsappOpen(false)}
      >
        {whatsappOpen && (
          <div className="flex min-w-[190px] flex-col gap-2 rounded-2xl border border-white/10 bg-[#17151d]/95 p-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <a
              href="https://wa.me/918810321546?text=Hi%20ArtistManch%2C%20I%20am%20an%20artist%20and%20would%20like%20to%20connect."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              onClick={() => setWhatsappOpen(false)}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366]/15 text-[#25D366]">
                <span className="material-symbols-outlined">music_note</span>
              </span>
              <span>For Artists</span>
            </a>

            <a
              href="https://wa.me/917303195782?text=Hi%20ArtistManch%2C%20I%20need%20help%20with%20an%20artist%20booking."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              onClick={() => setWhatsappOpen(false)}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366]/15 text-[#25D366]">
                <span className="material-symbols-outlined">person</span>
              </span>
              <span>For Users</span>
            </a>
          </div>
        )}

        <button
          type="button"
          onClick={() => setWhatsappOpen((open) => !open)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_28px_rgba(37,211,102,0.4)] transition-all duration-200 hover:scale-110 hover:bg-[#20bd5a] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40"
          aria-label={whatsappOpen ? "Close WhatsApp contact options" : "Open WhatsApp contact options"}
          aria-expanded={whatsappOpen}
        >
          <svg
            viewBox="0 0 32 32"
            className="h-8 w-8 fill-current"
            aria-hidden="true"
          >
            <path d="M16.02 3C8.86 3 3.04 8.78 3.04 15.9c0 2.28.6 4.5 1.74 6.47L3 29l6.82-1.78a13.1 13.1 0 0 0 6.2 1.56h.01c7.15 0 12.97-5.79 12.97-12.9 0-3.45-1.35-6.69-3.8-9.13A12.9 12.9 0 0 0 16.02 3Zm0 23.58h-.01a10.7 10.7 0 0 1-5.45-1.49l-.39-.23-4.05 1.06 1.08-3.94-.25-.4a10.58 10.58 0 0 1-1.63-5.68c0-5.88 4.83-10.66 10.7-10.66 2.84 0 5.52 1.1 7.53 3.12a10.55 10.55 0 0 1 3.13 7.54c0 5.88-4.82 10.68-10.66 10.68Zm5.87-7.99c-.32-.16-1.9-.94-2.2-1.05-.3-.11-.51-.16-.73.16-.21.32-.83 1.05-1.02 1.27-.19.21-.38.24-.7.08-.32-.16-1.35-.5-2.57-1.58-.95-.84-1.59-1.88-1.78-2.2-.19-.32-.02-.49.14-.65.14-.14.32-.38.48-.57.16-.19.21-.32.32-.54.11-.21.05-.4-.03-.56-.08-.16-.73-1.75-1-2.4-.26-.62-.53-.54-.73-.55h-.62c-.21 0-.56.08-.86.4-.3.32-1.13 1.1-1.13 2.69s1.16 3.12 1.32 3.34c.16.21 2.28 3.47 5.52 4.87.77.33 1.37.53 1.84.68.77.24 1.47.21 2.02.13.62-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.53-.08-.13-.3-.21-.62-.37Z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
