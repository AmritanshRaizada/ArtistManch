import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ARTISTS, ARTIST_CATEGORIES } from '../data/artists';
import { useBooking } from '../contexts/BookingContext';
import type { Artist } from '../types';

export default function BrowseArtistsPage() {
  const navigate = useNavigate();
  const { setSelectedArtist } = useBooking();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Categories');

  const filteredArtists = ARTISTS.filter((artist) => {
    const matchesSearch = artist.professional_name.toLowerCase().includes(searchQuery.toLowerCase())
      || (artist.tagline || '').toLowerCase().includes(searchQuery.toLowerCase())
      || (artist.genres || []).some(g => g.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === 'All Categories' || artist.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  function handleEnquireNow(artist: Artist) {
    setSelectedArtist(artist);
    navigate('/booking');
  }

  return (
    <div className="w-full pt-28 min-h-screen bg-background">
      {/* Hero Header */}
      <section className="w-full py-10 px-4 md:px-12 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[300px] rounded-full blur-[120px] pointer-events-none -z-10" style={{ background: 'rgba(96,1,209,0.2)' }} />
        <div className="max-w-[1320px] mx-auto">
          <div className="mb-8">
            {/* <span className="font-bold text-[12px] uppercase tracking-[0.18em] text-primary block mb-2">Our Roster</span> */}
            <h1 className="font-playfair text-[36px] md:text-[56px] font-bold text-on-surface" style={{ letterSpacing: '-0.02em' }}>
              Browse <span className="italic font-normal text-primary">Artists & Singers</span>
            </h1>
            <p className="text-[18px] text-on-surface-variant mt-2 max-w-2xl leading-[28px]">
              Discover India's finest vocalists, anchors, and live performers for your celebration.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-xl mb-6">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
              <span className="material-symbols-outlined text-[22px]">search</span>
            </div>
            <input
              type="text"
              placeholder="Search by name, genre, or style..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="artist-search"
              className="w-full bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/40 pl-12 pr-4 py-4 rounded-xl text-[15px] transition-all duration-300 focus:outline-none focus:bg-surface-container focus:shadow-[0_0_0_2px_rgba(212,175,55,0.3)] border border-transparent focus:border-primary"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            )}
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {ARTIST_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                id={`category-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                className={`px-4 py-2 rounded-full font-bold text-[11px] uppercase tracking-wider shrink-0 transition-all ${
                  activeCategory === cat
                    ? 'bg-secondary-container text-on-surface border border-secondary/50'
                    : 'bg-surface-container-high hover:bg-surface-variant text-on-surface-variant'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Artists Grid */}
      <section className="w-full pb-16 px-4 md:px-12">
        <div className="max-w-[1320px] mx-auto">
          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-[13px] text-on-surface-variant">
              Showing <span className="text-primary font-bold">{filteredArtists.length}</span> artist{filteredArtists.length !== 1 ? 's' : ''}
              {activeCategory !== 'All Categories' && <span> in <span className="text-on-surface font-semibold">{activeCategory}</span></span>}
              {searchQuery && <span> for "<span className="text-on-surface font-semibold">{searchQuery}</span>"</span>}
            </p>
            <div className="flex items-center gap-2 text-on-surface-variant text-[13px]">
              <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
              <span>All artists verified</span>
            </div>
          </div>

          {filteredArtists.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-4 mx-auto text-primary">
                <span className="material-symbols-outlined text-[32px]">search_off</span>
              </div>
              <h3 className="font-playfair text-[22px] font-semibold text-on-surface mb-2">No Artists Found</h3>
              <p className="text-[15px] text-on-surface-variant mb-6">Try adjusting your search or category filter.</p>
              <button onClick={() => { setSearchQuery(''); setActiveCategory('All Categories'); }} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-bold text-[14px] rounded-xl shadow-gold transition-all">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredArtists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} onEnquire={handleEnquireNow} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ArtistCard({ artist, onEnquire }: { artist: Artist; onEnquire: (a: Artist) => void }) {
  return (
    <article className="bg-surface-container border border-outline-variant/10 rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-[0_12px_32px_-4px_rgba(124,58,237,0.14)] group flex flex-col">
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-container-high">
        <img
          src={artist.profile_pic}
          alt={artist.professional_name}
          className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
        />
        {/* Vignette */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(31,31,34,0.9) 0%, transparent 60%)' }} />
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-0.5 rounded-full bg-secondary-container/80 backdrop-blur-md text-secondary font-bold text-[11px] uppercase tracking-wider">
            {artist.category}
          </span>
        </div>
        {/* Verified Badge */}
        {artist.verified && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary font-bold text-[11px]">
              <span className="material-symbols-outlined text-[13px]">verified</span>
            </span>
          </div>
        )}
        {/* Name at bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-playfair text-[22px] font-semibold text-on-surface group-hover:text-primary transition-colors">{artist.professional_name}</h3>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="material-symbols-outlined text-primary text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="font-bold text-[13px] text-on-surface">{artist.rating}</span>
            <span className="text-[12px] text-on-surface-variant">({artist.reviews_count}+ reviews)</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Genres */}
        {artist.genres && (
          <div className="flex flex-wrap gap-1">
            {artist.genres.slice(0, 3).map((genre) => (
              <span key={genre} className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-bold text-[11px] uppercase tracking-wider">
                {genre}
              </span>
            ))}
          </div>
        )}
        {/* Starting Price */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-[11px] text-on-surface-variant uppercase tracking-wider">Starting From</p>
            <p className="font-semibold text-[18px] text-primary font-bold">₹{(artist.starting_price || 0).toLocaleString('en-IN')}</p>
          </div>
          {artist.location && (
            <div className="flex items-center gap-1 text-on-surface-variant text-[12px]">
              <span className="material-symbols-outlined text-[14px]">location_on</span>
              <span>{artist.location}</span>
            </div>
          )}
        </div>
        {/* CTA */}
        <button
          id={`enquire-${artist.slug}`}
          onClick={() => onEnquire(artist)}
          className="w-full py-3 px-4 bg-primary-container hover:bg-primary text-on-primary font-bold text-[12px] uppercase tracking-wider rounded-xl shadow-gold hover:shadow-gold-lg transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
        >
          <span>Enquire Now</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
    </article>
  );
}
