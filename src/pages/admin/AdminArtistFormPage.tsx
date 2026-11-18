import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const categories = ['Celebrity Appearance','Comedian','Dancer/Troupe','DJ','Anchor/Emcee','Instrumentalist','Live Band','Magician','Make-up Artist/Stylist','Model','Photo/Videographer','Singer','Speaker','Variety Artist','Influencer'];
const field = 'w-full rounded-xl border border-white/10 bg-[#17131d] px-3 py-2.5 text-sm text-white outline-none focus:border-amber-300';
const initial = {
  professional_name:'', slug:'', category:'Singer', tagline:'', bio:'', short_description:'',
  profile_pic:'', location:'', languages:'', tags:'Singer, Emcee, Live Performer',
  verified:false, rating:0, reviews_count:0, starting_price:0, price_label:'starting per event',
  advance_percentage:20, coupon_code:'FESTIVE10', coupon_advance_percentage:10,
  duration:'', experience_years:0, event_types:'Weddings & Private Events, Corporate Events, Concerts & Public Shows',
  gallery:[] as string[], videos:'', whatsapp_number:'', whatsapp_message:'Hello, I would like to enquire about booking you.',
  booking_button_text:'Book artist now', booking_enabled:true, isPublished:false, isFeatured:false,
  searchLink:''
};
type FormState = typeof initial;
const slugify=(s:string)=>s.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');

export default function AdminArtistFormPage() {
  const { id } = useParams();
  const edit = Boolean(id);
  const navigate = useNavigate();
  const [form,setForm]=useState<FormState>(initial);
  const [galleryText,setGalleryText]=useState('');
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');

  useEffect(()=>{ if(!id)return; let active=true; getDoc(doc(db,'artists',id)).then(s=>{
    if(!s.exists()) { setError('Artist record not found.'); return; }
    const d=s.data();
    if(active) {
      setForm({...initial,...d, languages:Array.isArray(d.languages)?d.languages.join(', '):(d.languages||''), tags:Array.isArray(d.tags)?d.tags.join(', '):(d.tags||''), event_types:Array.isArray(d.event_types)?d.event_types.join(', '):(d.event_types||''), videos:Array.isArray(d.videos)?d.videos.join('\n'):(d.videos||''), gallery:Array.isArray(d.gallery)?d.gallery:[]});
      if (Array.isArray(d.gallery)) setGalleryText(d.gallery.join('\n'));
    }
  }).catch(e=>setError(e.message)); return ()=>{active=false;}; },[id]);

  function set<K extends keyof FormState>(key:K,value:FormState[K]) { setForm(p=>({...p,[key]:value})); }
  
  async function submit(e:FormEvent){
    e.preventDefault();setBusy(true);setError('');
    try{
      const slug=form.slug.trim()||slugify(form.professional_name);
      const gallery=galleryText.split('\n').map(u=>u.trim()).filter(Boolean);
      const payload={
        ...form,slug,gallery,
        languages:form.languages.split(',').map(x=>x.trim()).filter(Boolean),
        tags:form.tags.split(',').map(x=>x.trim()).filter(Boolean),
        event_types:form.event_types.split(',').map(x=>x.trim()).filter(Boolean),
        videos:form.videos.split('\n').map(x=>x.trim()).filter(Boolean),
        starting_price:Number(form.starting_price)||0,advance_percentage:Number(form.advance_percentage)||0,
        coupon_advance_percentage:Number(form.coupon_advance_percentage)||0,rating:Number(form.rating)||0,
        reviews_count:Number(form.reviews_count)||0,experience_years:Number(form.experience_years)||0,
        updatedAt:serverTimestamp()
      };
      if(id) await updateDoc(doc(db,'artists',id),payload);
      else await addDoc(collection(db,'artists'),{...payload,createdAt:serverTimestamp()});
      navigate('/admin');
    }catch(e){setError(e instanceof Error?e.message:'Could not save artist.');}
    finally{setBusy(false);}
  }
  const text=(key:keyof FormState,label:string,placeholder='')=><label className="block text-xs font-medium text-white/55">{label}<input className={`${field} mt-1.5`} value={String(form[key]??'')} placeholder={placeholder} onChange={e=>set(key,e.target.value as never)}/></label>;
  const number=(key:keyof FormState,label:string)=><label className="block text-xs font-medium text-white/55">{label}<input type="number" min="0" className={`${field} mt-1.5`} value={Number(form[key]??0)} onChange={e=>set(key,Number(e.target.value) as never)}/></label>;
  const area=(key:'bio'|'short_description'|'whatsapp_message',label:string,rows=4)=><label className="block text-xs font-medium text-white/55">{label}<textarea rows={rows} className={`${field} mt-1.5`} value={form[key]} onChange={e=>set(key,e.target.value)}/></label>;
  const toggle=(key:'verified'|'booking_enabled'|'isPublished'|'isFeatured',label:string)=><label className="flex items-center gap-2 text-sm text-white/75"><input type="checkbox" checked={form[key]} onChange={e=>set(key,e.target.checked)}/>{label}</label>;
  const section=(title:string,children:ReactNode)=><section className="space-y-4 rounded-2xl border border-white/10 bg-[#131019] p-5 md:p-6"><h2 className="text-sm font-bold uppercase tracking-wider text-amber-300">{title}</h2>{children}</section>;

  return <main className="min-h-screen bg-[#0b0910] px-4 py-6 text-white md:px-8">
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between"><div><Link to="/admin" className="text-sm text-amber-300">← Back to artists</Link><h1 className="mt-2 text-2xl font-semibold">{edit?'Edit artist':'Add artist profile'}</h1><p className="mt-1 text-sm text-white/40">Complete the profile fields used by the public artist detail page.</p></div></div>
      {error&&<p className="mb-4 rounded-xl bg-red-950/40 p-3 text-sm text-red-200">{error}</p>}
      <form onSubmit={submit} className="space-y-5">
        {section('01 / Basic information',<div className="grid gap-4 md:grid-cols-2">{text('professional_name','Professional artist name','Vincy Wilson')}{text('tagline','Headline / designation','LIVE SINGER & EMCEE')}<label className="block text-xs text-white/55">Category<select className={`${field} mt-1.5`} value={form.category} onChange={e=>set('category',e.target.value)}>{categories.map(c=><option key={c}>{c}</option>)}</select></label>{text('location','Location','Bengaluru, India')}{text('languages','Languages (comma separated)','English, Hindi, Kannada')}{text('tags','Profile tags (comma separated)','Singer, Emcee, Live Performer')}{text('slug','Profile URL slug','vincy-wilson')}{text('searchLink','External search / profile URL')}{text('profile_pic','Profile Image URL (Cloudinary)') }<div className="md:col-span-2">{area('short_description','Short description',2)}</div><div className="md:col-span-2">{area('bio','Full biography')}</div></div>)}
        {section('02 / Verification & ratings',<div className="grid gap-4 md:grid-cols-3">{number('rating','Rating')}{number('reviews_count','Number of reviews')}<div className="flex items-end pb-3">{toggle('verified','Verified artist')}</div></div>)}
        {section('03 / Pricing & advance payment',<div className="grid gap-4 md:grid-cols-2">{number('starting_price','Standard engagement fee (₹)')}{text('price_label','Price label','starting per event')}{number('advance_percentage','Standard advance percentage (%)')}{text('coupon_code','Coupon code','FESTIVE10')}{number('coupon_advance_percentage','Coupon advance percentage (%)')}<p className="self-center text-xs text-white/40">Advance amounts are calculated from the engagement fee on the public profile.</p></div>)}
        {section('04 / Photos & videos',<div className="space-y-4"><label className="block text-xs font-medium text-white/55">Gallery Image URLs (one per line)<textarea rows={4} className={`${field} mt-1.5`} value={galleryText} placeholder="Paste Cloudinary URLs here..." onChange={e=>setGalleryText(e.target.value)}/></label><p className="text-xs text-white/40">{galleryText.split('\n').filter(Boolean).length} gallery images entered.</p><label className="block text-xs text-white/55">Video URLs (one per line)<textarea rows={4} className={`${field} mt-1.5`} value={form.videos} onChange={e=>set('videos',e.target.value)}/></label></div>)}
        {section('05 / Performance information',<div className="grid gap-4 md:grid-cols-2">{text('duration','Performance duration','90 minutes')}{number('experience_years','Experience (years)')}<div className="md:col-span-2">{text('event_types','Event types (comma separated)','Weddings & Private Events, Corporate Events, Concerts & Public Shows')}</div></div>)}
        {section('06 / Booking & contact',<div className="grid gap-4 md:grid-cols-2">{text('whatsapp_number','WhatsApp number (with country code)','919XXXXXXXXX')}{text('booking_button_text','Booking button text','Book Vincy Wilson Now')}<div className="md:col-span-2">{area('whatsapp_message','WhatsApp enquiry message',2)}</div>{toggle('booking_enabled','Enable booking button')}</div>)}
        {section('07 / Publishing',<div className="flex flex-wrap gap-6">{toggle('isPublished','Publish profile')}{toggle('isFeatured','Featured artist')}</div>)}
        <div className="flex flex-wrap justify-end gap-3 pb-10"><Link to="/admin" className="rounded-xl border border-white/15 px-5 py-3 text-sm">Cancel</Link><button disabled={busy} className="rounded-xl bg-amber-300 px-6 py-3 text-sm font-bold text-black disabled:opacity-50">{busy?'Saving…':edit?'Save changes':'Create artist'}</button></div>
      </form>
    </div>
  </main>;
}
