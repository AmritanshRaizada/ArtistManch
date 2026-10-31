
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ARTISTS, ARTIST_CATEGORIES } from '../data/artists';
import { useBooking } from '../contexts/BookingContext';
import type { Artist } from '../types';

type ArtistData = {
  name: string;
  category: string;
  language: readonly string[];
  searchLink: string;
};

export default function BrowseArtistsPage() {
  const navigate = useNavigate();
  const { setSelectedArtist } = useBooking();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams] = useSearchParams();

  const [activeCategory, setActiveCategory] = useState(
    searchParams.get('category') || 'All Categories'
  );

  useEffect(() => {
    const category = searchParams.get('category');

    if (!category) {
      setActiveCategory('All Categories');
      return;
    }

    const matchedCategory = ARTIST_CATEGORIES.find(
      (item) => item.toLowerCase() === category.toLowerCase()
    );

    setActiveCategory(matchedCategory || 'All Categories');
  }, [searchParams]);

  // Search and filter artists
  const filteredArtists = ARTISTS.filter((artist) => {
    const query = searchQuery.trim().toLowerCase();

    const matchesSearch =
      artist.name.toLowerCase().includes(query) ||
      artist.category.toLowerCase().includes(query) ||
      artist.language.some((lang) =>
        lang.toLowerCase().includes(query)
      );

    const matchesCategory =
      activeCategory === 'All Categories' ||
      artist.category.toLowerCase() === activeCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Open artist search link
  function handleCardClick(searchLink: string) {
    window.open(searchLink, '_blank', 'noopener,noreferrer');
  }

  // Book artist using existing booking flow
  function handleBookNow(artist: ArtistData) {
    const slug = artist.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const bookingArtist = {
      ...artist,
      id: slug,
      slug,
      professional_name: artist.name,
      languages: artist.language,
    } as unknown as Artist;

    setSelectedArtist(bookingArtist);
    navigate('/artist-booking');
  }

  return (
    <div className="relative isolate w-full min-h-screen overflow-hidden bg-background pt-28">
      <style>{`
        @keyframes artistmanch-gold-flow {
          0% { transform: translate3d(-1.5%, 0, 0) rotate(-1deg); }
          50% { transform: translate3d(1.5%, 1%, 0) rotate(1deg); }
          100% { transform: translate3d(-1.5%, 0, 0) rotate(-1deg); }
        }

        .artistmanch-gold-ribbons {
          animation: artistmanch-gold-flow 36s ease-in-out infinite;
          transform-origin: center;
        }

        @media (prefers-reduced-motion: reduce) {
          .artistmanch-gold-ribbons {
            animation: none;
          }
        }
      `}</style>

      {/* Decorative gold ribbons and ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div className="absolute -left-40 top-24 h-[420px] w-[420px] rounded-full bg-[#d6b46a]/[0.055] blur-[120px]" />
        <div className="absolute -right-40 top-[38%] h-[480px] w-[480px] rounded-full bg-[#8b5cf6]/[0.07] blur-[140px]" />
        <div className="absolute bottom-0 left-1/3 h-[360px] w-[520px] rounded-full bg-[#d6b46a]/[0.045] blur-[130px]" />

        <svg
          className="artistmanch-gold-ribbons absolute inset-0 h-full min-h-full w-full opacity-45"
          viewBox="0 0 1440 1200"
          preserveAspectRatio="xMidYMin slice"
          fill="none"
        >
          <defs>
            <linearGradient id="artistmanch-gold-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8F6826" stopOpacity="0.12" />
              <stop offset="45%" stopColor="#D6B46A" stopOpacity="0.72" />
              <stop offset="100%" stopColor="#F5CF65" stopOpacity="0.16" />
            </linearGradient>
          </defs>
          <path d="M-180 250 C180 40 360 520 720 300 S1190 80 1620 340" stroke="url(#artistmanch-gold-gradient)" strokeWidth="1.6" />
          <path d="M-160 285 C190 75 390 555 745 335 S1210 115 1640 375" stroke="url(#artistmanch-gold-gradient)" strokeWidth="0.8" />
          <path d="M-220 820 C160 600 420 1040 790 820 S1250 610 1660 900" stroke="url(#artistmanch-gold-gradient)" strokeWidth="1.4" />
          <path d="M-200 855 C180 635 440 1075 810 855 S1270 645 1680 935" stroke="url(#artistmanch-gold-gradient)" strokeWidth="0.7" />
          <path d="M220 -120 C420 180 160 420 430 650 S760 990 610 1320" stroke="url(#artistmanch-gold-gradient)" strokeWidth="0.9" />
          <path d="M1120 -140 C920 160 1190 420 930 670 S700 1010 850 1340" stroke="url(#artistmanch-gold-gradient)" strokeWidth="1.1" />
        </svg>
      </div>

      <div className="relative z-10">

      {/* Hero Header */}
      <section className="relative w-full overflow-hidden px-4 py-10 md:px-12">

        <div
          className="pointer-events-none absolute left-1/4 top-0 -z-10 h-[300px] w-[500px] rounded-full blur-[120px]"
          style={{ background: 'rgba(96,1,209,0.2)' }}
        />

        <div className="mx-auto max-w-[1440px]">

          <div className="mb-8">
            <h1
              className="font-playfair text-[36px] font-bold text-on-surface md:text-[56px]"
              style={{ letterSpacing: '-0.02em' }}
            >
              Browse{' '}
              <span className="font-normal italic text-primary">
                Artists &amp; Singers
              </span>
            </h1>

            <p className="mt-2 max-w-2xl text-[16px] leading-7 text-on-surface-variant sm:text-[18px]">
              Discover talented artists and performers for your celebration.
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-6 max-w-xl">

            <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[22px] text-on-surface-variant">
              search
            </span>

            <input
              id="artist-search"
              type="text"
              placeholder="Search by artist name, category, or language..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-xl border border-transparent bg-surface-container-low py-4 pl-12 pr-12 text-[15px] text-on-surface placeholder:text-on-surface-variant/40 focus:border-primary focus:outline-none"
            />

            {searchQuery && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">
                  close
                </span>
              </button>
            )}

          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">

            {ARTIST_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-all ${
                  activeCategory === category
                    ? 'border-secondary/50 bg-secondary-container text-on-surface'
                    : 'border-transparent bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'
                }`}
              >
                {category}
              </button>
            ))}

          </div>
        </div>
      </section>

      {/* Artists Grid */}
      <section className="w-full px-4 pb-16 md:px-12">
        <div className="mx-auto max-w-[1440px]">

          <div className="mb-4">
            <p className="text-[13px] text-on-surface-variant">
              Showing{' '}
              <span className="font-bold text-primary">
                {filteredArtists.length}
              </span>{' '}
              artists
              {activeCategory !== 'All Categories' && (
                <>
                  {' '}in{' '}
                  <span className="font-semibold text-on-surface">
                    {activeCategory}
                  </span>
                </>
              )}
            </p>
          </div>

          {/* No Artists Found */}
          {filteredArtists.length === 0 ? (

            <div className="mx-auto mt-3 max-w-4xl rounded-2xl border border-[#d6b46a]/30 bg-gradient-to-r from-[#211a29] via-[#191521] to-[#17121b] px-5 py-5 shadow-[0_12px_40px_rgba(0,0,0,0.2)] md:px-7 md:py-6">

              <div className="flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">

                <div className="min-w-0 flex-1">

                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#d6b46a]">
                    LET US HELP YOU FIND THE RIGHT TALENT
                  </p>

                  <h3 className="mt-2 font-playfair text-xl font-semibold text-white md:text-2xl">
                    Didn't find your desired artist?
                  </h3>

                  <p className="mt-2 max-w-xl text-xs leading-5 text-white/55 md:text-sm">
                    Tell us who you're looking for. Our team will help you find
                    the perfect artist for your celebration.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() => navigate('/post-requirement')}
                  className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f5cf65] to-[#e6a7c7] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#17121a] shadow-lg transition-all hover:-translate-y-0.5 hover:brightness-110 sm:w-auto"
                >
                  Post Your Requirement

                  <span className="material-symbols-outlined text-lg">
                    arrow_forward
                  </span>
                </button>

              </div>

              <div className="mt-4 flex justify-center border-t border-white/10 pt-3 sm:justify-start">
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('All Categories');
                  }}
                  className="text-xs font-semibold text-white/40 transition hover:text-[#e7c879]"
                >
                  Clear Search &amp; Filters
                </button>
              </div>

            </div>

          ) : (

            /* Artists Grid */
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {filteredArtists.map((artist, index) => (
                <article
                  key={artist.searchLink}
                  role="link"
                  tabIndex={0}
                  aria-label={`View search results for ${artist.name}`}
                  onClick={() => handleCardClick(artist.searchLink)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleCardClick(artist.searchLink);
                    }
                  }}
                  className="group relative flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-[26px] border border-white/[0.09] bg-[linear-gradient(145deg,rgba(35,29,43,0.96),rgba(15,14,21,0.98)_58%)] p-5 shadow-[0_14px_38px_rgba(0,0,0,0.22)] transition-all duration-500 hover:-translate-y-2 hover:border-[#d6b46a]/45 hover:shadow-[0_24px_55px_rgba(0,0,0,0.38),0_0_28px_rgba(214,180,106,0.09)] focus:outline-none focus:ring-2 focus:ring-[#d6b46a]"
                >
                  {/* Soft metallic accent */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e7c879]/70 to-transparent opacity-60" />
                  <div className="pointer-events-none absolute -right-14 -top-16 h-40 w-40 rounded-full bg-[#d6b46a]/[0.07] blur-3xl transition-all duration-500 group-hover:bg-[#d6b46a]/[0.13]" />

                  <div className="relative flex items-start justify-between gap-3">
                    <span className="font-playfair text-[11px] tracking-[0.22em] text-[#d6b46a]/55">
                      ARTIST <span className="text-white/20">/</span> {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="material-symbols-outlined text-[18px] text-white/25 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[#e7c879]">
                      north_east
                    </span>
                  </div>

                  {/* Artist name */}
                  <h2 className="relative mt-5 min-h-[3.5rem] break-words font-playfair text-[23px] font-semibold leading-[1.2] tracking-[-0.025em] text-white transition-colors duration-300 group-hover:text-[#f0d58e]">
                    {artist.name}
                  </h2>

                  {/* Category */}
                  <div className="relative mt-4">
                    <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#d6b46a]/25 bg-[#d6b46a]/[0.08] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#e7c879]">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#e7c879] shadow-[0_0_8px_rgba(231,200,121,0.7)]" />
                      <span className="truncate">{artist.category}</span>
                    </span>
                  </div>

                  {/* Languages */}
                  <div className="relative mt-6 flex min-h-[58px] items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.035] px-3.5 py-3">
                    <span className="material-symbols-outlined flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#d6b46a]/[0.10] text-[18px] text-[#e7c879]">
                      translate
                    </span>
                    <div className="min-w-0">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/35">
                        Languages
                      </p>
                      <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-white/75">
                        {artist.language.length > 0
                          ? artist.language.join(' · ')
                          : 'English, Hindi'}
                      </p>
                    </div>
                  </div>

                  {/* Book Now */}
                  <button
                    id={`book-${artist.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleBookNow(artist);
                    }}
                    className="relative mt-5 inline-flex w-full items-center justify-between rounded-2xl border border-[#f5cf65]/30 bg-gradient-to-r from-[#d99a32] via-[#e9a34b] to-[#d95b8e] px-4 py-3.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#17121a] shadow-[0_8px_22px_rgba(217,154,50,0.14)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_10px_28px_rgba(217,154,50,0.25)] focus:outline-none focus:ring-2 focus:ring-[#d6b46a] focus:ring-offset-2 focus:ring-offset-[#17141d]"
                  >
                    <span>Book this artist</span>
                    <span className="material-symbols-outlined flex h-7 w-7 items-center justify-center rounded-full bg-black/10 text-[18px] transition-transform duration-300 group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </button>
                </article>
              ))}

            </div>
          )}

        </div>
      </section>
      </div>
    </div>
  );
}
