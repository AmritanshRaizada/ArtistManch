
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

type Artist = {
  id: string;
  professional_name: string;
  slug: string;
  category: string;
  tagline?: string;
  bio?: string;
  short_description?: string;
  profile_pic?: string;
  location?: string;
  languages?: string[];
  tags?: string[];
  verified?: boolean;
  rating?: number;
  reviews_count?: number;
  starting_price?: number;
  price_label?: string;
  advance_percentage?: number;
  coupon_code?: string;
  coupon_advance_percentage?: number;
  duration?: string;
  experience_years?: number;
  event_types?: string[];
  gallery?: string[];
  videos?: string[];
  whatsapp_number?: string;
  whatsapp_message?: string;
  booking_button_text?: string;
  booking_enabled?: boolean;
  isPublished?: boolean;
  isFeatured?: boolean;
  searchLink?: string;
};

type Tab = 'overview' | 'photos' | 'videos';

const money = (amount = 0) =>
  `₹${Number(amount).toLocaleString('en-IN')}`;

export default function ArtistProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchArtist() {
      if (!slug) {
        setError('Artist profile not found.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      setArtist(null);

      try {
        const artistQuery = query(
          collection(db, 'artists'),
          where('slug', '==', slug)
        );

        const snapshot = await getDocs(artistQuery);

        if (!active) return;

        if (snapshot.empty) {
          setError('We could not find this artist profile.');
          return;
        }

        const result = {
          id: snapshot.docs[0].id,
          ...snapshot.docs[0].data(),
        } as Artist;

        if (!result.isPublished) {
          setError('This artist profile is currently unavailable.');
          return;
        }

        setArtist(result);
      } catch (err) {
        console.error('Artist profile fetch failed:', err);
        if (active) {
          setError('Unable to load this artist profile. Please try again.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void fetchArtist();

    return () => {
      active = false;
    };
  }, [slug]);

  const gallery = useMemo(() => {
    if (!artist) return [];

    return Array.from(
      new Set(
        [artist.profile_pic, ...(artist.gallery || [])]
          .filter((url): url is string => Boolean(url?.trim()))
      )
    );
  }, [artist]);

  const videos = artist?.videos || [];

  const standardAdvance = Math.round(
    ((artist?.starting_price || 0) *
      (artist?.advance_percentage ?? 20)) /
      100
  );

  const couponAdvance = Math.round(
    ((artist?.starting_price || 0) *
      (artist?.coupon_advance_percentage ?? 10)) /
      100
  );

  const WHATSAPP_NUMBER = '917303195782';

  const whatsappUrl = artist
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        artist.whatsapp_message ||
          `Hello, I would like to enquire about booking ${artist.professional_name}.`
      )}`
    : '';

  function bookArtist() {
    if (!artist) return;

    navigate(
      `/artist-booking?artist=${encodeURIComponent(artist.slug)}`
    );
  }

  if (loading) {
    return (
      <main className="grid min-h-[70vh] place-items-center bg-[#09080b] text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-amber-300/20 border-t-amber-300" />
          <p className="text-sm tracking-wide text-white/50">
            Loading artist profile...
          </p>
        </div>
      </main>
    );
  }

  if (error || !artist) {
    return (
      <main className="grid min-h-[70vh] place-items-center bg-[#09080b] px-5 text-white">
        <div className="max-w-md text-center">
          <div className="mb-4 text-4xl text-amber-300">✦</div>
          <h1 className="text-2xl font-semibold">
            Artist profile unavailable
          </h1>
          <p className="mt-3 text-sm leading-6 text-white/50">
            {error || 'This artist profile could not be found.'}
          </p>
          <Link
            to="/browse"
            className="mt-7 inline-flex rounded-full bg-amber-300 px-6 py-3 text-sm font-bold text-black transition hover:bg-amber-200"
          >
            Back to Browse Artists
          </Link>
        </div>
      </main>
    );
  }

  const tags = artist.tags?.length
    ? artist.tags
    : [artist.category];

  return (
    <main className="min-h-screen overflow-hidden bg-[#09080b] pt-[120px] text-white">

      {/* BREADCRUMB */}
      <div className="mx-auto max-w-[1450px] px-5 pt-5 md:px-10 lg:px-14">
        <nav className="flex flex-wrap items-center gap-2 text-xs text-white/45 md:text-sm">
          <Link
            to="/browse"
            className="transition hover:text-amber-300"
          >
            ← Back to Browse Artists
          </Link>

          <span>/</span>
          <span>{artist.category}</span>
          <span>/</span>

          <span className="font-semibold text-amber-300">
            {artist.professional_name}
          </span>
        </nav>
      </div>

      {/* HERO */}
      <section className="mx-auto grid max-w-[1450px] gap-8 px-5 pb-8 pt-7 md:px-10 lg:grid-cols-[minmax(0,1fr)_410px] lg:gap-12 lg:px-14">

        {/* ARTIST INTRODUCTION */}
        <div className="relative flex min-h-[420px] flex-col justify-center overflow-hidden rounded-2xl lg:min-h-[440px] lg:rounded-none">

          {artist.profile_pic && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30 blur-2xl"
              style={{
                backgroundImage: `url("${artist.profile_pic}")`,
              }}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-[#09080b] via-[#09080b]/90 to-transparent" />

          <div className="relative z-10 max-w-[620px] py-8">

            <div className="mb-6 flex flex-wrap items-center gap-3">
              {artist.verified && (
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/50 bg-amber-300/10 px-3 py-2 text-xs font-semibold text-amber-200 shadow-[0_0_20px_rgba(245,190,70,0.12)]">
                  <span className="grid h-4 w-4 place-items-center rounded-full bg-amber-300 text-[10px] text-black">
                    ✓
                  </span>
                  Verified Artist
                </span>
              )}

              {Number(artist.rating) > 0 && (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/85">
                  <span className="text-amber-300">★</span>
                  {Number(artist.rating).toFixed(2)}
                  {artist.reviews_count
                    ? ` (${artist.reviews_count} reviews)`
                    : ''}
                </span>
              )}
            </div>

            <h1 className="font-serif text-5xl font-medium leading-[1.08] tracking-tight sm:text-6xl lg:text-[76px]">
              {artist.professional_name.split(' ').slice(0, -1).join(' ')}
              {' '}
              <span className="italic text-[#e9bd59]">
                {artist.professional_name.split(' ').slice(-1)}
              </span>
            </h1>

            {artist.tagline && (
              <p className="mt-5 text-sm font-medium uppercase tracking-[0.22em] text-white/80 sm:text-base">
                {artist.tagline}
              </p>
            )}

            {artist.short_description && (
              <p className="mt-6 max-w-[500px] text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
                {artist.short_description}
              </p>
            )}

            {artist.location && (
              <p className="mt-4 text-sm text-white/45">
                <span className="mr-2 text-amber-300">⌖</span>
                {artist.location}
              </p>
            )}

            <div className="mt-7 flex flex-wrap gap-2.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-white/80"
                >
                  <span className="mr-2 text-amber-300">✦</span>
                  {tag}
                </span>
              ))}
            </div>

          </div>

          {artist.profile_pic && (
            <div className="pointer-events-none absolute bottom-0 right-0 hidden h-full w-[55%] items-end justify-center lg:flex">
              <img
                src={artist.profile_pic}
                alt={artist.professional_name}
                className="max-h-full w-full object-contain object-bottom"
              />
              <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#09080b] to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#09080b] to-transparent" />
            </div>
          )}
        </div>

        {/* BOOKING CARD */}
        <aside className="h-fit rounded-[25px] border border-[#a88748]/60 bg-gradient-to-br from-[#211b16] to-[#100e0d] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] sm:p-7 lg:sticky lg:top-8">

          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#e4bd63]">
            Standard Engagement Fee
          </p>

          <div className="mt-3 flex flex-wrap items-baseline gap-2">
            <span className="font-serif text-4xl font-semibold sm:text-5xl">
              {money(artist.starting_price)}
            </span>
            <span className="text-xs text-white/55">
              / {artist.price_label || 'starting per event'}
            </span>
          </div>

          <div className="my-6 h-px bg-white/10" />

          <div className="rounded-2xl border border-[#a88748]/50 bg-black/30 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-[#e9c46b]">
              <span>♙</span>
              Lock Date with {artist.advance_percentage ?? 20}% Advance
            </p>

            <p className="mt-2 text-sm text-white/65">
              Standard Advance:{' '}
              <span className="font-semibold text-white">
                {money(standardAdvance)}
              </span>
            </p>

            {artist.coupon_code && (
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-black/65 px-3 py-3 text-xs">
                <span className="text-amber-300">
                  Use Code: <strong>{artist.coupon_code}</strong>
                </span>

                <span className="font-semibold text-white">
                  Pay {money(couponAdvance)} today
                </span>
              </div>
            )}
          </div>

          {artist.booking_enabled !== false && (
            <button
              onClick={bookArtist}
              className="mt-5 flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#f3d16c] to-[#e9af32] px-5 py-4 text-sm font-bold text-black shadow-[0_8px_30px_rgba(229,179,55,0.18)] transition hover:-translate-y-0.5 hover:brightness-110"
            >
              {artist.booking_button_text || `Book ${artist.professional_name} Now`}
              <span className="text-lg">→</span>
            </button>
          )}

          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex w-full items-center justify-center gap-3 rounded-full border border-white/10 bg-black/30 px-5 py-3.5 text-sm text-white/85 transition hover:border-emerald-400/40 hover:bg-emerald-500/5"
            >
              <span className="text-lg text-emerald-400">◉</span>
              Enquire via WhatsApp
              <span className="text-emerald-400">•</span>
              <span className="text-xs text-white/45">Instant Reply</span>
            </a>
          )}
        </aside>
      </section>

      {/* TAB NAVIGATION */}
      <section className="mx-auto max-w-[1450px] px-5 md:px-10 lg:px-14">
        <div className="flex gap-8 border-b border-white/10">
          {([
            ['overview', 'Overview'],
            ['photos', 'Photos'],
            ['videos', 'Videos'],
          ] as [Tab, string][]).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative py-5 text-sm font-medium transition ${
                activeTab === tab
                  ? 'text-[#e9bd59]'
                  : 'text-white/55 hover:text-white'
              }`}
            >
              {label}
              {activeTab === tab && (
                <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-gradient-to-r from-[#e9bd59] to-[#f3d16c]" />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* OVERVIEW */}
      {activeTab === 'overview' && (
        <section className="mx-auto max-w-[1450px] px-5 py-8 md:px-10 lg:px-14">

          <div className="grid gap-10 border-b border-white/10 pb-10 lg:grid-cols-[1fr_1.35fr] lg:items-center">

            <div>
              <h2 className="font-serif text-3xl font-semibold">
                About {artist.professional_name.split(' ')[0]}
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/65">
                {artist.bio || artist.short_description || 'Artist biography coming soon.'}
              </p>

              {artist.languages && artist.languages.length > 0 && (
                <p className="mt-5 text-sm text-white/45">
                  Languages:{' '}
                  <span className="text-white/75">
                    {artist.languages.join(', ')}
                  </span>
                </p>
              )}

              {artist.duration && (
                <p className="mt-2 text-sm text-white/45">
                  Performance duration:{' '}
                  <span className="text-white/75">{artist.duration}</span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {(artist.event_types || []).slice(0, 3).map((event, index) => (
                <div
                  key={event}
                  className="flex min-h-28 flex-col items-center justify-center border-l border-white/10 px-3 text-center"
                >
                  <span className="mb-3 text-3xl text-[#e9bd59]">
                    {['▦', '▥', '♧'][index]}
                  </span>
                  <p className="max-w-[150px] text-sm leading-5 text-white/65">
                    {event}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* PHOTOS PREVIEW */}
          {gallery.length > 0 && (
            <div className="pt-8">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-serif text-3xl font-semibold">
                  Photos
                </h2>

                <button
                  onClick={() => setActiveTab('photos')}
                  className="text-sm font-medium text-[#e9bd59] transition hover:text-amber-200"
                >
                  View All Photos →
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {gallery.slice(0, 6).map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    onClick={() => setSelectedImage(image)}
                    className="group relative aspect-[1.15/1] overflow-hidden rounded-xl border border-white/10 bg-white/5"
                  >
                    <img
                      src={image}
                      alt={`${artist.professional_name} photo ${index + 1}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/15" />
                  </button>
                ))}
              </div>
            </div>
          )}

        </section>
      )}

      {/* PHOTOS TAB */}
      {activeTab === 'photos' && (
        <section className="mx-auto max-w-[1450px] px-5 py-9 md:px-10 lg:px-14">
          <h2 className="mb-6 font-serif text-3xl font-semibold">
            Photos of {artist.professional_name}
          </h2>

          {gallery.length === 0 ? (
            <p className="text-sm text-white/45">
              No photos have been added yet.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {gallery.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  onClick={() => setSelectedImage(image)}
                  className="group aspect-[4/3] overflow-hidden rounded-2xl border border-white/10"
                >
                  <img
                    src={image}
                    alt={`${artist.professional_name} gallery ${index + 1}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {/* VIDEOS TAB */}
      {activeTab === 'videos' && (
        <section className="mx-auto max-w-[1450px] px-5 py-9 md:px-10 lg:px-14">
          <h2 className="mb-6 font-serif text-3xl font-semibold">
            Videos of {artist.professional_name}
          </h2>

          {videos.length === 0 ? (
            <p className="text-sm text-white/45">
              No performance videos have been added yet.
            </p>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {videos.map((video, index) => (
                <div
                  key={`${video}-${index}`}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
                >
                  <div className="aspect-video">
                    {video.includes('youtube.com') ||
                    video.includes('youtu.be') ? (
                      <iframe
                        src={video
                          .replace('watch?v=', 'embed/')
                          .replace('youtu.be/', 'www.youtube.com/embed/')}
                        title={`${artist.professional_name} performance ${index + 1}`}
                        allowFullScreen
                        className="h-full w-full"
                      />
                    ) : (
                      <video
                        src={video}
                        controls
                        className="h-full w-full bg-black object-contain"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* FOOTER BOOKING CTA */}
      <section className="mx-auto max-w-[1450px] px-5 pb-12 pt-6 md:px-10 lg:px-14">
        <div className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-[#a88748]/30 bg-gradient-to-r from-[#201a14] to-[#100e0d] p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
              Make your event unforgettable
            </p>
            <h2 className="mt-2 font-serif text-2xl font-semibold sm:text-3xl">
              Book {artist.professional_name}
            </h2>
            <p className="mt-2 text-sm text-white/50">
              Connect with the artist for your next event.
            </p>
          </div>

          {artist.booking_enabled !== false && (
            <button
              onClick={() => {
                navigate(
                  `/post-requirement?artist=${encodeURIComponent(artist.professional_name)}&category=${encodeURIComponent(artist.category)}`
                );
              }}
              className="shrink-0 rounded-full bg-[#edbd4e] px-7 py-4 text-sm font-bold text-black transition hover:brightness-110"
            >
              Enquire Now →
            </button>
          )}
        </div>
      </section>

      {/* IMAGE LIGHTBOX */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-5 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/10 text-2xl text-white"
            aria-label="Close image"
          >
            ×
          </button>

          <img
            src={selectedImage}
            alt={`${artist.professional_name} full size`}
            className="max-h-[85vh] max-w-full rounded-xl object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}

    </main>
  );
}
