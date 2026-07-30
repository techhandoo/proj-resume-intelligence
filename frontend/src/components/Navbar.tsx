import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, UploadCloud, Info, PenTool, LogOut } from 'lucide-react';
import { getUser, clearAuth } from '../lib/auth';
import Logo from './Logo';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/upload',    label: 'Upload',    icon: <UploadCloud className="w-4 h-4" /> },
    { to: '/about',     label: 'About',     icon: <Info className="w-4 h-4" /> },
    { to: '/cover-letter', label: 'Cover Letter', icon: <PenTool className="w-4 h-4" /> },
  ];

  return (
    <nav className="fixed top-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto bg-black/80 backdrop-blur-lg border border-white/10 rounded-full px-2 py-2 flex items-center justify-between shadow-2xl shadow-black/50 w-full max-w-4xl">

        {/* Brand */}
        <Logo size="sm" href="/dashboard" />

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {navLinks.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 ${
                isActive(to)
                  ? 'text-white bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {icon}
              {label}
            </Link>
          ))}
        </div>

        {/* User Area */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[14px] font-bold text-white leading-snug tracking-tight">
              {user?.fullName || 'User Account'}
            </p>
            <p className="text-xs text-slate-500 truncate max-w-[150px] mt-0.5">
              {user?.email || 'user@proj.ai'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md ring-2 ring-white/10 flex-shrink-0">
            {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <button onClick={handleLogout} className="btn-danger btn-sm hidden sm:inline-flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
