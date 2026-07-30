import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileUp,
  Edit3,
  BookOpen,
  LogOut,
  Cpu,
  Home,
} from 'lucide-react';
import { clearAuth, getUser } from '../lib/auth';

const navItems = [
  { to: '/',            icon: Home,            label: 'Home',         end: true },
  { to: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard',    end: true },
  { to: '/upload',      icon: FileUp,          label: 'Upload Resume', end: true },
  { to: '/cover-letter',icon: Edit3,           label: 'Cover Letter', end: true },
  { to: '/about',       icon: BookOpen,        label: 'About',        end: true },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-64 flex flex-col z-50"
      style={{
        background: '#07080d',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* ── Logo / Brand ── */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/[0.06]">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
          <Cpu className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-[13px] font-extrabold text-white tracking-tight leading-none">PROJ</p>
          <p className="text-[10px] text-slate-500 font-medium mt-0.5">Resume Intelligence</p>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <p className="text-[9.5px] font-bold text-slate-600 uppercase tracking-widest px-3 mb-3">Navigation</p>
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05] border border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                <span>{label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.8)]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── User + Logout ── */}
      <div className="px-3 pb-5 border-t border-white/[0.06] pt-4 space-y-3">
        {/* User info */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-extrabold text-sm"
            style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)' }}>
            {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-bold text-white leading-none truncate">
              {user?.fullName || 'User Account'}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5 truncate">
              {user?.email || ''}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/[0.07] border border-transparent hover:border-rose-500/20 transition-all duration-150"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
