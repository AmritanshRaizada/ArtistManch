
import { useEffect, useRef } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import { BookingProvider } from './contexts/BookingContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import BrowseArtistsPage from './pages/BrowseArtistsPage';
import BookingWizardPage from './pages/BookingWizardPage';
import JoinAsArtistPage from './pages/JoinAsArtistPage';
import DashboardPage from './pages/DashboardPage';
import EventQuoteForm from './pages/PostYourRequirement';
import ArtistFAQPage from './pages/ArtistFAQPage';
import ContactUsPage from './pages/ContactUsPage';
import ArtistBookingPage from './pages/ArtistBookingPage';

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

    // Prevent duplicate tracking, including React StrictMode effect replay
    if (lastTrackedPage.current === currentPage) return;

    lastTrackedPage.current = currentPage;

    window.fbq?.('track', 'PageView');
  }, [location.pathname, location.search]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <MetaPixelTracker />

      <AuthProvider>
        <BookingProvider>
          <div className="min-h-screen flex flex-col bg-background text-on-surface">
            <Navbar />

            <main className="flex-1">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/browse" element={<BrowseArtistsPage />} />
                <Route path="/booking" element={<BookingWizardPage />} />
                <Route path="/artist-booking" element={<ArtistBookingPage />} />
                <Route path="/join" element={<JoinAsArtistPage />} />
                <Route path="/post-requirement" element={<EventQuoteForm />} />
                <Route path="/artist-faq" element={<ArtistFAQPage />} />
                <Route path="/contact" element={<ContactUsPage />} />

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
