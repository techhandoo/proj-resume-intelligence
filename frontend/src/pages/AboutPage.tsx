import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { ArrowLeft, Server, Code, Layers, ShieldCheck, Cpu, Database } from 'lucide-react';

export default function AboutPage() {
  return (
    <AppLayout>
      <div className="w-full max-w-4xl mx-auto space-y-8 pb-16">
        
        {/* Header */}
        <div>
          <Link to="/dashboard" className="inline-flex items-center text-xs font-semibold text-text-muted hover:text-text-primary transition-colors mb-4">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Workspace Overview
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">System Architecture & Docs</h1>
            <span className="badge badge-emerald">v2.4 Technical Specification</span>
          </div>
          <p className="text-xs text-text-muted leading-relaxed">
            Technical reference covering Resumify AI's multi-tier inference pipeline, database models, and design system.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          
          {/* Tech Stack Card */}
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
                  Node.js Express REST API, PostgreSQL database with Prisma ORM data validation layer.
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

          {/* AI Pipeline Architecture Diagram */}
          <section className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">AI Processing Flowchart</h2>
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
          </section>

          {/* Design System Principles */}
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
              All candidate documents are encrypted at rest using AES-256 and in transit via TLS 1.3. Resume text processed by Groq inference engines is never used to train public LLM models, guaranteeing strict corporate confidentiality.
            </p>
          </section>

        </div>
      </div>
    </AppLayout>
  );
}

