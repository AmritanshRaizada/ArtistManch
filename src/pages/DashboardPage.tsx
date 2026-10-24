import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

interface BookingRecord {
  leadId: string;
  submissionKey: string;
  selectedArtistName?: string;
  selectedArtistId?: string;
  eventType: string;
  eventDate?: string;
  city: string;
  budgetLabel: string;
  advanceAmount: number;
  couponCode?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: string;
  artistType: string;
  createdAt: { toDate: () => Date };
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  enquiry_saved: { label: 'Enquiry Saved', color: 'text-primary bg-primary/10 border-primary/30', icon: 'save' },
  under_review: { label: 'Under Review', color: 'text-secondary bg-secondary-container/30 border-secondary/30', icon: 'manage_search' },
  matched: { label: 'Artist Matched', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30', icon: 'check_circle' },
  confirmed: { label: 'Confirmed', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30', icon: 'verified' },
  cancelled: { label: 'Cancelled', color: 'text-error bg-error-container/20 border-error/20', icon: 'cancel' },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);

  useEffect(() => {
    if (!user) return;
    loadBookings();
  }, [user]);

  async function loadBookings() {
    if (!user) return;
    setLoading(true);
    try {
      const leadsRef = collection(db, 'leads');
      const q = query(leadsRef, where('uid', '==', user.uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((d) => ({ ...d.data() } as BookingRecord));
      // Sort by createdAt descending
      data.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.()?.getTime() || 0;
        const bTime = b.createdAt?.toDate?.()?.getTime() || 0;
        return bTime - aTime;
      });
      setBookings(data);
    } catch (err) {
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  }

  const activeBookings = bookings.filter((b) => b.status !== 'cancelled');
  const archivedBookings = bookings.filter((b) => b.status === 'cancelled');
  const displayedBookings = activeTab === 'active' ? activeBookings : archivedBookings;

  return (
    <div className="w-full pt-20 min-h-screen bg-background">
      {/* Atmospheric Glows */}
      <div className="fixed -top-32 left-1/4 w-[600px] h-[360px] rounded-full blur-[130px] pointer-events-none -z-10" style={{ background: 'rgba(96,1,209,0.2)' }} />
      <div className="fixed top-48 right-10 w-[420px] h-[420px] rounded-full blur-[140px] pointer-events-none -z-10" style={{ background: 'rgba(212,175,55,0.1)' }} />

      <div className="max-w-[1320px] mx-auto px-6 py-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <span className="font-bold text-[11px] uppercase tracking-[0.2em] text-primary">CUSTOMER PORTAL • ENQUIRY SECURED</span>
            </div>
            <h1 className="font-playfair text-[40px] md:text-[56px] font-bold tracking-tight text-on-surface" style={{ letterSpacing: '-0.02em' }}>
              Manage <span className="italic text-primary">Bookings</span>
            </h1>
            <p className="text-[18px] text-on-surface-variant pt-1">
              Review your confirmed bookings and enquiries with verified artists.
            </p>
          </div>
          <div className="flex items-center self-start md:self-auto gap-2 px-4 py-2 bg-surface-container-high rounded-full shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            <span className="font-bold text-[14px] text-on-surface">{activeBookings.length} Active Enqu{activeBookings.length !== 1 ? 'iries' : 'iry'}</span>
            <span className="text-outline text-[14px]">•</span>
            <span className="font-bold text-[14px] text-secondary flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">lock</span>
              Data Secured
            </span>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex items-center justify-between pb-6">
          <div className="flex items-center gap-1 p-1 bg-surface-container-lowest rounded-xl">
            <button
              id="tab-active-bookings"
              onClick={() => setActiveTab('active')}
              className={`px-6 py-2 rounded-lg font-bold text-[12px] transition-all flex items-center gap-2 ${
                activeTab === 'active'
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">celebration</span>
              <span>Active ({activeBookings.length})</span>
            </button>
            <button
              id="tab-archived-bookings"
              onClick={() => setActiveTab('archived')}
              className={`px-6 py-2 rounded-lg font-bold text-[12px] transition-all flex items-center gap-2 ${
                activeTab === 'archived'
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">history_toggle_off</span>
              <span>Archived ({archivedBookings.length})</span>
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Bookings List */}
          <section className="lg:col-span-8 flex flex-col gap-6">
            {loading ? (
              <div className="flex flex-col gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-surface-container rounded-xl h-40 animate-pulse" />
                ))}
              </div>
            ) : displayedBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-10 bg-surface-container rounded-xl">
                <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-4 text-primary">
                  <span className="material-symbols-outlined text-[32px]">search_off</span>
                </div>
                <h3 className="font-playfair text-[22px] font-semibold text-on-surface mb-2">
                  {activeTab === 'active' ? 'No Active Enquiries' : 'No Archived Bookings'}
                </h3>
                <p className="text-[15px] text-on-surface-variant max-w-md mb-6">
                  {activeTab === 'active'
                    ? 'You haven\'t submitted any booking enquiries yet. Browse our artist roster to get started!'
                    : 'No cancelled or completed bookings in your history.'}
                </p>
                {activeTab === 'active' && (
                  <button
                    onClick={() => navigate('/browse')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-bold text-[14px] rounded-xl shadow-gold transition-all hover:scale-[1.02]"
                  >
                    <span className="material-symbols-outlined text-[18px]">search</span>
                    Find My Artist
                  </button>
                )}
              </div>
            ) : (
              displayedBookings.map((booking) => (
                <BookingCard key={booking.submissionKey} booking={booking} onView={() => setSelectedBooking(booking)} />
              ))
            )}

            {/* Escrow Shield */}
            {!loading && displayedBookings.length > 0 && (
              <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-secondary-container/40 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-secondary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-[12px] text-on-surface flex items-center gap-1">
                    100% ArtistManch Escrow Shield
                    <span className="material-symbols-outlined text-primary text-[14px]">shield</span>
                  </h4>
                  <p className="text-[13px] text-on-surface-variant">
                    Advances are held securely until verified artist arrival and soundcheck sign-off on event day.
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Sidebar */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            {/* Discovery Card */}
            <div className="relative overflow-hidden bg-gradient-to-b from-surface-container to-surface-container-low rounded-xl p-6 shadow-2xl">
              <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(96,1,209,0.3)' }} />
              <div className="flex items-center gap-2 text-primary mb-1">
                <span className="material-symbols-outlined text-[18px]">theater_comedy</span>
                <span className="font-bold text-[11px] uppercase tracking-widest">Curated Additions</span>
              </div>
              <h3 className="font-playfair text-[22px] font-semibold text-on-surface leading-tight">
                Complete Your Event Lineup
              </h3>
              <p className="text-[15px] text-on-surface-variant mt-2">
                Need another singer, a dhol troupe, or a celebrity host? Browse more artists now.
              </p>
              <button
                onClick={() => navigate('/browse')}
                className="mt-6 w-full py-2 px-4 bg-primary hover:bg-primary-fixed-dim text-on-primary font-bold text-[14px] rounded-xl shadow-gold transition-all flex items-center justify-center gap-2 group"
              >
                <span>Browse More Artists</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
              {/* Quick Filter Pills */}
              <div className="mt-6 pt-4 border-t border-outline-variant/20">
                <p className="font-bold text-[11px] text-on-surface-variant uppercase tracking-wider mb-2">Popular Categories</p>
                <div className="flex flex-wrap gap-2">
                  {['Singers', 'Anchors', 'Sufi Bands', 'Instrumentalists'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => navigate('/browse')}
                      className="px-2 py-1 bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-[11px] font-bold rounded-lg transition-colors"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* VIP Concierge */}
            <div className="bg-surface-container-low rounded-xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-[24px]">workspace_premium</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[18px] text-on-surface">VIP Concierge Desk</h4>
                  <p className="text-[13px] text-on-surface-variant mt-1">
                    Need custom multi-artist lineup curation? Talk to your dedicated ArtistManch VIP manager.
                  </p>
                  <a
                    href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210'}?text=Hi, I need help with my bookings on ArtistManch.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1 px-4 py-2 bg-surface-container-high hover:bg-surface-bright text-on-surface text-[12px] font-bold rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px] text-primary">chat</span>
                    <span>WhatsApp Concierge</span>
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <BookingModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
      )}
    </div>
  );
}

function BookingCard({ booking, onView }: { booking: BookingRecord; onView: () => void }) {
  const statusConfig = STATUS_CONFIG[booking.status] || STATUS_CONFIG.enquiry_saved;
  const createdDate = booking.createdAt?.toDate?.()?.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <article className="bg-surface-container rounded-xl overflow-hidden shadow-xl hover:shadow-card transition-all duration-300 group">
      {/* Top Banner */}
      <div className="bg-surface-container-lowest px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="font-bold text-[11px] text-on-surface-variant uppercase tracking-wider">Lead ID</span>
          <span className="font-bold text-[14px] text-primary tracking-wider">{booking.leadId}</span>
        </div>
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border font-bold text-[11px] ${statusConfig.color}`}>
          <span className="material-symbols-outlined text-[14px]">{statusConfig.icon}</span>
          {statusConfig.label}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-6 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-playfair text-[22px] font-semibold text-on-surface group-hover:text-primary transition-colors">
              {booking.selectedArtistName || booking.artistType}
            </h2>
            <p className="text-[13px] text-on-surface-variant">{booking.eventType}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-surface-container-lowest/60 rounded-xl">
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">event</span>
            <div>
              <p className="font-bold text-[11px] text-on-surface-variant uppercase">Event Date</p>
              <p className="font-bold text-[12px] text-on-surface">{booking.eventDate || 'TBD'}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">pin_drop</span>
            <div>
              <p className="font-bold text-[11px] text-on-surface-variant uppercase">City</p>
              <p className="font-bold text-[12px] text-on-surface">{booking.city}</p>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 bg-surface-container-high/40 p-3 rounded-xl">
          <div className="flex items-center gap-6">
            <div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-[11px] text-on-surface-variant uppercase">Advance Amount</span>
                {booking.couponCode === 'FIRST10' && (
                  <span className="px-1 py-0.5 bg-secondary-container/40 text-secondary font-bold text-[10px] rounded uppercase">FIRST10</span>
                )}
              </div>
              <p className="font-semibold text-[18px] text-primary font-bold">₹{(booking.advanceAmount || 0).toLocaleString('en-IN')}</p>
            </div>
            <div className="h-8 w-px bg-surface-container-highest" />
            <div>
              <span className="font-bold text-[11px] text-on-surface-variant uppercase">Budget</span>
              <p className="font-semibold text-[15px] text-on-surface">{booking.budgetLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              id={`view-booking-${booking.leadId}`}
              onClick={onView}
              className="flex-1 sm:flex-none px-4 py-2 bg-surface-container-highest hover:bg-surface-bright text-on-surface font-bold text-[12px] rounded-lg transition-colors flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span>View Details</span>
            </button>
          </div>
        </div>

        {/* Created date */}
        <p className="text-[12px] text-on-surface-variant">Submitted on: {createdDate}</p>
      </div>
    </article>
  );
}

function BookingModal({ booking, onClose }: { booking: BookingRecord; onClose: () => void }) {
  const statusConfig = STATUS_CONFIG[booking.status] || STATUS_CONFIG.enquiry_saved;

  return (
    <div className="fixed inset-0 z-50 bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center p-6">
      <div className="relative w-full max-w-2xl bg-surface-container rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4">
          <div>
            <span className="font-bold text-[11px] text-primary uppercase tracking-widest">Lead ID: {booking.leadId}</span>
            <h3 className="font-playfair text-[22px] font-semibold text-on-surface">
              {booking.selectedArtistName || booking.artistType} • Booking Details
            </h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-4 mt-4">
          {/* Status */}
          <div className="p-4 bg-surface-container-low rounded-xl">
            <p className="font-bold text-[11px] text-on-surface-variant uppercase mb-2">Enquiry Status</p>
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border font-bold text-[12px] ${statusConfig.color}`}>
              <span className="material-symbols-outlined text-[16px]">{statusConfig.icon}</span>
              {statusConfig.label}
            </span>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Event Type', value: booking.eventType },
              { label: 'City', value: booking.city },
              { label: 'Event Date', value: booking.eventDate || 'TBD' },
              { label: 'Artist Type', value: booking.artistType },
              { label: 'Budget', value: booking.budgetLabel },
              { label: 'Advance', value: `₹${(booking.advanceAmount || 0).toLocaleString('en-IN')}${booking.couponCode === 'FIRST10' ? ' (FIRST10)' : ''}` },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 bg-surface-container-high rounded-lg">
                <p className="font-bold text-[11px] text-on-surface-variant uppercase">{label}</p>
                <p className="font-semibold text-[14px] text-on-surface mt-1">{value}</p>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="p-4 bg-surface-container-high rounded-xl">
            <p className="font-bold text-[11px] text-on-surface-variant uppercase mb-3">Your Contact Details</p>
            <div className="space-y-2 text-[14px]">
              <p className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-[16px]">person</span> {booking.customerName}</p>
              <p className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-[16px]">mail</span> {booking.customerEmail}</p>
              <p className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-[16px]">phone</span> +91 {booking.customerPhone}</p>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 bg-surface-container-high text-on-surface font-bold text-[12px] rounded-lg">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
