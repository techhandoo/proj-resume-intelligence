import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, FileUp, PenTool, FileText, BookOpen, Settings, LogOut, Search, CornerDownLeft } from 'lucide-react';
import { clearAuth } from '../../lib/auth';

interface PaletteAction {
  id: string;
  label: string;
  description: string;
  icon: typeof LayoutDashboard;
  shortcut?: string;
  run: () => void;
}

/** Global event used by the Navbar search trigger to open the palette. */
export const OPEN_COMMAND_PALETTE = 'proj:open-command-palette';

export default function CommandPalette() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const actions: PaletteAction[] = useMemo(() => [
    { id: 'overview',     label: 'Overview',     description: 'Workspace dashboard',      icon: LayoutDashboard, shortcut: '⌘1', run: () => navigate('/dashboard') },
    { id: 'upload',       label: 'Upload',       description: 'Ingest a candidate resume', icon: FileUp,          shortcut: '⌘2', run: () => navigate('/upload') },
    { id: 'cover-letter', label: 'Cover Letter', description: 'Generate an AI cover letter', icon: PenTool,       shortcut: '⌘3', run: () => navigate('/cover-letter') },
    { id: 'templates',    label: 'Templates',    description: 'ATS-optimized resume templates', icon: FileText,    shortcut: '⌘4', run: () => navigate('/templates') },
    { id: 'docs',         label: 'Documentation', description: 'System architecture & docs', icon: BookOpen,      shortcut: '⌘5', run: () => navigate('/about') },
    { id: 'settings',     label: 'Settings',     description: 'Profile, security & workspace', icon: Settings,    run: () => navigate('/settings') },
    { id: 'signout',      label: 'Sign out',     description: 'End the current session',     icon: LogOut,        run: () => { clearAuth(); navigate('/'); } },
  ], [navigate]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter(
      (a) => a.label.toLowerCase().includes(q) || a.description.toLowerCase().includes(q),
    );
  }, [actions, query]);

  const close = () => { setOpen(false); setQuery(''); };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_COMMAND_PALETTE, onOpen);
    return () => window.removeEventListener(OPEN_COMMAND_PALETTE, onOpen);
  }, []);

  useEffect(() => {
    if (open) {
      setSelected(0);
      setQuery('');
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const run = (action: PaletteAction) => {
    close();
    action.run();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[16vh]">
          {/* scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-[var(--color-scrim)] backdrop-blur-sm"
            onClick={close}
          />

          {/* panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -6 }}
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            role="dialog"
            aria-label="Command palette"
            className="relative w-full max-w-xl overflow-hidden rounded-[var(--radius-card)] border border-border-strong bg-surface-3/95 shadow-[var(--shadow-modal)] backdrop-blur-2xl"
          >
            {/* input row */}
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="w-4 h-4 flex-shrink-0 text-[var(--color-text-muted)]" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') { e.preventDefault(); setSelected((s) => Math.min(s + 1, filtered.length - 1)); }
                  else if (e.key === 'ArrowUp') { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
                  else if (e.key === 'Enter' && filtered[selected]) { e.preventDefault(); run(filtered[selected]); }
                  else if (e.key === 'Escape') { close(); }
                }}
                placeholder="Jump to a page or run an action…"
                className="w-full bg-transparent py-3.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none"
              />
              <kbd className="hidden sm:flex items-center gap-0.5 rounded-md border border-border bg-subtle px-1.5 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)]">
                esc
              </kbd>
            </div>

            {/* results */}
            <div className="max-h-[300px] overflow-y-auto p-1.5">
              {filtered.length === 0 ? (
                <p className="px-3 py-8 text-center text-xs text-[var(--color-text-muted)]">
                  No results for “{query}”
                </p>
              ) : (
                filtered.map((action, i) => {
                  const Icon = action.icon;
                  const isSel = i === selected;
                  return (
                    <button
                      key={action.id}
                      onClick={() => run(action)}
                      onMouseEnter={() => setSelected(i)}
                      className={`flex w-full items-center gap-3 rounded-[var(--radius-inner)] px-3 py-2.5 text-left transition-colors cursor-pointer ${
                        isSel ? 'bg-accent/15 text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'
                      }`}
                    >
                      <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border ${
                        isSel ? 'border-accent/40 bg-accent/15 text-[var(--color-accent-strong)]' : 'border-border bg-subtle text-[var(--color-text-muted)]'
                      }`}>
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] font-medium leading-tight">{action.label}</span>
                        <span className="block truncate text-[11px] text-[var(--color-text-muted)]">{action.description}</span>
                      </span>
                      {action.shortcut && (
                        <kbd className="text-[10px] font-medium text-[var(--color-text-subtle)]">{action.shortcut}</kbd>
                      )}
                      {isSel && <CornerDownLeft className="w-3.5 h-3.5 text-[var(--color-accent-strong)]" />}
                    </button>
                  );
                })
              )}
            </div>

            {/* footer hints */}
            <div className="flex items-center gap-4 border-t border-border px-4 py-2 text-[10px] text-[var(--color-text-subtle)]">
              <span className="flex items-center gap-1"><kbd className="rounded border border-border bg-subtle px-1">↑↓</kbd> navigate</span>
              <span className="flex items-center gap-1"><kbd className="rounded border border-border bg-subtle px-1">↵</kbd> select</span>
              <span className="flex items-center gap-1"><kbd className="rounded border border-border bg-subtle px-1">esc</kbd> close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
