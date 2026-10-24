import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function validatePassword(pw: string) {
    if (pw.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(pw)) return 'Password must contain at least one uppercase letter.';
    if (!/[0-9]/.test(pw)) return 'Password must contain at least one number.';
    return '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) { setError('Full name is required.'); return; }
    const pwError = validatePassword(password);
    if (pwError) { setError(pwError); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    try {
      await signup(email, password, fullName.trim());
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('email-already-in-use')) {
        setError('This email is already registered. Please login instead.');
      } else if (msg.includes('invalid-email')) {
        setError('Please enter a valid email address.');
      } else if (msg.includes('weak-password')) {
        setError('Password is too weak. Please choose a stronger password.');
      } else {
        setError('Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  const passwordStrength = () => {
    if (!password) return { level: 0, label: '', color: '' };
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    if (strength === 1) return { level: 1, label: 'Weak', color: 'bg-error' };
    if (strength === 2) return { level: 2, label: 'Fair', color: 'bg-primary' };
    if (strength === 3) return { level: 3, label: 'Good', color: 'bg-primary' };
    return { level: 4, label: 'Strong', color: 'bg-emerald-400' };
  };

  const pwStrength = passwordStrength();

  return (
    <div className="w-full pt-20 bg-background min-h-screen">
      <div className="flex flex-col w-full relative overflow-hidden py-10">
        {/* Atmospheric Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full blur-[140px] pointer-events-none -z-10" style={{ background: 'rgba(96,1,209,0.2)' }} />
        <div className="absolute top-1/4 right-1/3 w-[420px] h-[420px] rounded-full blur-[100px] pointer-events-none -z-10" style={{ background: 'rgba(212,175,55,0.1)' }} />

        <div className="w-full max-w-[1320px] mx-auto px-6 flex items-center justify-center my-auto">
          <div className="w-full max-w-[520px] relative">
            {/* Card */}
            <div className="relative bg-surface-container-lowest/85 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 shadow-2xl border border-outline-variant/20 hover:shadow-[0_20px_60px_-15px_rgba(36,17,61,0.7)] transition-all duration-500">
              {/* Logo */}
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center shadow-[0_0_28px_rgba(212,175,55,0.25)] mb-4">
                  <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                </div>
                <span className="font-bold text-[11px] text-primary uppercase tracking-[0.22em] mb-1">Join the Inner Circle</span>
                <h1 className="font-playfair text-[28px] sm:text-[40px] font-semibold text-on-surface tracking-tight mb-1">Create Account</h1>
                <p className="text-[15px] text-on-surface-variant max-w-[340px] leading-relaxed">
                  Join thousands of event hosts who trust ArtistManch for premium artist bookings.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-error-container/30 border border-error/30 flex items-start gap-2">
                  <span className="material-symbols-outlined text-error text-[18px] shrink-0 mt-0.5">error</span>
                  <p className="text-[13px] text-error">{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Full Name */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[12px] text-on-surface uppercase tracking-wider" htmlFor="fullname-input">Full Name *</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 pointer-events-none text-on-surface-variant">
                      <span className="material-symbols-outlined text-[20px]">person</span>
                    </div>
                    <input
                      id="fullname-input"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your Full Name"
                      autoComplete="name"
                      className="w-full bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/40 pl-11 pr-4 py-3.5 rounded-xl text-[15px] transition-all duration-300 focus:outline-none focus:bg-surface-container focus:shadow-[0_0_0_2px_rgba(212,175,55,0.3)] border border-transparent focus:border-primary"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[12px] text-on-surface uppercase tracking-wider" htmlFor="email-signup-input">Email Address *</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 pointer-events-none text-on-surface-variant">
                      <span className="material-symbols-outlined text-[20px]">mail</span>
                    </div>
                    <input
                      id="email-signup-input"
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
                  <label className="font-bold text-[12px] text-on-surface uppercase tracking-wider" htmlFor="password-signup-input">Password *</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 pointer-events-none text-on-surface-variant">
                      <span className="material-symbols-outlined text-[20px]">lock</span>
                    </div>
                    <input
                      id="password-signup-input"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 chars, 1 uppercase, 1 number"
                      autoComplete="new-password"
                      className="w-full bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/40 pl-11 pr-11 py-3.5 rounded-xl text-[15px] transition-all duration-300 focus:outline-none focus:bg-surface-container focus:shadow-[0_0_0_2px_rgba(212,175,55,0.3)] border border-transparent focus:border-primary"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-on-surface-variant hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                  {/* Password Strength */}
                  {password && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex gap-1 flex-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= pwStrength.level ? pwStrength.color : 'bg-surface-container-high'}`} />
                        ))}
                      </div>
                      <span className="font-bold text-[11px] text-on-surface-variant">{pwStrength.label}</span>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[12px] text-on-surface uppercase tracking-wider" htmlFor="confirm-password-input">Confirm Password *</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 pointer-events-none text-on-surface-variant">
                      <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                    </div>
                    <input
                      id="confirm-password-input"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your password"
                      autoComplete="new-password"
                      className={`w-full bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/40 pl-11 pr-4 py-3.5 rounded-xl text-[15px] transition-all duration-300 focus:outline-none focus:bg-surface-container border ${confirmPassword && password !== confirmPassword ? 'border-error focus:shadow-[0_0_0_2px_rgba(255,180,171,0.3)]' : confirmPassword && password === confirmPassword ? 'border-emerald-500 focus:shadow-[0_0_0_2px_rgba(52,211,153,0.3)]' : 'border-transparent focus:border-primary focus:shadow-[0_0_0_2px_rgba(212,175,55,0.3)]'}`}
                    />
                    {confirmPassword && password === confirmPassword && (
                      <span className="absolute right-4 text-emerald-400">
                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-2 flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    id="signup-submit-btn"
                    className="w-full relative overflow-hidden group bg-primary hover:bg-primary-fixed text-on-primary font-semibold text-[18px] py-3.5 px-4 rounded-xl transition-all duration-300 shadow-[0_8px_24px_rgba(212,175,55,0.24)] hover:shadow-[0_12px_32px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 pointer-events-none transition-transform ease-in-out" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)' }} />
                    {loading ? (
                      <>
                        <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create My Account</span>
                        <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1 duration-300">arrow_forward</span>
                      </>
                    )}
                  </button>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-[13px] text-on-surface-variant">Already have an account?</span>
                    <Link to="/login" className="font-bold text-[12px] text-primary hover:text-primary-fixed transition-colors">Sign In</Link>
                  </div>
                </div>
              </form>

              {/* Security Note */}
              <div className="mt-6 pt-4 bg-surface-container-low/40 rounded-xl p-3 flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">shield</span>
                <p className="font-bold text-[11px] text-on-surface-variant leading-snug">
                  Your data is protected with 256-bit encryption. We never share your personal information with third parties without consent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
