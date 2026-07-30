import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileUp,
  Edit3,
  BookOpen,
  Cpu,
  Home,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const navItems = [
  { to: '/',            icon: Home,            label: 'Home',         end: true },
  { to: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard',    end: true },
  { to: '/upload',      icon: FileUp,          label: 'Upload Resume', end: true },
  { to: '/cover-letter',icon: Edit3,           label: 'Cover Letter', end: true },
  { to: '/about',       icon: BookOpen,        label: 'About',        end: true },
];

interface SidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

export default function Sidebar({ isCollapsed, toggleCollapse }: SidebarProps) {
  return (
    <aside 
      className={`fixed inset-y-0 left-0 flex flex-col z-50 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}
      style={{
        background: '#07080d',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* ── Logo / Brand ── */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-6'} py-6 border-b border-white/[0.06] relative`}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
          <Cpu className="w-4 h-4 text-white" />
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden whitespace-nowrap transition-all duration-300">
            <p className="text-[13px] font-extrabold text-white tracking-tight leading-none">AURA AI</p>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">Resume Intelligence</p>
          </div>
        )}
      </div>

      {/* ── Toggle Button ── */}
      <button 
        onClick={toggleCollapse}
        className="absolute -right-3 top-8 bg-zinc-800 border border-zinc-700 text-slate-300 hover:text-white rounded-full p-1 z-50 shadow-md transition-colors"
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-5 space-y-2 overflow-y-auto overflow-x-hidden">
        {!isCollapsed && (
          <p className="text-[9.5px] font-bold text-slate-600 uppercase tracking-widest px-3 mb-4 transition-opacity duration-300">
            Navigation
          </p>
        )}
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={isCollapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5'} rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05] border border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                {!isCollapsed && (
                  <>
                    <span className="whitespace-nowrap">{label}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.8)]" />
                    )}
                  </>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
