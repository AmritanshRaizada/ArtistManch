
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ARTISTS, ARTIST_CATEGORIES } from '../data/artists';
import { useBooking } from '../contexts/BookingContext';
import type { Artist } from '../types';

type ArtistCardData = Artist & {
  duration?: string;
  performance_duration?: string;
  languages?: string[] | string;
  language?: string[] | string;
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

  const filteredArtists = ARTISTS.filter((artist) => {
    const query = searchQuery.trim().toLowerCase();

    const matchesSearch =
      artist.professional_name.toLowerCase().includes(query) ||
      (artist.tagline || '').toLowerCase().includes(query) ||
      (artist.genres || []).some((genre) =>
        genre.toLowerCase().includes(query)
      );

    const matchesCategory =
      activeCategory === 'All Categories' ||
      (artist.category || '').toLowerCase() ===
        activeCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  function handleBookNow(artist: Artist) {
    setSelectedArtist(artist);
    navigate('/booking');
  }

  return (
    <div className="w-full min-h-screen bg-background pt-28">
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
              Discover India's finest vocalists, anchors, and live performers
              for your celebration.
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
              placeholder="Search by name, genre, or style..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-xl border border-transparent bg-surface-container-low py-4 pl-12 pr-12 text-[15px] text-on-surface transition-all duration-300 placeholder:text-on-surface-variant/40 focus:border-primary focus:bg-surface-container focus:outline-none focus:shadow-[0_0_0_2px_rgba(212,175,55,0.3)]"
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
                id={`category-${category.replace(/\s+/g, '-').toLowerCase()}`}
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
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="text-[13px] text-on-surface-variant">
              Showing{' '}
              <span className="font-bold text-primary">
                {filteredArtists.length}
              </span>{' '}
              artist{filteredArtists.length !== 1 ? 's' : ''}

              {activeCategory !== 'All Categories' && (
                <span>
                  {' '}in{' '}
                  <span className="font-semibold text-on-surface">
                    {activeCategory}
                  </span>
                </span>
              )}

              {searchQuery && (
                <span>
                  {' '}for "
                  <span className="font-semibold text-on-surface">
                    {searchQuery}
                  </span>
                  "
                </span>
              )}
            </p>
          </div>

          {filteredArtists.length === 0 ? (
            <div className="py-20 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-container-high text-primary">
                <span className="material-symbols-outlined text-[32px]">
                  search_off
                </span>
              </div>

              <h3 className="mb-2 font-playfair text-[22px] font-semibold text-on-surface">
                No Artists Found
              </h3>

              <p className="mb-6 text-[15px] text-on-surface-variant">
                Try adjusting your search or category filter.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All Categories');
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-[14px] font-bold text-on-primary shadow-gold transition-all"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredArtists.map((artist) => (
                <ArtistCard
                  key={artist.id}
                  artist={artist as ArtistCardData}
                  onBook={handleBookNow}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ArtistCard({
  artist,
  onBook,
}: {
  artist: ArtistCardData;
  onBook: (artist: Artist) => void;
}) {
  const duration = artist.duration || artist.performance_duration;
  const languageValue = artist.languages || artist.language;

  const languages = Array.isArray(languageValue)
    ? languageValue.join(', ')
    : languageValue;

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#101016] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_16px_36px_rgba(124,58,237,0.16)]">
      {/* Artist Image - category removed from here */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#191821]">
        {artist.profile_pic ? (
          <img
            src={artist.profile_pic}
            alt={artist.professional_name}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#21172e] via-[#15141d] to-[#0c0c11] text-white/35">
            <span className="material-symbols-outlined text-5xl">
              person
            </span>
            <span className="text-xs uppercase tracking-widest">
              Artist
            </span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
      </div>

      {/* Artist Details */}
      <div className="flex flex-1 flex-col p-4">
        {/* Artist Name */}
        <h2 className="truncate font-playfair text-lg font-semibold text-white transition-colors group-hover:text-[#e7c879]">
          {artist.professional_name}
        </h2>

        {/* Category moved below the artist name */}
        <span className="mt-2 w-fit max-w-full truncate rounded-full border border-[#d6b46a]/30 bg-[#d6b46a]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#e7c879]">
          {artist.category || 'Artist'}
        </span>

        {/* Duration and Languages */}
        <div className="mt-3 flex min-h-[44px] flex-col gap-2 text-xs text-white/65">
          {duration && (
            <div className="flex min-w-0 items-center gap-2">
              <span className="material-symbols-outlined shrink-0 text-base text-[#d6b46a]">
                schedule
              </span>
              <span className="truncate">{duration}</span>
            </div>
          )}

          {languages && (
            <div className="flex min-w-0 items-center gap-2">
              <span className="material-symbols-outlined shrink-0 text-base text-[#d6b46a]">
                translate
              </span>
              <span className="truncate">{languages}</span>
            </div>
          )}
        </div>

        {/* Book Now */}
        <button
          id={`book-${artist.slug}`}
          type="button"
          onClick={() => onBook(artist)}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#ec4899] px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#d6b46a]"
        >
          Book Now
          <span className="material-symbols-outlined text-base">
            arrow_forward
          </span>
        </button>
      </div>
    </article>
  );
}
