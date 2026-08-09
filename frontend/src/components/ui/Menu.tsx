import { useEffect, useRef, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuProps {
  open: boolean;
  onClose: () => void;
  align?: 'left' | 'right';
  width?: number | string;
  className?: string;
  children: ReactNode;
}

/**
 * Elevation-2 popover with spring enter/exit, Escape-to-close and
 * click-outside dismissal. Replaces instant-mount dropdowns.
 */
export default function Menu({ open, onClose, align = 'right', width = 'auto', className = '', children }: MenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      {/* click-outside scrim (invisible) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -4 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            style={{ width }}
            className={`absolute z-50 mt-2 origin-top-right rounded-[var(--radius-card)] border border-border bg-surface-2/95 p-1.5 shadow-[var(--shadow-popover)] backdrop-blur-xl ${
              align === 'right' ? 'right-0' : 'left-0'
            } ${className}`}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
