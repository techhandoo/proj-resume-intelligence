import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Bell, Search, Command } from 'lucide-react';
import { getUser, clearAuth } from '../lib/auth';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  // Simple breadcrumb logic based on pathname
  const pathParts = location.pathname.split('/').filter(Boolean);
  const currentView = pathParts.length > 0 ? pathParts[pathParts.length - 1].replace('-', ' ') : 'Dashboard';

  return (
    <header className="sticky top-0 z-40 w-full h-14 flex items-center justify-between px-4 sm:px-6 bg-[#000000]/80 backdrop-blur-md border-b border-[#1f1f22]">
      {/* Left side: Breadcrumbs */}
      <div className="flex items-center gap-2">
        <span className="text-[13px] text-zinc-500 font-medium">Resumify Inc.</span>
        <span className="text-zinc-700">/</span>
        <span className="text-[13px] text-zinc-200 font-medium capitalize">{currentView}</span>
      </div>

      {/* Center/Right Side */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-48 bg-[#0a0a0a] border border-[#1f1f22] rounded-md py-1.5 pl-8 pr-3 text-[13px] text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-zinc-600">
            <Command className="w-3 h-3" />
            <span className="text-[10px] font-medium leading-none">K</span>
          </div>
        </div>

        <button className="relative text-zinc-400 hover:text-zinc-100 transition-colors">
          <Bell className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-[#1f1f22]"></div>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#171717] border border-[#1f1f22] flex items-center justify-center text-zinc-200 font-medium text-xs">
            {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="text-zinc-400 hover:text-zinc-100 transition-colors ml-2"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
