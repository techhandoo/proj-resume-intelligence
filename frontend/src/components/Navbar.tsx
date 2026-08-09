import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Bell } from 'lucide-react';
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
