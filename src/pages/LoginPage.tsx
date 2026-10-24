import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const { resetPassword } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      if (errorMessage.includes('invalid-credential') || errorMessage.includes('wrong-password') || errorMessage.includes('user-not-found')) {
        setError('Invalid email or password. Please try again.');
      } else if (errorMessage.includes('too-many-requests')) {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    try {
      await resetPassword(email);
      setResetSent(true);
      setError('');
    } catch {
      setError('Failed to send reset email. Please check the address.');
    }
  }

  return (
    <div className="w-full pt-20 bg-background min-h-screen">
      <div className="flex flex-col w-full relative overflow-hidden py-10">
        {/* Atmospheric Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full blur-[140px] pointer-events-none -z-10" style={{ background: 'rgba(96,1,209,0.2)' }} />
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full blur-[100px] pointer-events-none -z-10" style={{ background: 'rgba(242,202,80,0.1)' }} />
        <div className="absolute bottom-10 right-1/4 w-[380px] h-[380px] rounded-full blur-[120px] pointer-events-none -z-10" style={{ background: 'rgba(36,17,61,0.3)' }} />

        <div className="w-full max-w-[1320px] mx-auto px-6 flex items-center justify-center my-auto min-h-[calc(100vh-14rem)]">
          <div className="w-full max-w-[490px] relative">
            {/* VIP Badge */}
            <div className="absolute -top-6 -right-6 hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-high/70 backdrop-blur-md shadow-xl text-primary font-bold text-[11px] uppercase tracking-widest pointer-events-none">
              <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <span>VIP Portal 2025</span>
            </div>

            {/* Card */}
            <div className="relative bg-surface-container-lowest/85 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 shadow-2xl border border-outline-variant/20 hover:shadow-[0_20px_60px_-15px_rgba(36,17,61,0.7)] transition-all duration-500">
              {/* Logo */}
              <div className="flex flex-col items-center text-center mb-8">
                <div className="relative group cursor-pointer mb-4">
                  <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center shadow-[0_0_28px_rgba(212,175,55,0.25)]">
                    <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                  </div>
                  <div className="absolute inset-0 rounded-full -z-10" style={{ background: 'rgba(212,175,55,0.2)', filter: 'blur(8px)' }} />
                </div>
                <span className="font-bold text-[11px] text-primary uppercase tracking-[0.22em] mb-1">Private Backstage Lounge</span>
                <h1 className="font-playfair text-[28px] sm:text-[40px] font-semibold text-on-surface tracking-tight mb-1">Welcome Back</h1>
                <p className="text-[15px] text-on-surface-variant max-w-[340px] leading-relaxed">
                  Access your verified celebration bookings and artist concierge.
                </p>
              </div>

              {/* Error / Success Messages */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-error-container/30 border border-error/30 flex items-start gap-2">
                  <span className="material-symbols-outlined text-error text-[18px] shrink-0 mt-0.5">error</span>
                  <p className="text-[13px] text-error">{error}</p>
                </div>
              )}
              {resetSent && (
                <div className="mb-4 p-3 rounded-xl bg-primary/10 border border-primary/30 flex items-start gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">check_circle</span>
                  <p className="text-[13px] text-primary">Password reset email sent! Check your inbox.</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Email */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[12px] text-on-surface uppercase tracking-wider" htmlFor="email-input">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 pointer-events-none flex items-center justify-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-[20px]">mail</span>
                    </div>
                    <input
                      id="email-input"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      autoComplete="email"
                      className="w-full bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/40 pl-11 pr-4 py-3.5 rounded-xl text-[15px] transition-all duration-300 focus:outline-none focus:bg-surface-container focus:shadow-[0_0_0_2px_rgba(212,175,55,0.3)] border border-transparent focus:border-primary"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-[12px] text-on-surface uppercase tracking-wider" htmlFor="password-input">
                      Password
                    </label>
                    <span className="text-[11px] text-on-surface-variant">256-Bit SSL Encrypted</span>
                  </div>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 pointer-events-none flex items-center justify-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-[20px]">lock</span>
                    </div>
                    <input
                      id="password-input"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      autoComplete="current-password"
                      className="w-full bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/40 pl-11 pr-11 py-3.5 rounded-xl text-[15px] transition-all duration-300 focus:outline-none focus:bg-surface-container focus:shadow-[0_0_0_2px_rgba(212,175,55,0.3)] border border-transparent focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 text-on-surface-variant hover:text-primary transition-colors"
                      aria-label="Toggle password visibility"
                    >
                      <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="peer w-4 h-4 rounded-sm appearance-none bg-surface-container-low transition-all checked:bg-primary cursor-pointer focus:outline-none"
                      />
                      <span className="material-symbols-outlined text-[13px] text-on-primary absolute pointer-events-none opacity-0 peer-checked:opacity-100 font-bold transition-opacity">check</span>
                    </div>
                    <span className="text-[13px] text-on-surface-variant">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="font-bold text-[12px] text-primary hover:text-primary-fixed transition-colors underline-offset-4 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Submit */}
                <div className="pt-2 flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    id="login-submit-btn"
                    className="w-full relative overflow-hidden group bg-primary hover:bg-primary-fixed text-on-primary font-semibold text-[18px] py-3.5 px-4 rounded-xl transition-all duration-300 shadow-[0_8px_24px_rgba(212,175,55,0.24)] hover:shadow-[0_12px_32px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 pointer-events-none transition-transform ease-in-out" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)' }} />
                    {loading ? (
                      <>
                        <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                        <span>Authenticating...</span>
                      </>
                    ) : (
                      <>
                        <span>Login to ArtistManch</span>
                        <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1 duration-300">arrow_forward</span>
                      </>
                    )}
                  </button>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-[13px] text-on-surface-variant">Don't have an account?</span>
                    <Link to="/signup" className="font-bold text-[12px] text-primary hover:text-primary-fixed transition-colors">Sign Up</Link>
                  </div>
                </div>
              </form>

              {/* Security Note */}
              <div className="mt-6 pt-4 bg-surface-container-low/40 rounded-xl p-3 flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">lock_person</span>
                <p className="font-bold text-[11px] text-on-surface-variant leading-snug">
                  Protected by Firebase Authentication with 256-bit encryption. Instant access to verified advance bookings.
                </p>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-4 flex items-center justify-center gap-6 text-on-surface-variant font-bold text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                24/7 Artist Desk
              </span>
              <span className="opacity-30">•</span>
              <span>Strict Escrow Custody</span>
              <span className="opacity-30">•</span>
              <span>Rider Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
