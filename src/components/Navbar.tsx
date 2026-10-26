import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isActive = (path: string) =>
    location.pathname === path ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface';

  async function handleLogout() {
    await logout();
    navigate('/');
    setUserMenuOpen(false);
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex flex-col">
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
            display: flex;
            width: max-content;
          }
        `}
      </style>
      {/* Main Header */}
      <div className="w-full h-20 bg-surface-container-lowest/85 backdrop-blur-xl border-b border-outline-variant/20 shadow-[0_12px_32px_-4px_rgba(36,17,61,0.35)]">
        <div className="max-w-[1320px] mx-auto h-full px-4 md:px-12 flex items-center justify-between gap-4 relative">
          {/* Left: Desktop Nav / Mobile Menu Toggle */}
          <div className="flex-1 flex items-center gap-6 justify-start">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-9 h-9 flex items-center justify-center text-on-surface"
              aria-label="Toggle navigation menu"
            >
              <span className="material-symbols-outlined text-[24px]">
                {mobileOpen ? 'close' : 'menu'}
              </span>
            </button>

            <nav className="hidden lg:flex items-center gap-6">
              <Link to="/" className={`font-bold text-[14px] transition-colors ${isActive('/')}`}>Home</Link>
              <Link to="/browse" className={`font-bold text-[14px] transition-colors ${isActive('/browse')}`}>Browse Artists</Link>
              <Link to="/join" className={`font-bold text-[14px] transition-colors ${isActive('/join')}`}>Join as Artist</Link>
            </nav>
          </div>

          {/* Center: Logo */}
          <div className="flex items-center justify-center shrink-0">
            <Link to="/" className="flex items-center gap-2 focus:outline-none group">
              <div className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center shadow-[0_0_16px_rgba(212,175,55,0.2)]">
                <span className="material-symbols-outlined text-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  stars
                </span>
              </div>
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <span className="font-playfair text-[22px] font-semibold text-on-surface tracking-tight group-hover:text-primary transition-colors">
                  ArtistManch
                </span>
                <span className="font-jakarta text-[9px] font-bold text-on-surface-variant uppercase tracking-widest hidden sm:block">
                  Grand Stage Prestige
                </span>
              </div>
            </Link>
          </div>

          {/* Right: Auth Actions */}
          <div className="flex-1 flex items-center justify-end gap-3">
            {user ? (
              <>
                <Link
                  to="/browse"
                  className="hidden sm:inline-flex items-center gap-1 px-4 py-2 bg-primary-container hover:bg-primary text-on-primary font-bold text-[14px] rounded-xl shadow-gold transition-all hover:scale-[1.02]"
                >
                  <span>Find My Artist</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-[0_0_12px_rgba(212,175,55,0.3)] transition-all hover:scale-105"
                  >
                    <span className="material-symbols-outlined text-on-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      person
                    </span>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-12 w-52 bg-surface-container-high rounded-xl shadow-2xl border border-outline-variant/30 overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-outline-variant/20">
                        <p className="font-bold text-[13px] text-on-surface truncate">{user.displayName || 'Customer'}</p>
                        <p className="text-[11px] text-on-surface-variant truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-4 py-2.5 text-on-surface hover:bg-surface-container text-[13px] transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <span className="material-symbols-outlined text-[18px] text-primary">dashboard</span>
                        My Bookings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container text-[13px] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="font-bold text-[14px] text-on-surface-variant hover:text-on-surface px-3 py-1.5 transition-colors">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="font-bold text-[14px] bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary px-4 py-2 rounded-xl shadow-gold transition-all font-semibold"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Festive Banner */}
        <aside
          className="w-full border-t border-outline-variant/30 py-1.5 overflow-hidden text-on-surface whitespace-nowrap relative"
          id="festive-banner"
          style={{ background: 'linear-gradient(to right, #24113d, #0e0e11, #131316)' }}
        >
          <div className="animate-marquee hover:[animation-play-state:paused]">
            <div className="flex items-center">
              <span className="font-bold text-[18px] text-primary tracking-wide px-8">
                ✨ NO NEED TO PAY 50% ADVANCE! Book your favourite artist with just 20% advance this festive season.
              </span>
              
              <span className="font-bold text-[18px] text-primary tracking-wide px-8">
                ✨ NO NEED TO PAY 50% ADVANCE! Book your favourite artist with just 20% advance this festive season.
              </span>
              
            </div>
            <div className="flex items-center">
              <span className="font-bold text-[18px] text-primary tracking-wide px-8">
                ✨ NO NEED TO PAY 50% ADVANCE! Book your favourite artist with just 20% advance this festive season.
              </span>
              
              <span className="font-bold text-[18px] text-primary tracking-wide px-8">
                ✨ NO NEED TO PAY 50% ADVANCE! Book your favourite artist with just 20% advance this festive season.
              </span>
              
            </div>
          </div>
        </aside>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-surface-container-lowest border-b border-outline-variant/20 py-4 px-4 flex flex-col gap-2">
            <Link to="/" className="py-2 font-bold text-[14px] text-on-surface" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/browse" className="py-2 font-bold text-[14px] text-on-surface-variant" onClick={() => setMobileOpen(false)}>Browse Artists</Link>
            <Link to="/join" className="py-2 font-bold text-[14px] text-on-surface-variant" onClick={() => setMobileOpen(false)}>Join as Artist</Link>
            {user && (
              <Link to="/dashboard" className="py-2 font-bold text-[14px] text-on-surface-variant" onClick={() => setMobileOpen(false)}>My Bookings</Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
