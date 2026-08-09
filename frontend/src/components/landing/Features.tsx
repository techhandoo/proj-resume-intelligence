import { Link } from 'react-router-dom';
import {
  FileUp, Brain, Layers, FileText, Lightbulb, PenTool,
  UploadCloud, CheckCircle2, Gauge, Download, ArrowRight, Sparkles, Clock,
} from 'lucide-react';
import { Reveal, Section, SectionHeader } from './shared';

/* ── 6-card feature grid: every product capability ── */
const features = [
  {
    icon: FileUp,
    title: 'Smart Resume Ingestion',
    description: 'Instant multi-format parsing for PDF & TXT with layout-aware structural section extraction — headings, roles, skills, and history, cleanly separated.',
    badge: 'v2.4 Engine',
  },
  {
    icon: Brain,
    title: 'Deep AI Analytics',
    description: 'Groq-powered LLM inference scores ATS compatibility, detects keyword match, structure quality, and measurable impact from every resume.',
    badge: 'Groq Speed',
  },
  {
    icon: Layers,
    title: 'Skill Matrix Extraction',
    description: 'Auto-detect tech stacks, frameworks, tools, and domain expertise into a searchable, filterable competency matrix.',
    badge: 'Structured',
  },
  {
    icon: FileText,
    title: 'Executive Summaries',
    description: 'Every candidate gets a concise, decision-ready brief — experience, education, and strengths distilled in one paragraph.',
    badge: 'Auto-generated',
  },
  {
    icon: Lightbulb,
    title: 'Actionable Action Plans',
    description: 'Prioritized, specific recommendations that raise ATS scores — keyword gaps, missing metrics, and structural fixes.',
    badge: 'Score Boosting',
  },
  {
    icon: PenTool,
    title: 'AI Cover Letters',
    description: 'Tone-aware cover letter generation (professional, executive, technical, creative) tailored to each job description.',
    badge: '1-Click Export',
  },
];

export function FeaturesGrid() {
  return (
    <Section id="features">
      <SectionHeader
        eyebrow="Platform Features"
        title={<>Everything you need to turn resumes into <span className="text-[var(--color-accent-strong)]">hiring decisions</span></>}
        description="From ingestion to export, every step of the resume intelligence pipeline is automated and inspectable."
      />

      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, idx) => {
          const Icon = f.icon;
          return (
            <Reveal key={f.title} delay={idx * 0.06}>
              <div className="glass-card glass-card-interactive p-6 flex flex-col h-full group">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-11 h-11 rounded-[var(--radius-inner)] bg-raised border border-border flex items-center justify-center group-hover:border-accent/45 transition-colors">
                    <Icon className="w-5 h-5 text-[var(--color-accent-strong)]" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-subtle text-[var(--color-text-muted)] border border-border">
                    {f.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[var(--color-text-primary)] mb-2">{f.title}</h3>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{f.description}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

/* ── Alternating deep-dives ── */
const parseSteps = [
  { title: 'PDF / TXT accepted', desc: 'Drag, drop, or paste raw text' },
  { title: 'Layout-aware extraction', desc: 'Sections split into clean tokens' },
  { title: 'Normalization pass', desc: 'Removes noise, keeps meaning' },
];

function ShowcaseVisualParse() {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2.5 pb-3.5 border-b border-border mb-4">
        <div className="w-7 h-7 rounded-lg bg-accent-soft text-[var(--color-accent-strong)] flex items-center justify-center">
          <UploadCloud className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs font-bold text-[var(--color-text-primary)]">Ingestion Pipeline</p>
          <p className="text-[10px] text-[var(--color-text-subtle)]">resume_parse.log</p>
        </div>
      </div>
      <div className="space-y-2.5">
        {parseSteps.map((s, i) => (
          <div key={i} className="flex items-start gap-2.5 text-xs">
            <span className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md text-[10px] font-bold ${i === 0 ? 'bg-accent-soft text-[var(--color-accent-strong)]' : i === 1 ? 'bg-[var(--color-success-soft)] text-[var(--color-success)]' : 'bg-subtle text-[var(--color-text-muted)] border border-border'}`}>
              {i + 1}
            </span>
            <div>
              <p className="font-semibold text-[var(--color-text-secondary)]">{s.title}</p>
              <p className="text-[11px] text-[var(--color-text-subtle)]">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3.5 border-t border-border flex items-center gap-1.5 text-[11px] text-[var(--color-text-muted)]">
        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-success)]" />
        <span><span className="font-semibold text-[var(--color-text-secondary)] tabular">12 sections</span> extracted · <span className="tabular">0</span> errors</span>
      </div>
    </div>
  );
}

function ShowcaseVisualScore() {
  return (
    <div className="glass-card p-5 flex flex-col items-center">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-subtle)] mb-4 self-start">ATS Compatibility Rating</p>
      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 136 136">
          <circle cx="68" cy="68" r="58" fill="none" stroke="var(--color-border)" strokeWidth="10" />
          <circle
            cx="68" cy="68" r="58" fill="none"
            stroke="var(--color-success)" strokeWidth="10" strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 58} strokeDashoffset={2 * Math.PI * 58 * 0.06}
            style={{ filter: 'drop-shadow(0 0 8px color-mix(in oklab, var(--color-success) 50%, transparent))' }}
          />
        </svg>
        <div className="z-10 text-center">
          <span className="text-4xl font-black text-[var(--color-text-primary)] leading-none tracking-tight tabular">94</span>
          <span className="text-xs text-[var(--color-text-subtle)] font-mono block mt-0.5 tabular">/ 100</span>
        </div>
      </div>
      <div className="mt-4 w-full space-y-2 text-xs">
        {[
          { label: 'Keywords Match', value: '92%', tone: 'text-[var(--color-success)]' },
          { label: 'Structure & Layout', value: '88%', tone: 'text-[var(--color-success)]' },
          { label: 'Measurable Impact', value: '78%', tone: 'text-[var(--color-warning)]' },
        ].map((row) => (
          <div key={row.label} className="flex justify-between border-t border-border/60 pt-2 first:border-t-0 first:pt-0">
            <span className="text-[var(--color-text-muted)]">{row.label}</span>
            <span className={`font-bold tabular ${row.tone}`}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShowcaseVisualAct() {
  const items = [
    'Add quantified outcomes to 3 bullet points',
    'Insert missing React Native keyword',
    'Restructure work history into reverse-chronological',
    'Replace generic action verbs with impact verbs',
  ];
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between pb-3.5 border-b border-border mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[var(--color-accent-strong)]" />
          <p className="text-xs font-bold text-[var(--color-text-primary)]">Action Plan</p>
        </div>
        <span className="badge badge-emerald">+18 pts projected</span>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2.5 rounded-[var(--radius-inner)] bg-raised border border-border p-2.5 text-xs">
            <Lightbulb className="w-3.5 h-3.5 text-[var(--color-warning)] flex-shrink-0 mt-0.5" />
            <span className="text-[var(--color-text-secondary)] font-medium leading-relaxed">{item}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-accent-soft border border-accent/35 px-2.5 py-1.5 text-[11px] font-semibold text-[var(--color-accent-strong)]">
          <Download className="w-3 h-3" /> PDF
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-md bg-accent-soft border border-accent/35 px-2.5 py-1.5 text-[11px] font-semibold text-[var(--color-accent-strong)]">
          <FileText className="w-3 h-3" /> DOCX
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-md bg-subtle border border-border px-2.5 py-1.5 text-[11px] font-medium text-[var(--color-text-muted)]">
          <PenTool className="w-3 h-3" /> Cover Letter
        </span>
      </div>
    </div>
  );
}

const showcases = [
  {
    eyebrow: '01 · Ingest',
    title: 'From messy PDF to structured sections',
    description: 'Resumify normalizes any resume into clean, machine-readable sections — contact, summary, experience, education, and skills — so the AI always analyzes perfect structure.',
    bullets: [
      'PDF & TXT parsing with layout-aware extraction',
      'Graceful fallback for scanned or image-only documents',
      'Inline review before analysis — you stay in control',
    ],
    visual: <ShowcaseVisualParse />,
  },
  {
    eyebrow: '02 · Analyze',
    title: 'An ATS score you can actually trust',
    description: 'A transparent scoring model breaks compatibility into keyword match, structure, and measurable impact — so candidates know exactly why they scored and how to improve.',
    bullets: [
      'Groq LLaMA-3 inference in under 1.5 seconds',
      'Per-criterion breakdown with weighted ATS score',
      'Skills matrix with search & filter',
    ],
    visual: <ShowcaseVisualScore />,
  },
  {
    eyebrow: '03 · Act',
    title: 'Insights that turn into offers',
    description: 'Every analysis ships with a prioritized action plan and export-ready artifacts — executive summaries, improvement steps, and tone-matched cover letters in PDF or Word.',
    bullets: [
      'Prioritized, score-boosting recommendations',
      'Tone-aware AI cover letters per job posting',
      'PDF / DOCX / clipboard export, one click away',
    ],
    visual: <ShowcaseVisualAct />,
  },
];

export function FeatureShowcase() {
  return (
    <Section>
      <SectionHeader
        eyebrow="Inside the pipeline"
        title="Three steps. Zero guesswork."
        description="A guided, transparent pipeline from raw document to decision-ready candidate intelligence."
      />
      <div className="mt-16 space-y-20">
        {showcases.map((s, idx) => (
          <Reveal key={s.eyebrow}>
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${idx % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent-strong)]">{s.eyebrow}</span>
                <h3 className="mt-3 text-2xl sm:text-3xl font-extrabold text-[var(--color-text-primary)] tracking-tight leading-tight">{s.title}</h3>
                <p className="mt-4 text-sm text-[var(--color-text-muted)] leading-relaxed">{s.description}</p>
                <ul className="mt-6 space-y-3">
                  {s.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--color-text-secondary)]">
                      <CheckCircle2 className="w-4 h-4 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/upload" className="btn-secondary mt-8 px-5 py-2.5 text-xs font-semibold">
                  Try it with a sample resume <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <Reveal delay={0.1}>{s.visual}</Reveal>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ── How it works ── */
const steps = [
  {
    icon: FileUp,
    title: 'Upload a resume',
    description: 'Drop a PDF or TXT, paste raw text, or load a sample engineer resume to explore instantly.',
  },
  {
    icon: Gauge,
    title: 'AI analyzes it',
    description: 'Groq LLM inference extracts skills, scores ATS compatibility, and drafts an executive summary in seconds.',
  },
  {
    icon: PenTool,
    title: 'Get insights & act',
    description: 'Review the action plan, generate a tailored cover letter, and export polished documents in one click.',
  },
];

export function HowItWorks() {
  return (
    <Section id="how-it-works">
      <SectionHeader
        eyebrow="How it works"
        title="From upload to offer-ready in three steps"
        description="No configuration, no training data, no waiting. The whole loop takes under two minutes."
      />
      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <Reveal key={s.title} delay={i * 0.08}>
              <div className="glass-card glass-card-interactive p-6 relative h-full">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-[var(--radius-inner)] bg-accent-soft border border-accent/25 text-[var(--color-accent-strong)] flex items-center justify-center">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-[var(--color-text-subtle)] border border-border rounded-md px-2 py-0.5 bg-subtle">
                    STEP {i + 1}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[var(--color-text-primary)] mb-2">{s.title}</h3>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{s.description}</p>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute -right-4.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-subtle)] z-10" />
                )}
              </div>
            </Reveal>
          );
        })}
      </div>
      <Reveal delay={0.2} className="mt-12 text-center">
        <p className="inline-flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
          <Clock className="w-3.5 h-3.5 text-[var(--color-accent-strong)]" />
          Median time from upload to full analysis: <span className="font-semibold text-[var(--color-text-secondary)] tabular">38 seconds</span>
        </p>
      </Reveal>
    </Section>
  );
}
