import { Link } from 'react-router-dom';
import {
  Layers, GitCompare, Users, Plug, Languages, MessagesSquare, History, SlidersHorizontal,
  ArrowRight, CheckCircle2, Zap, type LucideIcon,
} from 'lucide-react';
import { Reveal, Section, SectionHeader } from './shared';

type Status = 'In development' | 'Planned' | 'Researching';

const statusClass: Record<Status, string> = {
  'In development': 'badge-blue',
  'Planned': 'badge-amber',
  'Researching': 'badge-zinc',
};

const upcoming: { icon: LucideIcon; title: string; description: string; status: Status }[] = [
  {
    icon: Layers,
    title: 'Batch processing',
    description: 'Upload and analyze entire candidate pipelines at once, with per-file results streamed to your dashboard.',
    status: 'In development',
  },
  {
    icon: GitCompare,
    title: 'Candidate comparison',
    description: 'Side-by-side scoring views that rank candidates against each other and against the role description.',
    status: 'In development',
  },
  {
    icon: Users,
    title: 'Team workspaces',
    description: 'Shared projects, roles and permissions, and collaborative review notes for hiring teams.',
    status: 'Planned',
  },
  {
    icon: Plug,
    title: 'API & ATS integrations',
    description: 'Connect Resumify to your ATS, HRIS, or internal tools via a documented REST API and webhooks.',
    status: 'Planned',
  },
  {
    icon: Languages,
    title: 'Multi-language parsing',
    description: 'Native parsing and scoring for French, German, Spanish, and more — with localized ATS heuristics.',
    status: 'Researching',
  },
  {
    icon: MessagesSquare,
    title: 'Interview question generator',
    description: 'Role-specific interview questions generated from each candidate’s detected strengths and gaps.',
    status: 'Researching',
  },
  {
    icon: History,
    title: 'Resume version history',
    description: 'Track score improvements across revisions, with diff views that show what moved the needle.',
    status: 'Planned',
  },
  {
    icon: SlidersHorizontal,
    title: 'Custom scoring models',
    description: 'Let enterprises tune weights and keywords to match their own hiring rubrics.',
    status: 'Researching',
  },
];

export function Roadmap() {
  return (
    <Section id="roadmap">
      <SectionHeader
        eyebrow="Upcoming features"
        title="What’s shipping next"
        description="We’re building the roadmap in the open. Vote with your feedback — the most requested items move up the queue."
      />

      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {upcoming.map((f, idx) => {
          const Icon = f.icon;
          return (
            <Reveal key={f.title} delay={(idx % 4) * 0.06}>
              <div className="glass-card glass-card-interactive p-6 h-full flex flex-col group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-[var(--radius-inner)] bg-raised border border-border flex items-center justify-center group-hover:border-accent/45 transition-colors">
                    <Icon className="w-4 h-4 text-[var(--color-accent-strong)]" />
                  </div>
                  <span className={`badge text-[10px] ${statusClass[f.status]}`}>{f.status}</span>
                </div>
                <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-1.5">{f.title}</h3>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{f.description}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

/* ── Final CTA ── */
export function FinalCTA() {
  return (
    <Section className="pb-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-accent/40 bg-gradient-to-br from-[oklch(0.2_0.05_262)] via-[oklch(0.13_0.04_262)] to-[oklch(0.09_0.03_262)] p-10 sm:p-16 text-center">
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-[560px] rounded-full bg-accent/20 blur-3xl" />
          <span className="badge bg-white/10 text-white border border-white/20">
            <Zap className="w-3 h-3" /> Free forever plan
          </span>
          <h2 className="mt-6 text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Start analyzing resumes<br className="hidden sm:block" /> in the next 60 seconds
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/60 max-w-xl mx-auto leading-relaxed">
            Upload a sample resume or bring your own. See a real ATS score, skill matrix, and action plan —
            no credit card required.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="btn-primary px-8 py-3.5 text-sm">
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="btn-secondary px-8 py-3.5 text-sm">
              Sign in to workspace
            </Link>
          </div>
          <p className="mt-6 inline-flex items-center gap-1.5 text-[11px] text-white/45">
            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-success)]" />
            No credit card · Cancel anytime · Encrypted end to end
          </p>
        </div>
      </Reveal>
    </Section>
  );
}

/* ── Footer ── */
const footerCols: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Roadmap', href: '#roadmap' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Documentation', href: '/about' },
      { label: 'Templates', href: '/templates' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Upload a resume', href: '/upload' },
      { label: 'Cover letter generator', href: '/cover-letter' },
      { label: 'Sign in', href: '/login' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy', href: '/about' },
      { label: 'Security', href: '/about' },
      { label: 'Terms', href: '/about' },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 py-14">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
          <div className="col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <span className="text-base font-bold tracking-tight text-[var(--color-text-primary)]">Resumify</span>
              <span className="badge badge-blue text-[10px]">AI</span>
            </Link>
            <p className="mt-4 text-xs text-[var(--color-text-muted)] leading-relaxed max-w-xs">
              The AI-powered resume intelligence platform. Parse, score, and act on candidate documents at scale.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-[11px] font-medium text-[var(--color-success)]">
              <CheckCircle2 className="w-3.5 h-3.5" /> Groq &amp; PostgreSQL Systems Operational
            </span>
          </div>

          {footerCols.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-subtle)]">{col.heading}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-[var(--color-text-subtle)]">© {new Date().getFullYear()} Resumify Inc. All rights reserved.</span>
          <span className="text-[11px] text-[var(--color-text-subtle)]">
            v2.4 Engine · Powered by Groq LPU inference
          </span>
        </div>
      </div>
    </footer>
  );
}
