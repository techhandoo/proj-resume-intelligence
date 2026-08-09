import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileUp,
  Settings,
  BookOpen,
  PanelLeftClose,
  PanelLeftOpen,
  PenTool,
  FileText,
  UserCheck
} from 'lucide-react';
import Logo from './Logo';
import { getUser } from '../lib/auth';

const navItems = [
  { to: '/dashboard',   icon: LayoutDashboard, label: 'Overview',      shortcut: '⌘1' },
  { to: '/upload',      icon: FileUp,          label: 'Upload',        shortcut: '⌘2' },
  { to: '/cover-letter',icon: PenTool,         label: 'Cover Letter',  shortcut: '⌘3' },
  { to: '/templates',   icon: FileText,        label: 'Templates',     shortcut: '⌘4' },
  { to: '/about',       icon: BookOpen,        label: 'Documentation', shortcut: '⌘5' },
];

interface SidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

export default function Sidebar({ isCollapsed, toggleCollapse }: SidebarProps) {
  const location = useLocation();
  const user = getUser();
  
  return (
    <aside 
      className={`fixed top-0 bottom-0 left-0 flex flex-col z-50 bg-[#070709]/95 backdrop-blur-xl border-r border-[#1c1c21] ${
        isCollapsed ? 'w-16' : 'w-60'
      } transition-all duration-300 ease-out select-none`}
    >
      {/* ── Logo Area ── */}
      <div className={`flex items-center h-16 flex-shrink-0 border-b border-[#1c1c21] ${isCollapsed ? 'justify-center px-2' : 'px-5 justify-between'}`}>
        <Logo size="sm" href="/dashboard" showText={!isCollapsed} />
      </div>

      {/* ── Navigation Links ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-5 px-3 flex flex-col gap-1.5">
        {!isCollapsed && (
          <div className="px-2 mb-2 flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
              Navigation
            </span>
          </div>
        )}
        
        {navItems.map(({ to, icon: Icon, label, shortcut }) => {
          const isActive = location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              title={isCollapsed ? label : undefined}
              className={`
                group relative flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'} rounded-xl transition-all duration-200
                ${isActive 
                  ? 'text-white font-semibold' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#121215]'}
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebarActivePill"
                  className="absolute inset-0 bg-[#17171e] border border-white/10 rounded-xl shadow-inner"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <div className="relative z-10 flex items-center gap-3 truncate">
                <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? 'text-blue-400' : 'text-zinc-400 group-hover:text-zinc-200'}`} />
                {!isCollapsed && (
                  <span className="text-[13.5px] truncate">
                    {label}
                  </span>
                )}
              </div>

              {!isCollapsed && (
                <span className="relative z-10 text-[10px] font-mono text-zinc-600 group-hover:text-zinc-500 transition-colors">
                  {shortcut}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ── User & Toggle Area ── */}
      <div className="p-3 border-t border-[#1c1c21] flex flex-col gap-1 bg-[#050507]">
        {!isCollapsed && user && (
          <div className="p-2.5 rounded-xl bg-[#0e0e12] border border-white/5 flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
              {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-zinc-100 truncate">{user.fullName || 'Enterprise User'}</span>
              <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                <UserCheck className="w-2.5 h-2.5" /> Workspace Active
              </span>
            </div>
          </div>
        )}

        <NavLink
          to="/settings"
          title={isCollapsed ? "Settings" : undefined}
          className={`flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2'} rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-[#121215] transition-colors`}
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span className="text-[13.5px] font-medium">Settings</span>}
        </NavLink>

        <button
          onClick={toggleCollapse}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          className={`flex items-center w-full ${isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2'} rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-[#121215] transition-colors cursor-pointer`}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-4 h-4 text-zinc-400 hover:text-white" />
          ) : (
            <>
              <PanelLeftClose className="w-4 h-4 text-zinc-400" />
              <span className="text-[13.5px] font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

