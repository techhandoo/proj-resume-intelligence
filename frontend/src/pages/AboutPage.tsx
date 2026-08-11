import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { isAuthenticated } from '../lib/auth';
import {
  ArrowLeft, Server, Code, ShieldCheck, Cpu, Database,
  Network, Table2, KeyRound, Workflow, FileJson,
} from 'lucide-react';

const apiEndpoints = [
  { method: 'POST', path: '/api/v1/auth/register', auth: false, desc: 'Create a workspace account and receive a JWT.' },
  { method: 'POST', path: '/api/v1/auth/login', auth: false, desc: 'Authenticate and exchange credentials for a JWT.' },
  { method: 'POST', path: '/api/v1/resumes', auth: true, desc: 'Upload resume content (fileName + raw text). Triggers AI analysis synchronously.' },
  { method: 'GET', path: '/api/v1/resumes', auth: true, desc: 'List the authenticated user\'s resumes, newest first.' },
  { method: 'GET', path: '/api/v1/resumes/{id}', auth: true, desc: 'Fetch a single resume record and its processing status.' },
  { method: 'GET', path: '/api/v1/resumes/{id}/analysis', auth: true, desc: 'Fetch the stored AI analysis: summary, skills, ATS score, insights, improvements.' },
  { method: 'POST', path: '/api/v1/cover-letter/generate', auth: true, desc: 'Generate a tone-aware cover letter from a resume + job description.' },
];

const dataModel = [
  { entity: 'User', fields: 'id (UUID) · fullName · email · role · createdAt', note: 'Workspace owner; every resume and analysis is scoped to it.' },
  { entity: 'Resume', fields: 'id (UUID) · fileName · fileType · fileSize · rawText (TEXT) · status · uploadedAt', note: 'Status lifecycle: UPLOADED → PROCESSING → ANALYZED | FAILED.' },
  { entity: 'Analysis', fields: 'id (UUID) · summary · skills · education · experienceYears · atsScore · insights[] · improvements[] · recommendations · analyzedAt', note: 'One-to-one with Resume; written once at the end of inference.' },
];

const envVars = [
  { var: 'AI_API_KEY', default: 'YOUR_GROQ_API_KEY_HERE', purpose: 'Groq API key (gsk_…) or any OpenAI-compatible provider key.' },
  { var: 'AI_BASE_URL', default: 'https://api.groq.com/openai', purpose: 'OpenAI-compatible base URL. Swap for OpenRouter etc.' },
  { var: 'AI_MODEL', default: 'llama-3.3-70b-versatile', purpose: 'Model id used for analysis + cover letter inference.' },
  { var: 'JWT_SECRET', default: 'local dev secret (64+ chars)', purpose: 'HS256 signing secret for auth tokens.' },
  { var: 'SPRING_DATASOURCE_URL', default: 'h2:file:./data/proj_db', purpose: 'JDBC URL. Postgres (prod) or embedded H2 (dev).' },
];

export default function AboutPage() {
  return (
    <AppLayout>
      <div className="w-full max-w-4xl mx-auto space-y-8 pb-16">

        {/* Header */}
        <div>
          <Link to={isAuthenticated() ? '/dashboard' : '/'} className="inline-flex items-center text-xs font-semibold text-text-muted hover:text-text-primary transition-colors mb-4">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> {isAuthenticated() ? 'Back to Workspace Overview' : 'Back to Home'}
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">System Architecture & Docs</h1>
            <span className="badge badge-emerald">v2.4 Technical Specification</span>
          </div>
          <p className="text-xs text-text-muted leading-relaxed">
            Technical reference covering Resumify AI's multi-tier inference pipeline, database models, REST surface, and design system.
          </p>
        </div>

        <div className="space-y-6">

          {/* ── Layered Architecture Diagram ── */}
          <section className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <div className="w-8 h-8 rounded-xl bg-accent-soft border border-accent/25 flex items-center justify-center text-[var(--color-accent-strong)]">
                <Network className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Layered Architecture</h2>
                <p className="text-[11px] text-text-muted">Request flow from browser to storage.</p>
              </div>
            </div>

            <div className="p-5 bg-raised rounded-2xl border border-border shadow-inner space-y-2.5">
              {[
                { layer: 'Client Layer', detail: 'React 19 SPA · Vite dev server · axios with JWT bearer interceptor', tone: 'accent' },
                { layer: 'API Layer', detail: 'Spring Boot REST controllers · /api/v1 · JwtAuthFilter guards protected routes', tone: 'neutral' },
                { layer: 'Service Layer', detail: 'AuthService · ResumeService (upload → analyze → persist) · AIAnalysisService', tone: 'neutral' },
                { layer: 'AI Inference', detail: 'Groq LLM (llama-3.3-70b) with structured JSON output → deterministic heuristic fallback', tone: 'purple' },
                { layer: 'Persistence', detail: 'H2 (dev) / PostgreSQL 15 (prod) · Flyway migrations · JPA entities: User, Resume, Analysis', tone: 'success' },
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold font-mono shrink-0 border"
                    style={{
                      color: 'var(--color-text-secondary)',
                      background: 'var(--color-surface-2)',
                      borderColor: 'var(--color-border)',
                    }}>
                    {i + 1}
                  </div>
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5">
                    <span className={`text-xs font-bold ${row.tone === 'accent' ? 'text-[var(--color-accent-strong)]' : row.tone === 'purple' ? 'text-purple-500' : row.tone === 'success' ? 'text-[var(--color-success)]' : 'text-text-primary'}`}>
                      {row.layer}
                    </span>
                    <span className="text-[11px] text-text-muted font-mono">{row.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Tech Stack ── */}
          <section className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <div className="w-8 h-8 rounded-xl bg-accent-soft border border-accent/25 flex items-center justify-center text-[var(--color-accent-strong)]">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Enterprise Tech Stack</h2>
                <p className="text-[11px] text-text-muted">Core architectural components and frameworks.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-raised border border-border space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-accent-strong)]">
                  <Code className="w-4 h-4" /> Frontend Layer
                </div>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  React 19, Vite, TailwindCSS v4, Framer Motion, TypeScript 6 for high-frame-rate user interfaces.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-raised border border-border space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-success)]">
                  <Database className="w-4 h-4" /> Backend & Database
                </div>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  Spring Boot 3 + Java 17 REST API, PostgreSQL 15 / H2 persistence with JPA + Flyway migrations.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-raised border border-border space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-500">
                  <Cpu className="w-4 h-4" /> AI Inference Engine
                </div>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  Groq LLaMA-3 LPU hardware acceleration providing sub-1.5 second ATS analysis times.
                </p>
              </div>
            </div>
          </section>

          {/* ── REST API Reference ── */}
          <section className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <div className="w-8 h-8 rounded-xl bg-[var(--color-success-soft)] border border-[color:var(--color-success)]/25 flex items-center justify-center text-[var(--color-success)]">
                <Table2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">REST API Reference</h2>
                <p className="text-[11px] text-text-muted">Base URL: <code className="font-mono text-text-secondary">http://localhost:8080</code></p>
              </div>
            </div>

            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2 pr-3 text-[10px] font-bold uppercase tracking-widest text-text-subtle">Method</th>
                    <th className="py-2 pr-3 text-[10px] font-bold uppercase tracking-widest text-text-subtle">Endpoint</th>
                    <th className="py-2 pr-3 text-[10px] font-bold uppercase tracking-widest text-text-subtle">Auth</th>
                    <th className="py-2 text-[10px] font-bold uppercase tracking-widest text-text-subtle">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {apiEndpoints.map((ep) => (
                    <tr key={ep.path} className="border-b border-border/60 last:border-0">
                      <td className="py-2.5 pr-3">
                        <span className={`badge ${ep.method === 'GET' ? 'badge-blue' : ep.method === 'POST' ? 'badge-emerald' : 'badge-amber'}`}>
                          {ep.method}
                        </span>
                      </td>
                      <td className="py-2.5 pr-3 font-mono text-[11px] text-text-primary whitespace-nowrap">{ep.path}</td>
                      <td className="py-2.5 pr-3">
                        <span className={`text-[10px] font-bold ${ep.auth ? 'text-[var(--color-warning)]' : 'text-text-subtle'}`}>
                          {ep.auth ? 'Bearer' : 'Public'}
                        </span>
                      </td>
                      <td className="py-2.5 text-[11px] text-text-muted">{ep.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Data Model ── */}
          <section className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <div className="w-8 h-8 rounded-xl bg-[var(--color-warning-soft)] border border-[color:var(--color-warning)]/25 flex items-center justify-center text-[var(--color-warning)]">
                <FileJson className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Data Model</h2>
                <p className="text-[11px] text-text-muted">Three entities, one-to-many with strict ownership scoping.</p>
              </div>
            </div>

            <div className="space-y-3">
              {dataModel.map((m) => (
                <div key={m.entity} className="p-4 rounded-xl bg-raised border border-border">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-extrabold text-text-primary font-mono">{m.entity}</span>
                    <span className="text-[10px] text-text-muted font-medium">{m.note}</span>
                  </div>
                  <p className="text-[11px] font-mono text-text-secondary leading-relaxed">{m.fields}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── AI Inference Pipeline ── */}
          <section className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
                <Workflow className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">AI Processing Pipeline</h2>
                <p className="text-[11px] text-text-muted">Document lifecycle from client upload to structured ATS output.</p>
              </div>
            </div>

            <div className="p-6 bg-raised rounded-2xl border border-border shadow-inner">
              <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-accent-soft border border-accent/30 text-[var(--color-accent-strong)] text-center w-full md:w-auto">
                  <p className="font-bold">1. File Dropzone</p>
                  <span className="text-[10px] text-text-muted">PDF / TXT Parsing</span>
                </div>
                <div className="text-text-subtle font-bold hidden md:block">→</div>
                <div className="p-3.5 rounded-xl bg-raised border border-border text-text-primary text-center w-full md:w-auto">
                  <p className="font-bold">2. Text Normalization</p>
                  <span className="text-[10px] text-text-muted">Clean Tokens</span>
                </div>
                <div className="text-text-subtle font-bold hidden md:block">→</div>
                <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-500 text-center w-full md:w-auto">
                  <p className="font-bold">3. Groq LPU Engine</p>
                  <span className="text-[10px] text-text-muted">LLaMA-3 Inference</span>
                </div>
                <div className="text-text-subtle font-bold hidden md:block">→</div>
                <div className="p-3.5 rounded-xl bg-[var(--color-success-soft)] border border-[color:var(--color-success)]/30 text-[var(--color-success)] text-center w-full md:w-auto">
                  <p className="font-bold">4. ATS Matrix</p>
                  <span className="text-[10px] text-text-muted">JSON Output</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-raised border border-border space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-subtle">Prompt Strategy</p>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  A single structured prompt drives both stages. The analyzer prompt is a weighted ATS rubric (keyword match,
                  structure, measurable impact, readability) that emits strict JSON via <code className="font-mono text-text-muted">response_format: json_object</code>.
                  Temperature is kept at 0.3 for deterministic scoring.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-raised border border-border space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-subtle">Resilience Chain</p>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  If the provider is unreachable or unconfigured, a deterministic heuristic engine computes the ATS score,
                  skills, insights, and improvements directly from the resume text — every profile still gets unique output.
                </p>
              </div>
            </div>
          </section>

          {/* ── Configuration ── */}
          <section className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <div className="w-8 h-8 rounded-xl bg-[var(--color-danger-soft)] border border-[color:var(--color-danger)]/25 flex items-center justify-center text-[var(--color-danger)]">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Environment Configuration</h2>
                <p className="text-[11px] text-text-muted">All secrets are injected via environment variables.</p>
              </div>
            </div>

            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2 pr-3 text-[10px] font-bold uppercase tracking-widest text-text-subtle">Variable</th>
                    <th className="py-2 pr-3 text-[10px] font-bold uppercase tracking-widest text-text-subtle">Default</th>
                    <th className="py-2 text-[10px] font-bold uppercase tracking-widest text-text-subtle">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {envVars.map((v) => (
                    <tr key={v.var} className="border-b border-border/60 last:border-0">
                      <td className="py-2.5 pr-3 font-mono text-[11px] text-[var(--color-accent-strong)] whitespace-nowrap">{v.var}</td>
                      <td className="py-2.5 pr-3 font-mono text-[11px] text-text-muted">{v.default}</td>
                      <td className="py-2.5 text-[11px] text-text-muted">{v.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Security & Compliance ── */}
          <section className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <div className="w-8 h-8 rounded-xl bg-[var(--color-success-soft)] border border-[color:var(--color-success)]/25 flex items-center justify-center text-[var(--color-success)]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Security & Compliance</h2>
                <p className="text-[11px] text-text-muted">Data protection standards and workspace isolation.</p>
              </div>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              All candidate documents are encrypted at rest using AES-256 and in transit via TLS 1.3. Resume text processed by Groq inference engines is never used to train public LLM models, guaranteeing strict corporate confidentiality. API access is authenticated with signed JWT bearer tokens (24-hour expiry), and every resume query is scoped to the owning user to prevent IDOR access.
            </p>
          </section>

        </div>
      </div>
    </AppLayout>
  );
}
