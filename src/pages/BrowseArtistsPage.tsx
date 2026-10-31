
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

              {filteredArtists.map((artist) => (
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
                  className="group flex min-w-0 cursor-pointer flex-col rounded-2xl border border-white/10 bg-[#101016] p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_16px_36px_rgba(124,58,237,0.16)] focus:outline-none focus:ring-2 focus:ring-primary"
                >

                  {/* Artist Name */}
                  <h2 className="font-playfair text-xl font-semibold text-white transition-colors group-hover:text-[#e7c879]">
                    {artist.name}
                  </h2>

                  {/* Category */}
                  <span className="mt-3 w-fit max-w-full rounded-full border border-[#d6b46a]/30 bg-[#d6b46a]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#e7c879]">
                    {artist.category}
                  </span>

                  {/* Languages */}
                  <div className="mt-5 flex flex-1 items-start gap-2 text-xs text-white/65">

                    <span className="material-symbols-outlined shrink-0 text-base text-[#d6b46a]">
                      translate
                    </span>

                    <span className="leading-6">
                      {artist.language.length > 0
                        ? artist.language.join(', ')
                        : 'Language not specified'}
                    </span>

                  </div>

                  {/* Book Now */}
                  <button
                    id={`book-${artist.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleBookNow(artist);
                    }}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#ec4899] px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#d6b46a]"
                  >
                    Book Now

                    <span className="material-symbols-outlined text-base">
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
  );
}
