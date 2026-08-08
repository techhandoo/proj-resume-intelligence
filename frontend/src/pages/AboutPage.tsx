import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { ArrowLeft, Server, Code, Layers } from 'lucide-react';

export default function AboutPage() {
  return (
    <AppLayout>
      <div className="w-full max-w-3xl mx-auto pb-16">
        
        {/* Header */}
        <div className="mb-10">
          <Link to="/dashboard" className="inline-flex items-center text-[12px] font-medium text-zinc-500 hover:text-zinc-300 transition-colors mb-6">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-semibold text-zinc-100 tracking-tight mb-3">Documentation</h1>
          <p className="text-[14px] text-zinc-400 leading-relaxed">
            Everything you need to know about Resumify AI's architecture, models, and capabilities.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          
          <section className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded bg-[#171717] border border-[#1f1f22] flex items-center justify-center">
                <Server className="w-4 h-4 text-zinc-300" />
              </div>
              <h2 className="text-[16px] font-semibold text-zinc-100">System Architecture</h2>
            </div>
            <p className="text-[14px] text-zinc-400 leading-relaxed mb-4">
              Resumify is built on a high-performance stack designed for scale and enterprise reliability.
              The application utilizes modern technologies to ensure fast processing times and secure data handling.
            </p>
            <ul className="space-y-2 text-[13px] text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-zinc-600 mt-0.5">•</span>
                <span><strong>Frontend:</strong> React, Vite, Tailwind CSS v4, Framer Motion for highly responsive UI.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-600 mt-0.5">•</span>
                <span><strong>Backend API:</strong> Node.js & Express RESTful architecture.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-600 mt-0.5">•</span>
                <span><strong>Database:</strong> PostgreSQL & Prisma ORM.</span>
              </li>
            </ul>
          </section>

          <section className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded bg-[#171717] border border-[#1f1f22] flex items-center justify-center">
                <Layers className="w-4 h-4 text-zinc-300" />
              </div>
              <h2 className="text-[16px] font-semibold text-zinc-100">AI Processing Pipeline</h2>
            </div>
            <p className="text-[14px] text-zinc-400 leading-relaxed mb-4">
              Our analysis engine leverages the Groq platform to process text at blistering speeds.
              When a document is uploaded, it passes through three stages:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-md border border-[#1f1f22] bg-[#050505]">
                <h4 className="text-[13px] font-medium text-zinc-200 mb-1">1. Extraction</h4>
                <p className="text-[12px] text-zinc-500">PDFs and TXT files are normalized into raw tokens.</p>
              </div>
              <div className="p-4 rounded-md border border-[#1f1f22] bg-[#050505]">
                <h4 className="text-[13px] font-medium text-zinc-200 mb-1">2. Inference</h4>
                <p className="text-[12px] text-zinc-500">Groq LLM extracts skills and calculates experience metrics.</p>
              </div>
              <div className="p-4 rounded-md border border-[#1f1f22] bg-[#050505]">
                <h4 className="text-[13px] font-medium text-zinc-200 mb-1">3. Structuring</h4>
                <p className="text-[12px] text-zinc-500">JSON schema validation and database serialization.</p>
              </div>
            </div>
          </section>

          <section className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded bg-[#171717] border border-[#1f1f22] flex items-center justify-center">
                <Code className="w-4 h-4 text-zinc-300" />
              </div>
              <h2 className="text-[16px] font-semibold text-zinc-100">Design System</h2>
            </div>
            <p className="text-[14px] text-zinc-400 leading-relaxed">
              The user interface strictly adheres to an enterprise-grade aesthetic inspired by Vercel and Linear.
              This means prioritizing information density, monochromatic color schemes, legible typography (Outfit),
              and hyper-optimized micro-interactions over superfluous animations.
            </p>
          </section>

        </div>
      </div>
    </AppLayout>
  );
}
