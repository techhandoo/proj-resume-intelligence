import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileUp,
  Settings,
  BookOpen,
  Command,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

const navItems = [
  { to: '/dashboard',   icon: LayoutDashboard, label: 'Overview' },
  { to: '/upload',      icon: FileUp,          label: 'Upload' },
  { to: '/about',       icon: BookOpen,        label: 'Documentation' },
];

interface SidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

export default function Sidebar({ isCollapsed, toggleCollapse }: SidebarProps) {
  const location = useLocation();
  
  return (
    <aside 
      className={`fixed top-0 bottom-0 left-0 flex flex-col z-50 bg-[#0a0a0a] border-r border-[#1f1f22] ${
        isCollapsed ? 'w-16' : 'w-56'
      }`}
      style={{
        transition: 'width 200ms ease'
      }}
    >
      {/* ── Logo Area ── */}
      <div className={`flex items-center h-14 flex-shrink-0 border-b border-[#1f1f22] ${isCollapsed ? 'justify-center' : 'px-4 gap-3'}`}>
        <div className="w-7 h-7 rounded-md bg-white flex items-center justify-center flex-shrink-0">
          <Command className="w-4 h-4 text-black" />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col min-w-0 overflow-hidden">
            <span className="text-[13px] font-semibold text-zinc-100 tracking-tight truncate">
              Resumify Inc.
            </span>
          </div>
        )}
      </div>

      {/* ── Navigation Links ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 flex flex-col gap-0.5">
        {!isCollapsed && (
          <div className="px-2 mb-2">
            <p className="text-[11px] font-medium text-zinc-500">
              Workspace
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
                group relative flex items-center ${isCollapsed ? 'justify-center p-2 mx-1' : 'gap-3 px-2 py-1.5'} rounded-md transition-colors duration-150
                ${isActive 
                  ? 'bg-[#171717] text-zinc-100' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#171717]'}
              `}
            >
              <Icon className={`w-[16px] h-[16px] flex-shrink-0 transition-colors ${isActive ? 'text-zinc-100' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
              
              {!isCollapsed && (
                <span className="text-[13px] font-medium truncate">
                  {label}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ── Bottom Settings & Toggle Area ── */}
      <div className="p-2 border-t border-[#1f1f22] flex flex-col gap-0.5">
        <NavLink
          to="/settings"
          title={isCollapsed ? "Settings" : undefined}
          className={`flex items-center ${isCollapsed ? 'justify-center p-2 mx-1' : 'gap-3 px-2 py-1.5'} rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-[#171717] transition-colors`}
        >
          <Settings className="w-[16px] h-[16px]" />
          {!isCollapsed && <span className="text-[13px] font-medium">Settings</span>}
        </NavLink>

        <button
          onClick={toggleCollapse}
          title={isCollapsed ? "Expand" : "Collapse"}
          className={`flex items-center w-full ${isCollapsed ? 'justify-center p-2 mx-1' : 'gap-3 px-2 py-1.5'} rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-[#171717] transition-colors`}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-[16px] h-[16px]" />
          ) : (
            <>
              <PanelLeftClose className="w-[16px] h-[16px]" />
              <span className="text-[13px] font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
