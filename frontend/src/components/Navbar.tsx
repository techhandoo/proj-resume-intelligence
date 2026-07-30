import { useNavigate } from 'react-router-dom';
import { LogOut, Bell, Search } from 'lucide-react';
import { getUser, clearAuth } from '../lib/auth';

export default function Navbar() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 w-full px-6 py-4 flex items-center justify-between pointer-events-auto bg-[#030712]/80 backdrop-blur-xl border-b border-white/[0.04]">
      {/* Search / Left Side */}
      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search resumes, templates..." 
            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-full py-2 pl-10 pr-4 text-sm text-slate-300 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all"
          />
        </div>
      </div>

      {/* Right Side / User Profile */}
      <div className="flex items-center gap-4">
        
        {/* Notification Bell */}
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#030712]"></span>
        </button>

        {/* Separator */}
        <div className="h-6 w-px bg-white/[0.1]"></div>

        {/* User Info */}
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-[13px] font-bold text-white leading-none">
              {user?.fullName || 'User Account'}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              {user?.email || 'user@aura.ai'}
            </p>
          </div>
          
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0 border border-white/10"
            style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)' }}>
            {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </div>

          <button
            onClick={handleLogout}
            title="Logout"
            className="ml-1 p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}
