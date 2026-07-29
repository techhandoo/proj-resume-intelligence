import { Link, useNavigate, useLocation } from 'react-router-dom';
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
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/upload',    label: 'Upload'    },
    { to: '/about',     label: 'About'     },
    { to: '/cover-letter', label: 'Cover Letter' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#05091a]/92 backdrop-blur-2xl">
      <div className="max-w-[1440px] mx-auto px-8 sm:px-14 flex items-center justify-between h-[68px]">

        {/* Brand */}
        <Logo size="sm" href="/dashboard" />

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 ${
                isActive(to)
                  ? 'text-white bg-blue-500/15 border border-blue-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent'
              }`}
            >
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
          <button onClick={handleLogout} className="btn-danger btn-sm hidden sm:inline-flex">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
