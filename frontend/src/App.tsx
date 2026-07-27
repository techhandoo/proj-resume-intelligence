import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage      from './pages/LandingPage';
import LoginPage        from './pages/LoginPage';
import RegisterPage     from './pages/RegisterPage';
import DashboardPage    from './pages/DashboardPage';
import UploadPage       from './pages/UploadPage';
import ResumeDetailPage from './pages/ResumeDetailPage';
import AboutPage        from './pages/AboutPage';
import ProtectedRoute   from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/"          element={<LandingPage />} />
        <Route path="/login"     element={<LoginPage />}   />
        <Route path="/register"  element={<RegisterPage />} />

        {/* Protected routes */}
        <Route path="/dashboard"    element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/upload"       element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
        <Route path="/about"        element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
        <Route path="/resumes/:id"  element={<ProtectedRoute><ResumeDetailPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
