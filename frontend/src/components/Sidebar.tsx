import { NavLink, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  
  return (
    <aside 
      className={`fixed top-0 bottom-0 left-0 flex flex-col z-50 bg-white/[0.02] backdrop-blur-2xl border-r border-white/[0.08] ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
      style={{
        transition: 'width 300ms var(--ease-drawer)'
      }}
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
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 flex flex-col gap-1.5">
        {!isCollapsed && (
          <div className="px-1 mb-2">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
              Main Menu
            </p>
          </div>
        )}
        
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              title={isCollapsed ? label : undefined}
              className={`
                group relative flex items-center ${isCollapsed ? 'justify-center p-2.5 mx-0.5' : 'gap-3.5 px-3 py-2.5'} rounded-xl transition-[background-color,color,transform] duration-200 ease-out active:scale-[0.96]
                ${isActive 
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_12px_rgba(59,130,246,0.1)]' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04] border border-transparent'}
              `}
            >
              <Icon className={`w-[20px] h-[20px] flex-shrink-0 transition-colors ${isActive ? 'text-blue-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
              
              {!isCollapsed && (
                <span className="text-[13.5px] font-semibold truncate">
                  {label}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ── Bottom Toggle Area ── */}
      <div className="p-3 border-t border-white/[0.05]">
        <button
          onClick={toggleCollapse}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          className={`flex items-center w-full rounded-xl transition-[background-color,color,transform] duration-200 ease-out active:scale-[0.96] text-zinc-400 hover:text-white hover:bg-white/[0.04] border border-transparent ${
            isCollapsed ? 'justify-center p-2.5' : 'gap-3.5 px-3 py-2.5'
          }`}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-[20px] h-[20px]" />
          ) : (
            <>
              <PanelLeftClose className="w-[20px] h-[20px]" />
              <span className="text-[13.5px] font-semibold truncate">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
