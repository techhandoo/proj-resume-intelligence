import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LogOut, Bell, Search, ChevronRight, User, Settings, CheckCircle2 } from 'lucide-react';
import { getUser, clearAuth } from '../lib/auth';
import Menu from './ui/Menu';
import ThemeToggle from './ui/ThemeToggle';
import CommandPalette, { OPEN_COMMAND_PALETTE } from './ui/CommandPalette';

const routeLabels: Record<string, string> = {
  dashboard: 'Overview',
  upload: 'Upload',
  'cover-letter': 'AI Cover Letter',
  templates: 'Templates',
  about: 'Documentation',
  settings: 'Settings',
  resumes: 'Candidate',
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  // Breadcrumb from a semantic route map — not string surgery on the URL
  const pathParts = location.pathname.split('/').filter(Boolean);
  const breadcrumbText = pathParts.length > 0
    ? routeLabels[pathParts[pathParts.length - 1]] ?? pathParts[pathParts.length - 1]
    : 'Overview';

  const openPalette = () => window.dispatchEvent(new Event(OPEN_COMMAND_PALETTE));

  return (
    <header className="sticky top-0 z-40 h-16 w-full flex items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-xl">
      <CommandPalette />

      {/* ── Left: Breadcrumb Navigation ── */}
      <div className="flex items-center gap-2 text-sm select-none">
        <Link to="/dashboard" className="flex items-center gap-1.5 font-medium text-[13px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
          <span className="font-semibold text-[var(--color-text-primary)]">Resumify</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[var(--color-text-subtle)]" />
        <span className="font-semibold text-[13px] text-[var(--color-text-secondary)] capitalize truncate max-w-[200px] sm:max-w-xs">
          {breadcrumbText}
        </span>
      </div>

      {/* ── Center: Command Palette / Search Launcher ── */}
      <div className="hidden md:flex items-center">
        <button
          onClick={openPalette}
          aria-haspopup="dialog"
          className="flex items-center gap-3 px-3.5 py-1.5 rounded-full border border-border bg-surface text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:border-border-strong transition-all text-xs w-64 justify-between cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[var(--color-text-subtle)]" />
            <span>Search workspace…</span>
          </span>
          <kbd className="px-1.5 py-0.5 rounded bg-subtle border border-border text-[10px] font-medium text-[var(--color-text-muted)]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* ── Right Controls ── */}
      <div className="flex items-center gap-3">
        <ThemeToggle />

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications((v) => !v)}
            aria-expanded={showNotifications}
            aria-haspopup="true"
            aria-label="Notifications"
            className="relative p-2 rounded-[var(--radius-inner)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-surface-hover transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--color-success)] ring-4 ring-background" />
          </button>

          <Menu open={showNotifications} onClose={() => setShowNotifications(false)} width="20rem">
            <div className="flex items-center justify-between px-2.5 py-2.5 border-b border-border">
              <span className="text-xs font-bold text-[var(--color-text-primary)]">Notifications</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[var(--color-success-soft)] text-[var(--color-success)] border border-[color:var(--color-success)]/25">
                All Systems Normal
              </span>
            </div>
            <div className="p-2.5 space-y-2.5">
              <div className="flex items-start gap-2.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[var(--color-text-secondary)] font-medium">Groq AI Engine v2.4 Active</p>
                  <span className="text-[10px] text-[var(--color-text-muted)]">2 minutes ago</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-[var(--color-accent-strong)] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[var(--color-text-secondary)] font-medium">ATS Scoring Algorithms Updated</p>
                  <span className="text-[10px] text-[var(--color-text-muted)]">1 hour ago</span>
                </div>
              </div>
            </div>
          </Menu>
        </div>

        <div className="h-4 w-px bg-border" />

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu((v) => !v)}
            aria-expanded={showProfileMenu}
            aria-haspopup="true"
            aria-label="Account menu"
            className="flex items-center gap-2.5 p-1.5 rounded-[var(--radius-inner)] hover:bg-surface-hover transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[oklch(0.55_0.2_262)] to-[oklch(0.72_0.15_165)] text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span className="hidden sm:inline text-xs font-semibold text-[var(--color-text-secondary)] max-w-[100px] truncate">
              {user?.fullName?.split(' ')[0] || 'User'}
            </span>
          </button>

          <Menu open={showProfileMenu} onClose={() => setShowProfileMenu(false)} width="14rem">
            <div className="px-2.5 py-2.5 border-b border-border mb-1">
              <p className="text-xs font-semibold text-[var(--color-text-primary)] truncate">{user?.fullName || 'Enterprise User'}</p>
              <p className="text-[11px] text-[var(--color-text-muted)] truncate">{user?.email || 'user@workspace.com'}</p>
            </div>

            <Link
              to="/settings"
              onClick={() => setShowProfileMenu(false)}
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-subtle rounded-lg transition-colors"
            >
              <User className="w-3.5 h-3.5 text-[var(--color-text-muted)]" /> Profile &amp; Account
            </Link>
            <Link
              to="/settings"
              onClick={() => setShowProfileMenu(false)}
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-subtle rounded-lg transition-colors"
            >
              <Settings className="w-3.5 h-3.5 text-[var(--color-text-muted)]" /> Preferences
            </Link>

            <div className="h-px bg-border my-1" />

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-2.5 py-1.5 text-xs font-medium text-[var(--color-danger)] hover:bg-[var(--color-danger-soft)] rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </Menu>
        </div>
      </div>
    </header>
  );
}
