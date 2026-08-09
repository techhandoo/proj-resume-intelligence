import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LogOut, Bell, Search, Command, ChevronRight, User, Settings, CheckCircle2 } from 'lucide-react';
import { getUser, clearAuth } from '../lib/auth';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  // Breadcrumb items calculation
  const pathParts = location.pathname.split('/').filter(Boolean);
  const breadcrumbText = pathParts.length > 0 
    ? pathParts[pathParts.length - 1].replace('-', ' ') 
    : 'Overview';

  return (
    <header className="sticky top-0 z-40 w-full h-16 flex items-center justify-between px-6 bg-[#030304]/80 backdrop-blur-xl border-b border-[#1c1c21]">
      
      {/* ── Left: Breadcrumb Navigation ── */}
      <div className="flex items-center gap-2 text-sm select-none">
        <Link to="/dashboard" className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors font-medium text-[13px]">
          <Command className="w-3.5 h-3.5 text-blue-400" />
          <span>Resumify</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span className="text-zinc-200 font-semibold text-[13px] capitalize truncate max-w-[200px] sm:max-w-xs">
          {breadcrumbText}
        </span>
      </div>

      {/* ── Center: Command Palette / Search Launcher ── */}
      <div className="hidden md:flex items-center">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-[#0c0c10] border border-[#1c1c21] text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-all text-xs w-64 justify-between cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-zinc-500" />
            <span>Search workspace...</span>
          </span>
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[10px] font-mono text-zinc-400">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* ── Right Controls ── */}
      <div className="flex items-center gap-3">
        
        {/* Notifications Button & Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-[#121215] transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-[#030304]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 glass-card p-4 z-50 shadow-2xl animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-[#1c1c21] mb-3">
                <span className="text-xs font-bold text-white">Notifications</span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">All Systems Normal</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-zinc-200 font-medium">Groq AI Engine v2.4 Active</p>
                    <span className="text-[10px] text-zinc-500">2 minutes ago</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-zinc-200 font-medium">ATS Scoring Algorithms Updated</p>
                    <span className="text-[10px] text-zinc-500">1 hour ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-[#1c1c21]" />

        {/* User Profile Menu */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-[#121215] transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span className="hidden sm:inline text-xs font-semibold text-zinc-200 max-w-[100px] truncate">
              {user?.fullName?.split(' ')[0] || 'User'}
            </span>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 glass-card p-2 z-50 shadow-2xl flex flex-col gap-1">
              <div className="px-3 py-2 border-b border-[#1c1c21] mb-1">
                <p className="text-xs font-semibold text-white truncate">{user?.fullName || 'Enterprise User'}</p>
                <p className="text-[11px] text-zinc-500 truncate">{user?.email || 'user@workspace.com'}</p>
              </div>

              <Link 
                to="/settings" 
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-[#121215] rounded-lg transition-colors"
              >
                <User className="w-3.5 h-3.5 text-zinc-400" /> Profile & Account
              </Link>
              <Link 
                to="/settings" 
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-[#121215] rounded-lg transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-zinc-400" /> Preferences
              </Link>

              <div className="h-px bg-[#1c1c21] my-1" />

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-1.5 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}

