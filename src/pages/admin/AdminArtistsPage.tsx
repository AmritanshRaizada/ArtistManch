import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

type Artist = {
  id: string; professional_name: string; category: string; languages: string[];
  profile_pic: string; starting_price: number; isPublished: boolean; isFeatured: boolean;
};
const categories = ['Celebrity Appearance','Comedian','Dancer/Troupe','DJ','Anchor/Emcee','Instrumentalist','Live Band','Magician','Make-up Artist/Stylist','Model','Photo/Videographer','Singer','Speaker','Variety Artist','Influencer'];
const money = (n = 0) => n ? `₹${n.toLocaleString('en-IN')}` : 'Not set';

export default function AdminArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All categories');
  const [error, setError] = useState('');
  const { logout, user } = useAdminAuth();

  useEffect(() => {
    const q = query(collection(db, 'artists'), orderBy('professional_name'));
    return onSnapshot(q, snap => {
      setArtists(snap.docs.map(d => ({ id: d.id, ...d.data() } as Artist)));
      setLoading(false);
    }, e => { setError(e.message); setLoading(false); });
  }, []);

  const visible = useMemo(() => artists.filter(a =>
    (a.professional_name || '').toLowerCase().includes(search.toLowerCase()) &&
    (category === 'All categories' || a.category === category)
  ), [artists, search, category]);

  async function togglePublish(a: Artist) {
    try { await updateDoc(doc(db, 'artists', a.id), { isPublished: !a.isPublished, updatedAt: serverTimestamp() }); }
    catch (e) { setError(e instanceof Error ? e.message : 'Update failed'); }
  }
  async function remove(a: Artist) {
    if (!window.confirm(`Permanently delete ${a.professional_name}?`)) return;
    try { await deleteDoc(doc(db, 'artists', a.id)); }
    catch (e) { setError(e instanceof Error ? e.message : 'Delete failed'); }
  }

  return <div className="min-h-screen bg-[#0b0910] text-white">
    <header className="border-b border-white/10 bg-[#110e17] px-5 py-5 md:px-9">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-[.3em] text-amber-300">ArtistManch / Admin</p><h1 className="mt-1 text-2xl font-semibold md:text-3xl">Artist Management</h1><p className="mt-1 text-xs text-white/40">Signed in as {user?.email}</p></div>
        <div className="flex gap-2"><Link to="/admin/artists/new" className="rounded-xl bg-amber-300 px-4 py-3 text-sm font-bold text-black">＋ Add artist</Link><button onClick={() => void logout()} className="rounded-xl border border-white/15 px-4 py-3 text-sm text-white/75">Log out</button></div>
      </div>
    </header>
    <main className="mx-auto max-w-7xl px-5 py-8 md:px-9">
      {error && <p className="mb-4 rounded-xl bg-red-950/40 p-3 text-sm text-red-200">{error}</p>}
      <div className="mb-7 grid gap-3 sm:grid-cols-3">
        {[['Total artists', artists.length],['Published', artists.filter(a=>a.isPublished).length],['Drafts', artists.filter(a=>!a.isPublished).length]].map(([label,value])=><div key={label} className="rounded-2xl border border-white/10 bg-[#15121b] p-5"><p className="text-sm text-white/45">{label}</p><p className="mt-2 text-3xl font-semibold text-amber-300">{value}</p></div>)}
      </div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search artist…" className="w-full rounded-xl border border-white/10 bg-[#15121b] px-4 py-3 text-sm outline-none focus:border-amber-300 sm:max-w-sm" />
        <select value={category} onChange={e=>setCategory(e.target.value)} className="rounded-xl border border-white/10 bg-[#15121b] px-4 py-3 text-sm sm:min-w-60"><option>All categories</option>{categories.map(c=><option key={c}>{c}</option>)}</select>
        <span className="self-center text-sm text-white/40">{visible.length} artists</span>
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#15121b]">
        {loading ? <p className="p-10 text-center text-white/45">Loading Firestore artists…</p> : visible.length === 0 ? <div className="p-12 text-center"><p className="text-lg">No Firestore artists yet</p><p className="mt-2 text-sm text-white/40">Your existing artists.ts catalogue remains unchanged. Add complete profiles here.</p><Link className="mt-5 inline-block rounded-xl bg-amber-300 px-4 py-3 font-semibold text-black" to="/admin/artists/new">Add your first artist</Link></div> :
        <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-white/[.03] text-xs uppercase tracking-wider text-white/40"><tr><th className="px-5 py-4">Artist</th><th className="px-5 py-4">Category</th><th className="px-5 py-4">Starting fee</th><th className="px-5 py-4">Visibility</th><th className="px-5 py-4 text-right">Actions</th></tr></thead><tbody>{visible.map(a=><tr key={a.id} className="border-t border-white/[.07]"><td className="px-5 py-4"><div className="flex items-center gap-3">{a.profile_pic?<img src={a.profile_pic} alt="" className="h-11 w-11 rounded-xl object-cover"/>:<div className="grid h-11 w-11 place-items-center rounded-xl bg-white/5 text-amber-300">{a.professional_name?.[0]||'?'}</div>}<div><p className="font-medium">{a.professional_name}</p><p className="text-xs text-white/40">{(a.languages||[]).join(', ')}</p></div></div></td><td className="px-5 py-4 text-white/60">{a.category}</td><td className="px-5 py-4 text-white/60">{money(a.starting_price)}</td><td className="px-5 py-4"><button onClick={()=>void togglePublish(a)} className={`rounded-full px-3 py-1 text-xs ${a.isPublished?'bg-emerald-400/10 text-emerald-300':'bg-white/10 text-white/50'}`}>{a.isPublished?'Published':'Draft'}</button></td><td className="px-5 py-4 text-right"><Link to={`/admin/artists/${a.id}/edit`} className="mr-4 text-amber-300">Edit</Link><button onClick={()=>void remove(a)} className="text-red-300">Delete</button></td></tr>)}</tbody></table></div>}
      </div>
    </main>
  </div>;
}
