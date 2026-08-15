import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { FileText, AlertCircle, Loader2, Download, TrendingUp, Sparkles, CheckCircle2, ChevronRight, Copy, Check, Filter, Lightbulb } from 'lucide-react';
import api from '../lib/api';

interface ResumeDetail {
  id: string;
  fileName: string;
  status: string;
  uploadedAt: string;
  hasAnalysis: boolean;
}

interface AnalysisDetail {
  id: string;
  summary: string;
  skills: string[];
  experienceYears: number | null;
  education: string;
  recommendations: string;
  atsScore?: number;
  insights?: string[];
  improvements?: string[];
  analyzedAt: string;
  source?: string; // 'groq' | 'heuristic'
}

const statusConfig: Record<string, { label: string; badgeClass: string }> = {
  UPLOADED:   { label: 'Uploaded',   badgeClass: 'badge-amber'  },
  PROCESSING: { label: 'Processing', badgeClass: 'badge-blue'   },
  ANALYZED:   { label: 'Analyzed',   badgeClass: 'badge-emerald' },
  FAILED:     { label: 'Failed',     badgeClass: 'badge-rose'   },
};

function ScoreGauge({ score }: { score: number }) {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (circumference * score) / 100;
  const tone = score >= 75 ? 'var(--color-success)' : score >= 50 ? 'var(--color-warning)' : 'var(--color-danger)';
  const glow = `drop-shadow(0 0 10px color-mix(in oklab, ${tone} 30%, transparent))`;
  const label = score >= 75 ? 'Superior' : score >= 50 ? 'Moderate' : 'Needs Work';
  const badgeClass = score >= 75 ? 'badge-emerald' : score >= 50 ? 'badge-amber' : 'badge-rose';

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 136 136">
          <circle cx="68" cy="68" r={radius} fill="none" stroke="var(--color-border)" strokeWidth="12" />
          <circle
            cx="68" cy="68" r={radius}
            fill="none"
            stroke={tone}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)', filter: glow }}
          />
        </svg>
        <div className="z-10 text-center">
          <span className="text-4xl font-black text-text-primary leading-none tracking-tight">{score}</span>
          <span className="text-xs text-text-muted font-mono block mt-0.5">/ 100</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">ATS Compatibility Rating</p>
        <span className={`badge ${badgeClass}`}>{label} Match</span>
      </div>
    </div>
  );
}

export default function ResumeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [resume, setResume] = useState<ResumeDetail | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'improvements'>('overview');
  const [copied, setCopied] = useState(false);
  const [skillSearch, setSkillSearch] = useState('');

  // Keeps the latest status readable inside the polling interval without
  // restarting it on every render.
  const resumeRef = useRef<ResumeDetail | null>(null);
  resumeRef.current = resume;

  useEffect(() => {
    let stop = false;
    const fetchData = async () => {
      try {
        const resumeRes = await api.get(`/resumes/${id}`);
        if (stop) return;
        setResume(resumeRes.data);
        if (resumeRes.data.hasAnalysis) {
          const analysisRes = await api.get(`/resumes/${id}/analysis`);
          if (stop) return;
          setAnalysis(analysisRes.data);
        }
        setError('');
      } catch {
        if (!stop) setError('Failed to load candidate resume details.');
      } finally {
        if (!stop) setLoading(false);
      }
    };

    fetchData();

    // Poll while the background analysis is still running (async upload flow),
    // then stop once the resume reaches a terminal state.
    const isTerminal = (status?: string) => status === 'ANALYZED' || status === 'FAILED';
    const interval = setInterval(async () => {
      if (stop) return;
      if (isTerminal(resumeRef.current?.status)) {
        clearInterval(interval);
        return;
      }
      await fetchData();
    }, 3000);

    return () => {
      stop = true;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const exportPDF = async () => {
    const element = document.getElementById('analysis-content');
    if (!element) return;
    const { default: html2pdf } = await import('html2pdf.js');
    html2pdf().set({
      margin: [0.5, 0.5] as [number, number],
      filename: `Analysis_${resume?.fileName || 'Resume'}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const },
    }).from(element).save();
  };

  const exportWord = async () => {
    if (!analysis) return;
    const { Document, Packer, Paragraph, HeadingLevel } = await import('docx');
    const { saveAs } = await import('file-saver');
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({ text: `Resume AI Analysis for ${resume?.fileName}`, heading: HeadingLevel.HEADING_1 }),
          new Paragraph({ text: `ATS Compatibility Score: ${analysis.atsScore ?? 0}/100`, heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "Executive Summary", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: analysis.summary }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "Actionable Recommendations", heading: HeadingLevel.HEADING_2 }),
          ...(improvements.map(imp => new Paragraph({ text: `• ${imp}` }))),
        ],
      }],
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Analysis_${resume?.fileName || 'Resume'}.docx`);
  };

  const copyToClipboard = () => {
    if (!analysis) return;
    const text = `Resume Analysis for ${resume?.fileName}\n\nATS Score: ${analysis.atsScore ?? 0}/100\n\nSummary:\n${analysis.summary}\n\nImprovements:\n${improvements.map(i => `• ${i}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-40 gap-5">
          <Loader2 className="w-10 h-10 text-[var(--color-accent-strong)] animate-spin" />
          <p className="text-text-muted font-semibold text-xs">Parsing candidate analysis data...</p>
        </div>
      </AppLayout>
    );
  }

  if (error || !resume) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto px-6 py-16 flex justify-center">
          <div className="glass-card p-12 text-center w-full">
            <div className="w-14 h-14 rounded-2xl bg-[var(--color-danger-soft)] border border-[color:var(--color-danger)]/20 flex items-center justify-center mx-auto mb-4 text-[var(--color-danger)]">
              <AlertCircle className="w-7 h-7" />
            </div>
            <p className="text-[var(--color-danger)] font-bold text-sm mb-5">{error || 'Resume document not found'}</p>
            <Link to="/dashboard" className="btn-secondary btn-sm">← Return to Overview</Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  const statusInfo = statusConfig[resume.status] || {
    label: resume.status,
    badgeClass: 'badge-zinc',
  };

  const skills = analysis?.skills
    ? (Array.isArray(analysis.skills)
        ? analysis.skills
        : (analysis.skills as unknown as string).split(',').map((s: string) => s.trim()).filter(Boolean))
    : [];

  const filteredSkills = skills.filter(s => s.toLowerCase().includes(skillSearch.toLowerCase()));

  const improvements = analysis?.improvements?.length
    ? analysis.improvements
    : analysis?.recommendations
        ? analysis.recommendations.split(';').map(s => s.trim()).filter(Boolean)
        : [];

  return (
    <AppLayout>
      <main className="max-w-5xl mx-auto py-4 w-full space-y-6">

        {/* ── Breadcrumb & Header Bar ── */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-xs">
            <Link to="/dashboard" className="text-text-muted hover:text-text-primary transition-colors">Overview</Link>
            <ChevronRight className="w-3.5 h-3.5 text-text-subtle" />
            <span className="text-text-primary font-semibold truncate max-w-xs">{resume.fileName}</span>
          </div>

          {analysis && (
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={copyToClipboard} className="btn-secondary btn-sm py-1.5 px-3 text-xs font-semibold cursor-pointer">
                {copied ? <Check className="w-3.5 h-3.5 text-[var(--color-success)] mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copied ? 'Copied' : 'Copy Summary'}
              </button>
              <button onClick={exportWord} className="btn-secondary btn-sm py-1.5 px-3 text-xs font-semibold cursor-pointer">
                <FileText className="w-3.5 h-3.5 mr-1" /> DOCX
              </button>
              <button onClick={exportPDF} className="btn-secondary btn-sm py-1.5 px-3 text-xs font-semibold cursor-pointer">
                <Download className="w-3.5 h-3.5 mr-1" /> PDF
              </button>
              <Link to={`/cover-letter?resumeId=${resume.id}`} className="btn-primary btn-sm py-1.5 px-3 text-xs font-bold shadow-md shadow-accent/20">
                <Sparkles className="w-3.5 h-3.5 mr-1" /> Cover Letter
              </Link>
            </div>
          )}
        </div>

        {/* ── Document Overview Header Card ── */}
        <div className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-accent-soft border border-accent/25 flex items-center justify-center flex-shrink-0 text-[var(--color-accent-strong)]">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-black text-text-primary tracking-tight">{resume.fileName}</h1>
                <span className={`badge ${statusInfo.badgeClass}`}>{statusInfo.label}</span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] tabular">
                Uploaded {new Date(resume.uploadedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · ID: {resume.id}
              </p>
            </div>
          </div>
        </div>

        {/* ── Analysis Content ── */}
        {analysis ? (
          <div id="analysis-content" className="space-y-6">

            {/* Navigation Tabs */}
            <div className="flex border-b border-border gap-6 text-xs font-bold select-none">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'overview' ? 'border-accent text-text-primary' : 'border-transparent text-text-muted hover:text-text-primary'
                }`}
              >
                Executive Overview
              </button>
              <button
                onClick={() => setActiveTab('skills')}
                className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'skills' ? 'border-accent text-text-primary' : 'border-transparent text-text-muted hover:text-text-primary'
                }`}
              >
                Skills Matrix ({skills.length})
              </button>
              <button
                onClick={() => setActiveTab('improvements')}
                className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'improvements' ? 'border-accent text-text-primary' : 'border-transparent text-text-muted hover:text-text-primary'
                }`}
              >
                Action Plan ({improvements.length})
              </button>
            </div>

            {/* TAB 1: EXECUTIVE OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Score Gauge Card */}
                <div className="glass-card p-6 flex flex-col items-center justify-center lg:col-span-1">
                  <ScoreGauge score={analysis.atsScore ?? 85} />
                  
                  <div className="w-full border-t border-border pt-4 mt-4 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-text-muted font-medium">Total Experience</span>
                      <span className="text-[var(--color-text-secondary)] font-bold tabular">{analysis.experienceYears ?? '—'} yrs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted font-medium">Skills Detected</span>
                      <span className="text-[var(--color-text-secondary)] font-bold tabular">{skills.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted font-medium">Action Items</span>
                      <span className="text-[var(--color-text-secondary)] font-bold tabular">{improvements.length}</span>
                    </div>
                  </div>
                </div>

                {/* Summary & Key Metrics Card */}
                <div className="glass-card p-6 lg:col-span-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" />
                      <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Candidate Executive Summary</h2>
                      {analysis.source && (
                        <span
                          className={`badge ${analysis.source === 'groq' ? 'badge-emerald' : 'badge-amber'}`}
                          title={analysis.source === 'groq'
                            ? 'Produced by the Groq LLM from this resume\'s text'
                            : 'Groq was unavailable — produced by the built-in deterministic engine from this resume\'s text'}
                        >
                          {analysis.source === 'groq' ? 'Groq AI Analysis' : 'Heuristic Fallback'}
                        </span>
                      )}
                    </div>

                    <p className="text-text-secondary text-xs sm:text-sm leading-relaxed mb-6 border-l-2 border-[color:var(--color-success)]/45 pl-4 py-1">
                      {analysis.summary}
                    </p>

                    {/* Metadata Badges */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {analysis.experienceYears != null && (
                        <div className="p-3.5 rounded-xl bg-raised border border-border">
                          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Total Experience</p>
                          <p className="text-xl font-extrabold text-text-primary mt-1">{analysis.experienceYears} Years</p>
                        </div>
                      )}
                      {analysis.education && (
                        <div className="p-3.5 rounded-xl bg-raised border border-border">
                          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Education Credential</p>
                          <p className="text-xs font-semibold text-text-primary mt-1 truncate">{analysis.education}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Top Skills Preview */}
                  {skills.length > 0 && (
                    <div className="pt-4 border-t border-border">
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2.5">Key Detected Skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {skills.slice(0, 8).map((skill, idx) => (
                          <span key={idx} className="px-2.5 py-1 text-xs font-semibold text-[var(--color-success)] bg-[var(--color-success-soft)] border border-[color:var(--color-success)]/25 rounded-lg">
                            {skill}
                          </span>
                        ))}
                        {skills.length > 8 && (
                          <button onClick={() => setActiveTab('skills')} className="text-xs text-[var(--color-accent-strong)] hover:underline font-semibold self-center ml-1">
                            +{skills.length - 8} more...
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 2: DETECTED SKILLS MATRIX */}
            {activeTab === 'skills' && (
              <div className="glass-card p-6 space-y-6">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-border">
                  <div>
                    <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Skill Matrix & Competencies</h2>
                    <p className="text-xs text-text-muted mt-0.5">Extracted tech stack, frameworks, tools, and domain expertise.</p>
                  </div>
                  <div className="relative w-64">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                    <input 
                      type="text" 
                      placeholder="Filter skills..." 
                      value={skillSearch}
                      onChange={(e) => setSkillSearch(e.target.value)}
                      className="form-input py-1.5 pl-9 text-xs bg-raised"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {filteredSkills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1.5 text-xs font-semibold text-[var(--color-accent-strong)] bg-accent-soft border border-accent/25 rounded-xl hover:border-accent-strong transition-colors">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: ACTION PLAN & IMPROVEMENTS */}
            {activeTab === 'improvements' && (
              <div className="glass-card p-6 space-y-6">
                <div className="flex items-center gap-2.5 pb-4 border-b border-border">
                  <TrendingUp className="w-5 h-5 text-[var(--color-warning)]" />
                  <div>
                    <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Candidate Enhancement Plan</h2>
                    <p className="text-xs text-text-muted mt-0.5">AI recommendations to maximize ATS score match.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {improvements.map((imp, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-[var(--color-warning-soft)] border border-[color:var(--color-warning)]/20 flex gap-3">
                      <Lightbulb className="w-5 h-5 text-[var(--color-warning)] flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-text-secondary leading-relaxed font-medium">
                        {imp}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        ) : (
          <div className="glass-card p-14 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-accent-soft border border-accent/25 flex items-center justify-center text-[var(--color-accent-strong)] mx-auto mb-4 animate-pulse">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Groq AI Inference in Progress</h3>
            <p className="text-text-muted text-xs max-w-sm mx-auto">
              Your document is currently being evaluated by the ATS scoring model.
            </p>
          </div>
        )}

      </main>
    </AppLayout>
  );
}

