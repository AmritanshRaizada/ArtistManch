import { useMemo, useState } from 'react';
import {
  ARTIST_FAQ_CATEGORIES,
  ARTIST_FAQS,
  type ArtistFaqItem,
} from '../data/artistFaqData';

const GOLD = '#e2bf59';
const MUTED = '#aaa0b5';
// const PANEL = '#15111b';
const BORDER = 'rgba(255,255,255,0.10)';

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4.5 4.5" strokeLinecap="round" />
    </svg>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 180ms ease' }}>
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
      <path d="m12 2.7 2.8 5.65 6.24.91-4.52 4.4 1.07 6.21L12 16.94l-5.58 2.93 1.07-6.21-4.52-4.4 6.24-.91L12 2.7Z" />
    </svg>
  );
}

export default function ArtistFAQPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('General ArtistManch FAQs');
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const query = search.trim().toLowerCase();

  // Match meaningful words independently rather than requiring the exact phrase.
  // For example, "how to book dancer" should find
  // "How can I book a solo dancer or dance troupe on ArtistManch?"
  const searchTerms = useMemo(() => {
    const ignoredWords = new Set([
      'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'can', 'do', 'does',
      'for', 'from', 'how', 'i', 'in', 'is', 'it', 'me', 'my', 'of', 'on',
      'or', 'the', 'to', 'what', 'when', 'where', 'which', 'who', 'why',
      'with', 'you', 'your', 'want', 'need', 'looking', 'find', 'show', 'tell',
      'please', 'help', 'about', 'get', 'getting', 'would', 'could', 'should',
      'just', 'me', 'some', 'any', 'there', 'does', 'did', 'much', 'many',
    ]);
    return query
      .split(/[^a-z0-9]+/)
      .filter((term) => term.length > 0 && !ignoredWords.has(term));
  }, [query]);

  const visibleFaqs = useMemo(() => ARTIST_FAQS.filter((faq: ArtistFaqItem) => {
    if (!query) return faq.category === activeCategory;

    const searchableText = `${faq.category} ${faq.question} ${faq.answer}`.toLowerCase();
    const words = searchableText.split(/[^a-z0-9]+/).filter(Boolean);

    // Prefix matching handles simple singular/plural differences such as
    // "dancer" / "dancers" without requiring a full-text search service.
    return searchTerms.length === 0
      ? searchableText.includes(query)
      : searchTerms.every((term) =>
          searchableText.includes(term) || words.some((word) => word.startsWith(term))
        );
  }), [activeCategory, query, searchTerms]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    ARTIST_FAQ_CATEGORIES.forEach((category) => {
      counts[category] = ARTIST_FAQS.filter((faq) => faq.category === category).length;
    });
    return counts;
  }, []);

  const chooseCategory = (category: string) => {
    setActiveCategory(category);
    setOpenQuestion(null);
  };

  return (
    <main style={{ minHeight: '100vh', background: '#0b0910', color: '#f7f2fa', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        .artist-faq-page * { box-sizing: border-box; }
        .artist-faq-page button, .artist-faq-page input, .artist-faq-page select { font: inherit; }
        .artist-faq-page button { cursor: pointer; }
        .artist-faq-page .faq-category:hover { background: rgba(255,255,255,.045) !important; border-color: rgba(255,255,255,.08) !important; }
        .artist-faq-page .faq-question:hover { background: rgba(255,255,255,.025); }
        .artist-faq-page .faq-card { transition: border-color .2s ease, background .2s ease; }
        .artist-faq-page .faq-card:hover { border-color: rgba(190,145,226,.34) !important; }
        .artist-faq-page .faq-search:focus { outline: none; border-color: rgba(226,191,89,.7) !important; box-shadow: 0 0 0 3px rgba(226,191,89,.08); }
        .artist-faq-page .faq-grid { display: grid; grid-template-columns: 250px minmax(0,1fr); gap: 30px; align-items: start; }
        .artist-faq-page .faq-sidebar { position: sticky; top: 24px; }
        .artist-faq-page .faq-mobile-category { display: none; }
        @media (max-width: 850px) {
          .artist-faq-page .faq-grid { grid-template-columns: 1fr; gap: 24px; }
          .artist-faq-page .faq-sidebar { display: none; }
          .artist-faq-page .faq-mobile-category { display: block; }
          .artist-faq-page .faq-header { padding-top: 38px !important; }
        }
        @media (max-width: 540px) {
          .artist-faq-page .faq-header h1 { font-size: 35px !important; }
          .artist-faq-page .faq-content-title { font-size: 25px !important; }
          .artist-faq-page .faq-question { padding: 16px 14px !important; }
          .artist-faq-page .faq-answer { padding: 0 16px 20px !important; }
        }
      `}</style>

      <div aria-hidden="true" style={{ position: 'absolute', inset: '0 0 auto', height: 430, pointerEvents: 'none', background: 'radial-gradient(ellipse at 14% 0%, rgba(91,24,136,.22), transparent 44%), radial-gradient(ellipse at 88% 0%, rgba(212,175,55,.09), transparent 34%)' }} />

      <div className="artist-faq-page" style={{ position: 'relative', maxWidth: 1360, margin: '0 auto', padding: '0 28px 64px' }}>
        <header className="faq-header" style={{ textAlign: 'center', padding: '58px 0 28px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid rgba(226,191,89,.25)', background: 'rgba(226,191,89,.07)', borderRadius: 999, padding: '7px 13px', marginBottom: 18 }}>
            <span style={{ color: GOLD, display: 'inline-flex' }}><StarIcon /></span>
            <span style={{ color: '#e7cb7a', fontSize: 10, fontWeight: 750, letterSpacing: '.18em', textTransform: 'uppercase' }}>ArtistManch · Artist Help Centre</span>
          </div>
          <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 48, lineHeight: 1.12, letterSpacing: '-.035em', fontWeight: 600, color: '#fff', margin: 0 }}>
            Artist FAQs<span style={{ color: GOLD }}>.</span>
          </h1>
          <p style={{ color: '#b9afc3', fontSize: 15, lineHeight: 1.8, maxWidth: 620, margin: '15px auto 0' }}>
            Helpful answers for building your profile, managing enquiries, and preparing for successful bookings on ArtistManch.
          </p>
        </header>

        <div style={{ maxWidth: 760, margin: '0 auto 38px' }}>
          <label style={{ display: 'block', fontSize: 12, color: '#d5cbdc', marginBottom: 9, fontWeight: 600 }}>Search the help centre</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 17, top: '50%', transform: 'translateY(-50%)', color: '#c5a9e3', display: 'flex', pointerEvents: 'none' }}><SearchIcon /></span>
            <input
              className="faq-search"
              type="search"
              value={search}
              onChange={(event) => { setSearch(event.target.value); setOpenQuestion(null); }}
              placeholder="Try ‘profile’, ‘payments’ or ‘booking’"
              aria-label="Search artist FAQs"
              style={{ width: '100%', height: 54, borderRadius: 14, border: `1px solid ${BORDER}`, background: '#17121e', color: '#f7f2fa', padding: '0 88px 0 48px', fontSize: 14, transition: 'border-color .2s, box-shadow .2s', colorScheme: 'dark' }}
            />
            {search && <button type="button" onClick={() => { setSearch(''); setOpenQuestion(null); }} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', border: '1px solid rgba(226,191,89,.25)', background: 'rgba(226,191,89,.08)', color: '#e7cb7a', borderRadius: 9, padding: '7px 10px', fontSize: 11, fontWeight: 700 }}>Clear</button>}
          </div>
          <div style={{ color: '#887d94', textAlign: 'center', marginTop: 11, fontSize: 11, letterSpacing: '.02em' }}>
            {query ? `${visibleFaqs.length} result${visibleFaqs.length === 1 ? '' : 's'} for “${search.trim()}”` : `${ARTIST_FAQS.length} answers · ${ARTIST_FAQ_CATEGORIES.length} categories`}
          </div>
        </div>

        <div className="faq-mobile-category" style={{ marginBottom: 24 }}>
          <label htmlFor="artist-faq-category" style={{ display: 'block', marginBottom: 8, color: '#a99bb7', fontSize: 10, textTransform: 'uppercase', letterSpacing: '.16em', fontWeight: 700 }}>Browse categories</label>
          <select id="artist-faq-category" value={activeCategory} onChange={(event) => chooseCategory(event.target.value)} style={{ width: '100%', minHeight: 48, padding: '0 14px', border: '1px solid rgba(226,191,89,.25)', borderRadius: 12, color: '#f4edf8', background: '#17121e', colorScheme: 'dark', fontSize: 13 }}>
            {ARTIST_FAQ_CATEGORIES.map((category) => <option key={category} value={category}>{category} ({categoryCounts[category]})</option>)}
          </select>
        </div>

        <div className="faq-grid">
          <aside className="faq-sidebar" aria-label="FAQ categories" style={{ border: `1px solid ${BORDER}`, borderRadius: 18, background: 'rgba(21,17,27,.9)', padding: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 8px 13px' }}>
              <span style={{ color: '#a89bb4', fontSize: 10, fontWeight: 750, letterSpacing: '.17em', textTransform: 'uppercase' }}>Categories</span>
              <span style={{ color: '#d8bd6c', background: 'rgba(226,191,89,.08)', borderRadius: 6, padding: '4px 7px', fontSize: 10 }}>{ARTIST_FAQ_CATEGORIES.length}</span>
            </div>
            <nav style={{ display: 'grid', gap: 4 }}>
              {ARTIST_FAQ_CATEGORIES.map((category) => {
                const selected = activeCategory === category && !query;
                return (
                  <button key={category} type="button" className="faq-category" onClick={() => chooseCategory(category)} aria-pressed={selected}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', minHeight: 42, padding: '7px 9px', textAlign: 'left', borderRadius: 10, border: selected ? '1px solid rgba(226,191,89,.24)' : '1px solid transparent', background: selected ? 'linear-gradient(100deg, rgba(226,191,89,.12), rgba(105,48,139,.12))' : 'transparent', color: selected ? '#fff' : '#bcb2c7', boxShadow: selected ? 'inset 2px 0 0 #e2bf59' : 'none', transition: 'all .18s' }}>
                    <span style={{ color: selected ? GOLD : '#89729e', display: 'flex', flexShrink: 0 }}><StarIcon /></span>
                    <span style={{ flex: 1, minWidth: 0, fontSize: 12, lineHeight: 1.4 }}>{category}</span>
                    <span style={{ fontSize: 10, color: selected ? '#e7cb7a' : '#766a82', fontVariantNumeric: 'tabular-nums' }}>{categoryCounts[category]}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <section style={{ minWidth: 0 }} aria-live="polite">
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, padding: '2px 0 17px', marginBottom: 18, borderBottom: `1px solid ${BORDER}` }}>
              <div>
                <div style={{ color: '#c5a5e2', fontSize: 10, fontWeight: 750, letterSpacing: '.17em', textTransform: 'uppercase', marginBottom: 7 }}>{query ? 'Search results' : 'Frequently asked questions'}</div>
                <h2 className="faq-content-title" style={{ fontFamily: 'Playfair Display, Georgia, serif', color: '#fff', fontSize: 30, fontWeight: 600, lineHeight: 1.2, margin: 0 }}>{query ? 'Here’s what we found' : activeCategory}</h2>
                <p style={{ color: '#8f839c', fontSize: 12, margin: '8px 0 0' }}>{visibleFaqs.length} question{visibleFaqs.length === 1 ? '' : 's'} {query ? 'match your search' : 'in this category'}</p>
              </div>
              <div className="faq-guide-label" style={{ flexShrink: 0, border: '1px solid rgba(226,191,89,.18)', borderRadius: 999, color: '#d8bd6c', background: 'rgba(226,191,89,.045)', padding: '8px 11px', fontSize: 9, fontWeight: 750, letterSpacing: '.12em', textTransform: 'uppercase' }}>Artist guide</div>
            </div>

            {visibleFaqs.length ? <div style={{ display: 'grid', gap: 10 }}>
              {visibleFaqs.map((faq, index) => {
                const key = `${faq.category}-${faq.question}`;
                const isOpen = openQuestion === key;
                return (
                  <article key={key} className="faq-card" style={{ border: isOpen ? '1px solid rgba(226,191,89,.32)' : `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden', background: isOpen ? 'linear-gradient(125deg, #1c1624, #15111b)' : '#121019', boxShadow: isOpen ? '0 12px 30px rgba(0,0,0,.16)' : 'none' }}>
                    <button type="button" className="faq-question" aria-expanded={isOpen} onClick={() => setOpenQuestion(isOpen ? null : key)} style={{ display: 'flex', alignItems: 'center', gap: 13, width: '100%', border: 0, background: 'transparent', color: '#e9e2ee', textAlign: 'left', padding: '18px 19px', minHeight: 66 }}>
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 29, height: 29, flexShrink: 0, borderRadius: 8, background: isOpen ? 'rgba(226,191,89,.10)' : 'rgba(255,255,255,.035)', color: isOpen ? GOLD : '#85798f', fontSize: 10, fontWeight: 750, fontVariantNumeric: 'tabular-nums' }}>{String(index + 1).padStart(2, '0')}</span>
                      <span style={{ flex: 1, fontSize: 13, lineHeight: 1.65, fontWeight: 600 }}>{faq.question}</span>
                      <span style={{ width: 31, height: 31, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, borderRadius: '50%', border: isOpen ? '1px solid rgba(226,191,89,.3)' : '1px solid rgba(255,255,255,.12)', background: isOpen ? 'rgba(226,191,89,.08)' : 'transparent', color: isOpen ? GOLD : '#9b8fa7' }}><Chevron open={isOpen} /></span>
                    </button>
                    {isOpen && <div className="faq-answer" style={{ padding: '0 64px 23px' }}>
                      <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(226,191,89,.45), rgba(161,107,199,.18), transparent)', marginBottom: 16 }} />
                      <p style={{ color: '#bcb1c7', fontSize: 13, lineHeight: 1.9, margin: 0 }}>{faq.answer}</p>
                    </div>}
                  </article>
                );
              })}
            </div> : <div style={{ border: '1px dashed rgba(161,107,199,.35)', borderRadius: 16, background: '#15111b', textAlign: 'center', padding: '54px 24px' }}>
              <div style={{ color: GOLD, display: 'flex', justifyContent: 'center', marginBottom: 14 }}><SearchIcon /></div>
              <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 23, color: '#fff', margin: 0 }}>No answers found</h3>
              <p style={{ color: MUTED, fontSize: 13, lineHeight: 1.7, maxWidth: 370, margin: '10px auto 20px' }}>Try another keyword, or return to the general FAQs to browse all the basics.</p>
              <button type="button" onClick={() => { setSearch(''); chooseCategory('General ArtistManch FAQs'); }} style={{ border: '1px solid rgba(226,191,89,.3)', borderRadius: 10, background: 'rgba(226,191,89,.09)', color: '#e7cb7a', padding: '10px 14px', fontSize: 12, fontWeight: 700 }}>View general FAQs</button>
            </div>}
          </section>
        </div>

        <footer style={{ marginTop: 38, border: `1px solid ${BORDER}`, borderRadius: 16, background: 'rgba(21,17,27,.72)', padding: '19px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
          <div>
            <div style={{ color: '#eee6f4', fontSize: 13, fontWeight: 700 }}>Still have questions?</div>
            <p style={{ color: '#91859d', fontSize: 11, lineHeight: 1.7, margin: '5px 0 0' }}>Confirm availability, fees, and booking terms with the artist before finalising an event.</p>
          </div>
          <div style={{ color: GOLD, display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 10, fontWeight: 750, letterSpacing: '.14em', textTransform: 'uppercase' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: GOLD, boxShadow: '0 0 10px rgba(226,191,89,.5)' }} />Made for artists</div>
        </footer>
      </div>
    </main>
  );
}
