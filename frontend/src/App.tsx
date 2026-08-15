import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ProtectedRoute   from './components/ProtectedRoute';

// Route-level code splitting: each page is fetched only when first visited,
// which keeps the initial bundle small (the build previously shipped one
// 2.3 MB chunk with every page + pdf.js + docx + html2pdf inside).
const LandingPage      = lazy(() => import('./pages/LandingPage'));
const LoginPage        = lazy(() => import('./pages/LoginPage'));
const RegisterPage     = lazy(() => import('./pages/RegisterPage'));
const DashboardPage    = lazy(() => import('./pages/DashboardPage'));
const UploadPage       = lazy(() => import('./pages/UploadPage'));
const ResumeDetailPage = lazy(() => import('./pages/ResumeDetailPage'));
const CoverLetterPage  = lazy(() => import('./pages/CoverLetterPage'));
const AboutPage        = lazy(() => import('./pages/AboutPage'));
const TemplatesPage    = lazy(() => import('./pages/TemplatesPage'));
const SettingsPage     = lazy(() => import('./pages/SettingsPage'));

function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-xs font-semibold text-text-muted animate-pulse">Loading…</div>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageFallback />}>
        <Routes location={location} key={location.pathname}>
          {/* Public routes */}
          <Route path="/"          element={<LandingPage />} />
          <Route path="/login"     element={<LoginPage />}   />
          <Route path="/register"  element={<RegisterPage />} />
          <Route path="/about"     element={<AboutPage />} />

          {/* Protected routes */}
          <Route path="/dashboard"    element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/upload"       element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
          <Route path="/resumes/:id"  element={<ProtectedRoute><ResumeDetailPage /></ProtectedRoute>} />
          <Route path="/cover-letter" element={<ProtectedRoute><CoverLetterPage /></ProtectedRoute>} />
          <Route path="/templates"    element={<ProtectedRoute><TemplatesPage /></ProtectedRoute>} />
          <Route path="/settings"     element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
