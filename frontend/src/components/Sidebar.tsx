import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileUp,
  Edit3,
  BookOpen,
  Cpu,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

const navItems = [
  { to: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/upload',      icon: FileUp,          label: 'Upload Resume' },
  { to: '/cover-letter',icon: Edit3,           label: 'Cover Letter' },
  { to: '/about',       icon: BookOpen,        label: 'About' },
];

interface SidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

export default function Sidebar({ isCollapsed, toggleCollapse }: SidebarProps) {
  return (
    <aside 
      className={`fixed top-4 bottom-4 left-10 flex flex-col z-50 transition-all duration-300 ease-in-out bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] rounded-2xl ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* ── Logo Area ── */}
      <div className={`flex items-center h-16 flex-shrink-0 ${isCollapsed ? 'justify-center' : 'px-5 gap-3'}`}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-900/20">
          <Cpu className="w-4 h-4 text-white" />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col min-w-0 overflow-hidden">
            <span className="text-[14px] font-bold text-white tracking-tight leading-none truncate">
              Resumify AI
            </span>
            <span className="text-[10px] text-zinc-500 font-medium truncate mt-0.5">
              Workspace
            </span>
          </div>
        )}
      </div>

      {/* ── Navigation Links ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 flex flex-col gap-1 px-2">
        {!isCollapsed && (
          <div className="px-3 mb-2 mt-2">
            <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
              Main Menu
            </p>
          </div>
        )}
        
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            title={isCollapsed ? label : undefined}
            className={({ isActive }) =>
              `group relative flex items-center ${isCollapsed ? 'justify-center p-2 mx-1' : 'gap-3 px-3 py-2'} rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-white/[0.06] text-white' 
                  : 'text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active Indicator Line (Left Edge) */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-blue-500 rounded-r-full shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                )}
                
                <Icon className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${isActive ? 'text-blue-400' : 'text-zinc-400 group-hover:text-zinc-300'}`} />
                
                {!isCollapsed && (
                  <span className="text-[13px] font-medium truncate">
                    {label}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Bottom Toggle Area ── */}
      <div className="p-2 border-t border-white/[0.08]">
        <button
          onClick={toggleCollapse}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          className={`flex items-center w-full rounded-lg transition-colors text-zinc-400 hover:text-white hover:bg-white/[0.04] ${
            isCollapsed ? 'justify-center p-2' : 'gap-3 px-3 py-2'
          }`}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-[18px] h-[18px]" />
          ) : (
            <>
              <PanelLeftClose className="w-[18px] h-[18px]" />
              <span className="text-[13px] font-medium truncate">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
