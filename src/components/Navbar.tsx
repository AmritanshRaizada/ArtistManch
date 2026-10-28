import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
    <header className="fixed top-0 left-0 w-full z-[100] flex flex-col">
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
      <div className="relative z-[70] w-full h-20 shrink-0 bg-surface-container-lowest/95 backdrop-blur-xl border-b border-outline-variant/20 shadow-[0_12px_32px_-4px_rgba(36,17,61,0.25)]">
        <div className="max-w-[1440px] mx-auto h-full px-4 md:px-8 xl:px-12 flex items-center gap-4 lg:gap-7">

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="lg:hidden w-9 h-9 shrink-0 flex items-center justify-center text-on-surface rounded-lg hover:bg-surface-container-high"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileOpen ? 'close' : 'menu'}
            </span>
          </button>

          {/* ArtistManch Logo: Far Left */}
          <Link
            to="/"
            onClick={closeMenus}
            className="flex items-center gap-2 shrink-0 group"
            aria-label="ArtistManch home"
          >
            <div className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center shadow-[0_0_16px_rgba(212,175,55,0.2)]">
              <span
                className="material-symbols-outlined text-primary text-[22px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                stars
              </span>
            </div>

            <div className="flex flex-col">
              <span className="font-playfair text-[20px] sm:text-[22px] font-semibold text-on-surface tracking-tight group-hover:text-primary transition-colors">
                ArtistManch
              </span>
              <span className="font-jakarta text-[9px] font-bold text-on-surface-variant uppercase tracking-widest hidden sm:block">
                Grand Stage Prestige
              </span>
            </div>
          </Link>

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
                  </div>
                </div>
              )}
            </div>

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

          <div className="flex-1 min-w-0" />

          {/* Right Side: Requirement + Authentication */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 shrink-0">

            <Link
              to="/post-requirement"
              className="hidden md:inline-flex items-center justify-center gap-1.5 px-3 xl:px-4 py-2.5 bg-primary text-on-primary font-bold text-[12px] xl:text-[14px] rounded-xl shadow-gold hover:scale-[1.02] transition-all whitespace-nowrap"
            >
              <span>Post Your Requirement</span>
              <span className="material-symbols-outlined text-[17px]">
                arrow_forward
              </span>
            </Link>

            {user ? (
              <>
                <Link
                  to="/browse"
                  className="hidden sm:inline-flex items-center gap-1 px-3 py-2 bg-primary-container hover:bg-primary text-on-primary font-bold text-[13px] rounded-xl shadow-gold transition-all"
                >
                  <span>Find My Artist</span>
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
                  className="font-bold text-[13px] sm:text-[14px] bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary px-3 sm:px-4 py-2 rounded-xl shadow-gold transition-all whitespace-nowrap"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full max-h-[75vh] overflow-y-auto bg-[#111019] border-b border-white/10 shadow-2xl py-4 px-4 flex flex-col gap-1 z-[100]">
            <Link
              to="/"
              className={`py-3 px-3 rounded-lg text-sm ${isActive('/')}`}
              onClick={closeMenus}
            >
              Home
            </Link>

            {/* Mobile Book an Artist Accordion */}
            <button
              type="button"
              onClick={() => setMobileArtistsOpen((open) => !open)}
              className="flex items-center justify-between py-3 px-3 rounded-lg text-sm text-on-surface-variant hover:text-on-surface"
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
                    className="py-2 px-2 rounded-md text-xs text-on-surface-variant hover:text-primary"
                    onClick={closeMenus}
                  >
                    {category}
                  </Link>
                ))}
              </div>
            )}

            {/* Mobile For Artists Accordion */}
            <button
              type="button"
              onClick={() => setMobileForArtistsOpen((open) => !open)}
              className="flex items-center justify-between py-3 px-3 rounded-lg text-sm text-on-surface-variant hover:text-on-surface"
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
                  className="block py-3 px-3 text-sm text-on-surface-variant hover:text-primary"
                  onClick={closeMenus}
                >
                  Active Gigs
                </Link>

                <Link
                  to="/artist-faq"
                  className="block py-3 px-3 text-sm text-on-surface-variant hover:text-primary"
                  onClick={closeMenus}
                >
                  Artist FAQ
                </Link>
              </div>
            )}

            <Link
              to="/booking"
              className="flex items-center justify-center gap-2 mt-2 py-3 px-4 rounded-xl bg-primary text-on-primary font-bold text-sm"
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
                  className="py-3 px-3 rounded-lg text-sm text-on-surface-variant hover:text-primary"
                  onClick={closeMenus}
                >
                  My Bookings
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-left py-3 px-3 rounded-lg text-sm text-on-surface-variant hover:text-primary"
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
                ✨ No need to pay 50% advance! Book your favourite artist with just 20% advance this festive season.
              </span>
            </div>
          ))}
        </div>
      </aside>
    </header>
  );
}
