import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

export default function AdminLoginPage() {
  const { isAdmin, loading, login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('admin@artistmanch.com');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (!loading && isAdmin) return <Navigate to="/admin" replace />;

  async function submit(e: FormEvent) {
    e.preventDefault(); setBusy(true); setError('');
    try {
      await login(email, password);
      const from = (location.state as { from?: string } | null)?.from || '/admin';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in. Check your credentials.');
    } finally { setBusy(false); }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#09070d] px-4 py-10 text-white">
      <div className="w-full max-w-md rounded-3xl border border-amber-300/20 bg-[#131019] p-8 shadow-2xl shadow-black/40">
        <div className="mb-8 text-center">
          <div className="text-xs font-bold uppercase tracking-[.35em] text-amber-300">ArtistManch</div>
          <h1 className="mt-3 text-3xl font-semibold">Super Admin</h1>
          <p className="mt-2 text-sm text-white/45">Sign in to manage artist profiles</p>
        </div>
        <form onSubmit={submit} className="space-y-5">
          <label className="block text-sm text-white/70">Email
            <input type="email" required autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-amber-300" />
          </label>
          <label className="block text-sm text-white/70">Password
            <input type="password" required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-amber-300" />
          </label>
          {error && <p role="alert" className="rounded-xl border border-red-400/20 bg-red-950/30 p-3 text-sm text-red-200">{error}</p>}
          <button disabled={busy} className="w-full rounded-xl bg-amber-300 px-4 py-3 font-bold text-black transition hover:bg-amber-200 disabled:opacity-50">{busy ? 'Signing in…' : 'Sign in securely'}</button>
        </form>
        <p className="mt-6 text-center text-xs leading-5 text-white/35">Authorized ArtistManch administrator access only.</p>
      </div>
    </main>
  );
}
