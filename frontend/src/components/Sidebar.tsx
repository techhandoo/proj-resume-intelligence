import { useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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
  { to: '/dashboard',   icon: LayoutDashboard, label: 'Overview',      shortcut: '1' },
  { to: '/upload',      icon: FileUp,          label: 'Upload',        shortcut: '2' },
  { to: '/cover-letter',icon: PenTool,         label: 'Cover Letter',  shortcut: '3' },
  { to: '/templates',   icon: FileText,        label: 'Templates',     shortcut: '4' },
  { to: '/about',       icon: BookOpen,        label: 'Documentation', shortcut: '5' },
];

interface SidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

export default function Sidebar({ isCollapsed, toggleCollapse }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUser();

  // Real keyboard shortcuts — the ⌘1..⌘5 hints actually work now
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return;
      const item = navItems.find((n) => n.shortcut === e.key);
      if (item) {
        e.preventDefault();
        navigate(item.to);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 flex flex-col z-50 bg-surface/95 backdrop-blur-xl border-r border-border ${
        isCollapsed ? 'w-16' : 'w-60'
      } transition-all duration-300 ease-out select-none`}
    >
      {/* ── Logo Area ── */}
      <div className={`flex items-center h-16 flex-shrink-0 border-b border-border ${isCollapsed ? 'justify-center px-2' : 'px-5 justify-between'}`}>
        <Logo size="sm" href="/dashboard" showText={!isCollapsed} />
      </div>

      {/* ── Navigation Links ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-5 px-3 flex flex-col gap-1.5">
        {!isCollapsed && (
          <div className="px-2 mb-2 flex items-center justify-between">
            <span className="text-[11px] font-bold text-[var(--color-text-subtle)] uppercase tracking-wider">
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
                group relative flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'} rounded-[var(--radius-inner)] transition-all duration-200
                ${isActive
                  ? 'text-[var(--color-text-primary)] font-semibold'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-surface-hover'}
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebarActivePill"
                  className="absolute inset-0 bg-surface-2 border border-border-strong rounded-[var(--radius-inner)] shadow-sm"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <div className="relative z-10 flex items-center gap-3 truncate">
                <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? 'text-[var(--color-accent-strong)]' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)]'}`} />
                {!isCollapsed && (
                  <span className="text-[13.5px] truncate">
                    {label}
                  </span>
                )}
              </div>

              {!isCollapsed && (
                <span className="relative z-10 text-[10px] font-mono text-[var(--color-text-subtle)] group-hover:text-[var(--color-text-muted)] transition-colors">
                  ⌘{shortcut}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ── User & Toggle Area ── */}
      <div className="p-3 border-t border-border flex flex-col gap-1 bg-surface/80">
        {!isCollapsed && user && (
          <div className="p-2.5 rounded-[var(--radius-inner)] bg-surface-2 border border-border flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[oklch(0.55_0.2_262)] to-[oklch(0.72_0.15_165)] flex items-center justify-center text-white font-bold text-xs shadow-sm">
              {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-[var(--color-text-primary)] truncate">{user.fullName || 'Enterprise User'}</span>
              <span className="text-[10px] text-[var(--color-success)] font-medium flex items-center gap-1">
                <UserCheck className="w-2.5 h-2.5" /> Workspace Active
              </span>
            </div>
          </div>
        )}

        <NavLink
          to="/settings"
          title={isCollapsed ? "Settings" : undefined}
          className={`flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2'} rounded-[var(--radius-inner)] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-surface-hover transition-colors`}
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span className="text-[13.5px] font-medium">Settings</span>}
        </NavLink>

        <button
          onClick={toggleCollapse}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          className={`flex items-center w-full ${isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2'} rounded-[var(--radius-inner)] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-surface-hover transition-colors cursor-pointer`}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-4 h-4" />
          ) : (
            <>
              <PanelLeftClose className="w-4 h-4" />
              <span className="text-[13.5px] font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
