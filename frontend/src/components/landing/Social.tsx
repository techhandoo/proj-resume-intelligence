import { Users, Briefcase, GraduationCap, Building2, Lock, ShieldCheck, Server, Quote } from 'lucide-react';
import { Reveal, Section, SectionHeader } from './shared';

/* ── Use cases ── */
const useCases = [
  {
    icon: Briefcase,
    title: 'Recruiting teams',
    description: 'Triage inbound pipelines at scale — every candidate arrives pre-scored, pre-summarized, and ranked by ATS compatibility.',
    tag: 'Volume-ready',
  },
  {
    icon: GraduationCap,
    title: 'Career coaches',
    description: 'Turn coaching sessions into data: show clients exactly which keywords, metrics, and structures are costing them interviews.',
    tag: 'Client-proof',
  },
  {
    icon: Users,
    title: 'Job seekers',
    description: 'Polish your own resume against real ATS logic, then generate a tailored cover letter for every application in seconds.',
    tag: 'Self-serve',
  },
  {
    icon: Building2,
    title: 'HR operations',
    description: 'Standardize candidate evaluation, generate consistent summaries for review panels, and export clean documentation.',
    tag: 'Compliance-friendly',
  },
];

export function UseCases() {
  return (
    <Section>
      <SectionHeader
        eyebrow="Who it's for"
        title="Built for every side of the hiring table"
        description="Whether you review a hundred resumes a day or just your own, Resumify meets you at the level you work at."
      />
      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {useCases.map((u, idx) => {
          const Icon = u.icon;
          return (
            <Reveal key={u.title} delay={idx * 0.06}>
              <div className="glass-card glass-card-interactive p-6 h-full flex flex-col group">
                <div className="w-10 h-10 rounded-[var(--radius-inner)] bg-raised border border-border flex items-center justify-center group-hover:border-accent/45 transition-colors mb-4">
                  <Icon className="w-4.5 h-4.5 text-[var(--color-accent-strong)]" />
                </div>
                <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-2">{u.title}</h3>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed flex-1">{u.description}</p>
                <span className="mt-4 badge badge-zinc text-[10px]">{u.tag}</span>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

/* ── Security band ── */
const security = [
  { icon: Lock, title: 'Encrypted at rest', desc: 'AES-256 encryption for every stored document.' },
  { icon: ShieldCheck, title: 'Encrypted in transit', desc: 'TLS 1.3 on all API and web traffic.' },
  { icon: Server, title: 'Your data stays yours', desc: 'Resume content never trains public LLM models.' },
];

export function SecurityBand() {
  return (
    <Section className="py-12 sm:py-14">
      <div className="glass-card p-8 sm:p-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {security.map((s, idx) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.title} delay={idx * 0.08} className="flex items-start gap-4">
                <div className="w-10 h-10 flex-shrink-0 rounded-[var(--radius-inner)] bg-[var(--color-success-soft)] border border-[color:var(--color-success)]/25 text-[var(--color-success)] flex items-center justify-center">
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--color-text-primary)]">{s.title}</h3>
                  <p className="mt-1 text-xs text-[var(--color-text-muted)] leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

/* ── Testimonials ── */
const testimonials = [
  {
    quote: 'We cut resume triage from three days to one afternoon. The ATS breakdown tells us instantly who deserves a phone screen.',
    name: 'Priya Nair',
    role: 'Head of Talent, Northwind Labs',
    initials: 'PN',
    tone: 'bg-gradient-to-tr from-[oklch(0.55_0.2_262)] to-[oklch(0.72_0.15_165)]',
  },
  {
    quote: 'My clients walk in with their score, their gaps, and their action plan already written. It makes coaching concrete instead of abstract.',
    name: 'Marcus Webb',
    role: 'Independent Career Coach',
    initials: 'MW',
    tone: 'bg-gradient-to-tr from-[oklch(0.6_0.16_300)] to-[oklch(0.7_0.14_220)]',
  },
  {
    quote: 'The cover letter generator alone is worth it. Tone-matched, tailored to the posting, and exportable in a format recruiters actually open.',
    name: 'Sofia Reyes',
    role: 'Senior Product Manager, Lumen Group',
    initials: 'SR',
    tone: 'bg-gradient-to-tr from-[oklch(0.55_0.15_45)] to-[oklch(0.65_0.16_120)]',
  },
];

export function Testimonials() {
  return (
    <Section>
      <SectionHeader
        eyebrow="Loved by teams"
        title="Recruiters, coaches, and candidates agree"
        description="Real workflows, real outcomes — from the people who use Resumify every week."
      />
      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, idx) => (
          <Reveal key={t.name} delay={idx * 0.08}>
            <figure className="glass-card p-6 h-full flex flex-col">
              <Quote className="w-5 h-5 text-[var(--color-accent-strong)] mb-4" />
              <blockquote className="text-sm text-[var(--color-text-secondary)] leading-relaxed flex-1">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                <span className={`w-9 h-9 rounded-[var(--radius-inner)] text-white flex items-center justify-center text-xs font-bold ${t.tone}`}>
                  {t.initials}
                </span>
                <div>
                  <p className="text-xs font-bold text-[var(--color-text-primary)]">{t.name}</p>
                  <p className="text-[11px] text-[var(--color-text-muted)]">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
