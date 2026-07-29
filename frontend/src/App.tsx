import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './App.css';
import LandingPage      from './pages/LandingPage';
import LoginPage        from './pages/LoginPage';
import RegisterPage     from './pages/RegisterPage';
import DashboardPage    from './pages/DashboardPage';
import UploadPage       from './pages/UploadPage';
import ResumeDetailPage from './pages/ResumeDetailPage';
import CoverLetterPage  from './pages/CoverLetterPage';
import AboutPage        from './pages/AboutPage';
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

        {/* Protected routes */}
        <Route path="/dashboard"    element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/upload"       element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
        <Route path="/about"        element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
        <Route path="/resumes/:id"  element={<ProtectedRoute><ResumeDetailPage /></ProtectedRoute>} />
        <Route path="/cover-letter" element={<ProtectedRoute><CoverLetterPage /></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
}

import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
