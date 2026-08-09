import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';

/** Scroll-triggered reveal used by every landing section. */
export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ type: 'spring', bounce: 0, duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Consistent section header: eyebrow badge + title + description. */
export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'center',
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: 'center' | 'left';
}) {
  return (
    <Reveal className={align === 'center' ? 'text-center' : 'text-left'}>
      <span className="badge badge-blue">
        <Sparkles className="w-3 h-3 text-[var(--color-accent-strong)]" /> {eyebrow}
      </span>
      <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold text-[var(--color-text-primary)] tracking-tight leading-tight">
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-sm sm:text-base text-[var(--color-text-muted)] leading-relaxed ${align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-xl'}`}>
          {description}
        </p>
      )}
    </Reveal>
  );
}

/** Full-width section wrapper with consistent rhythm. */
export function Section({ id, children, className = '' }: { id?: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`relative mx-auto w-full max-w-7xl px-6 sm:px-10 py-20 sm:py-28 scroll-mt-24 ${className}`}>
      {children}
    </section>
  );
}
