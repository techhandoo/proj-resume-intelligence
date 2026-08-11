import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LandingPage      from './pages/LandingPage';
import LoginPage        from './pages/LoginPage';
import RegisterPage     from './pages/RegisterPage';
import DashboardPage    from './pages/DashboardPage';
import UploadPage       from './pages/UploadPage';
import ResumeDetailPage from './pages/ResumeDetailPage';
import CoverLetterPage  from './pages/CoverLetterPage';
import AboutPage        from './pages/AboutPage';
import TemplatesPage    from './pages/TemplatesPage';
import SettingsPage     from './pages/SettingsPage';
import ProtectedRoute   from './components/ProtectedRoute';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
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
