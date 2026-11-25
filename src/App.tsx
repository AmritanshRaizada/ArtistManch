import { useEffect, useRef } from 'react';

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

// Context providers
import { AuthProvider } from './contexts/AuthContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { BookingProvider } from './contexts/BookingContext';

// Public layout components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Admin route protection
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';

// Public pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import BrowseArtistsPage from './pages/BrowseArtistsPage';
import BookingWizardPage from './pages/BookingWizardPage';
import BookingReviewPage from './pages/BookingReviewPage';
import JoinAsArtistPage from './pages/JoinAsArtistPage';
import DashboardPage from './pages/DashboardPage';
import EventQuoteForm from './pages/PostYourRequirement';
import ArtistFAQPage from './pages/ArtistFAQPage';
import ContactUsPage from './pages/ContactUsPage';
import ArtistBookingPage from './pages/ArtistBookingPage';
import ArtistProfilePage from './pages/ArtistProfilePage';

// Admin pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminArtistsPage from './pages/admin/AdminArtistsPage';
import AdminArtistFormPage from './pages/admin/AdminArtistFormPage';

// Meta Pixel type declaration
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

// Track page views whenever React Router navigation occurs
function MetaPixelTracker() {
  const location = useLocation();
  const lastTrackedPage = useRef<string | null>(null);

  useEffect(() => {
    const currentPage = location.pathname + location.search;
    if (lastTrackedPage.current === currentPage) return;
    lastTrackedPage.current = currentPage;
    window.fbq?.('track', 'PageView');
  }, [location.pathname, location.search]);

  return null;
}

// Main application layout
function AppLayout() {
  const location = useLocation();

  // Scroll to the top whenever the route changes.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  // Admin pages use their own standalone layout
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      {!isAdminRoute && <Navbar />}

      <main className="flex-1">
        <Routes>
          {/* ADMIN LOGIN */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* PROTECTED ADMIN DASHBOARD */}
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin" element={<AdminArtistsPage />} />
            <Route path="/admin/artists/new" element={<AdminArtistFormPage />} />
            <Route path="/admin/artists/:id/edit" element={<AdminArtistFormPage />} />
          </Route>

          {/* PUBLIC WEBSITE ROUTES */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/artist/:slug" element={<ArtistProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/browse" element={<BrowseArtistsPage />} />

          {/* Booking form and separate review page */}
          <Route path="/booking" element={<BookingWizardPage />} />
          <Route path="/booking-review" element={<BookingReviewPage />} />
          <Route path="/artist-booking" element={<ArtistBookingPage />} />

          <Route path="/join" element={<JoinAsArtistPage />} />
          <Route path="/post-requirement" element={<EventQuoteForm />} />
          <Route path="/artist-faq" element={<ArtistFAQPage />} />
          <Route path="/contact" element={<ContactUsPage />} />

          {/* CUSTOMER DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* CATCH-ALL FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

// Root application
export default function App() {
  return (
    <BrowserRouter>
      <MetaPixelTracker />
      <AuthProvider>
        <AdminAuthProvider>
          <BookingProvider>
            <AppLayout />
          </BookingProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
