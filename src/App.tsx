import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BookingProvider } from './contexts/BookingContext';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import ProtectedRoute from './components/ProtectedRoute';

// import LandingPage from './pages/LandingPage';
// import LoginPage from './pages/LoginPage';
// import SignupPage from './pages/SignupPage';
// import BrowseArtistsPage from './pages/BrowseArtistsPage';
// import BookingWizardPage from './pages/BookingWizardPage';
// import JoinAsArtistPage from './pages/JoinAsArtistPage';
// import DashboardPage from './pages/DashboardPage';
// import EventQuoteForm from './pages/PostYourRequirement';
// import ArtistFAQPage from './pages/ArtistFAQPage.tsx';
// import ContactUsPage from './pages/ContactUsPage';



export default function App() {
  return (
    <BrowserRouter>
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
