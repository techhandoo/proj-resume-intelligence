import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

type ToastKind = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  kind: ToastKind;
  title: string;
  description?: string;
}

interface ToastContextValue {
  toast: (kind: ToastKind, title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

const kindStyles: Record<ToastKind, { icon: typeof Info; iconClass: string; ringClass: string }> = {
  success: { icon: CheckCircle2, iconClass: 'text-[var(--color-success)]', ringClass: 'border-[color:var(--color-success)]/25' },
  error:   { icon: AlertCircle,  iconClass: 'text-[var(--color-danger)]',  ringClass: 'border-[color:var(--color-danger)]/25' },
  info:    { icon: Info,         iconClass: 'text-[var(--color-accent-strong)]', ringClass: 'border-[color:var(--color-accent)]/25' },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback((kind: ToastKind, title: string, description?: string) => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, kind, title, description }]);
    window.setTimeout(() => dismiss(id), 4500);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Viewport — bottom-right, spring in/out */}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 w-[min(360px,calc(100vw-2.5rem))] pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => {
            const { icon: Icon, iconClass, ringClass } = kindStyles[t.kind];
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                className={`pointer-events-auto flex items-start gap-3 rounded-[var(--radius-inner)] border bg-surface-3/95 p-3.5 shadow-[var(--shadow-popover)] backdrop-blur-xl ${ringClass}`}
                role="status"
              >
                <Icon className={`w-4.5 h-4.5 mt-px flex-shrink-0 ${iconClass}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-[var(--color-text-primary)] leading-snug">{t.title}</p>
                  {t.description && (
                    <p className="mt-0.5 text-xs text-[var(--color-text-muted)] leading-relaxed">{t.description}</p>
                  )}
                </div>
                <button
                  onClick={() => dismiss(t.id)}
                  aria-label="Dismiss notification"
                  className="flex-shrink-0 rounded-md p-1 text-[var(--color-text-subtle)] hover:text-[var(--color-text-primary)] hover:bg-subtle transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
