import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { FileText, AlertCircle, Loader2, Download, TrendingUp, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import api from '../lib/api';
import html2pdf from 'html2pdf.js';

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
}

const statusConfig: Record<string, { label: string; style: string; dot: string }> = {
  UPLOADED:   { label: 'Uploaded',   style: 'text-amber-400 bg-amber-500/10 border-amber-500/30',  dot: 'bg-amber-400'  },
  PROCESSING: { label: 'Processing', style: 'text-blue-400 bg-blue-500/10 border-blue-500/30 animate-pulse', dot: 'bg-blue-400'   },
  ANALYZED:   { label: 'Analyzed',   style: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', dot: 'bg-emerald-400' },
  FAILED:     { label: 'Failed',     style: 'text-rose-400 bg-rose-500/10 border-rose-500/30',      dot: 'bg-rose-400'   },
};

function ScoreGauge({ score }: { score: number }) {
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (circumference * score) / 100;
  const color = score > 75 ? '#34d399' : score > 50 ? '#fbbf24' : '#f87171';
  const label = score > 75 ? 'Great' : score > 50 ? 'Fair' : 'Needs Work';
  const labelColor = score > 75 ? 'text-emerald-400' : score > 50 ? 'text-amber-400' : 'text-rose-400';

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
          <circle
            cx="64" cy="64" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)', filter: `drop-shadow(0 0 8px ${color}60)` }}
          />
        </svg>
        <div className="z-10 text-center">
          <span className="text-4xl font-black text-white leading-none">{score}</span>
          <span className="text-xs text-slate-500 font-medium block mt-0.5">/ 100</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">ATS Score</p>
        <span className={`text-sm font-bold ${labelColor}`}>{label}</span>
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

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const resumeRes = await api.get(`/resumes/${id}`);
      setResume(resumeRes.data);
      if (resumeRes.data.hasAnalysis) {
        const analysisRes = await api.get(`/resumes/${id}/analysis`);
        setAnalysis(analysisRes.data);
      }
    } catch {
      setError('Failed to load resume details.');
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = () => {
    const element = document.getElementById('analysis-content');
    if (!element) return;
    html2pdf().set({
      margin: [0.5, 0.5] as [number, number],
      filename: `Analysis_${resume?.fileName || 'Resume'}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const },
    }).from(element).save();
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-40 gap-5">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="text-slate-400 font-medium text-sm">Loading resume details...</p>
        </div>
      </AppLayout>
    );
  }

  if (error || !resume) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto px-6 py-16 flex justify-center">
          <div className="glass-card p-12 text-center w-full">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-4 text-rose-400">
              <AlertCircle className="w-7 h-7" />
            </div>
            <p className="text-rose-400 font-bold text-base mb-5">{error || 'Resume not found'}</p>
            <Link to="/dashboard" className="btn-secondary btn-sm">← Back to Dashboard</Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  const statusInfo = statusConfig[resume.status] || {
    label: resume.status,
    style: 'text-slate-400 bg-slate-800 border-slate-700',
    dot: 'bg-slate-400',
  };

  const skills = analysis?.skills
    ? (Array.isArray(analysis.skills)
        ? analysis.skills
        : (analysis.skills as unknown as string).split(',').map((s: string) => s.trim()).filter(Boolean))
    : [];

  const improvements = analysis?.improvements?.length
    ? analysis.improvements
    : analysis?.recommendations
        ? analysis.recommendations.split(';').map(s => s.trim()).filter(Boolean)
        : [];

  return (
    <AppLayout>
      <main className="max-w-5xl mx-auto px-6 sm:px-10 py-10 w-full">

        {/* ── Breadcrumb ── */}
        <div className="flex items-center gap-2 text-sm mb-8">
          <Link to="/dashboard" className="text-slate-500 hover:text-blue-400 transition-colors">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-white font-semibold truncate max-w-xs">{resume.fileName}</span>
        </div>

        {/* ── Header Card ── */}
        <div className="glass-card p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mb-8">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
              <FileText className="w-7 h-7 text-slate-300" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight mb-1.5">{resume.fileName}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                <p className="text-xs text-zinc-500">
                  Uploaded {new Date(resume.uploadedAt).toLocaleDateString('en-US', {
                    month: 'long', day: 'numeric', year: 'numeric',
                  })}
                </p>
                <span className={`badge border ${statusInfo.style}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                  {statusInfo.label}
                </span>
              </div>
            </div>
          </div>
          {analysis && (
            <div className="flex items-center gap-3 flex-shrink-0">
              <button onClick={exportPDF} className="btn-secondary btn-sm flex items-center gap-2">
                <Download className="w-4 h-4" /> Export PDF
              </button>
              <Link to={`/cover-letter?resumeId=${resume.id}`} className="btn-primary btn-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Cover Letter
              </Link>
            </div>
          )}
        </div>

        {/* ── Analysis Content ── */}
        {analysis ? (
          <div id="analysis-content" className="space-y-6">

            {/* ── Row 1: ATS Score + Summary ── */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

              {/* ATS Score */}
              <div className="glass-card p-8 flex items-center justify-center lg:col-span-1">
                <ScoreGauge score={analysis.atsScore ?? 0} />
              </div>

              {/* What's Already There */}
              <div className="glass-card p-8 lg:col-span-3">
                <div className="flex items-center gap-2.5 mb-5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <h2 className="text-base font-bold text-white tracking-tight">What's Already There</h2>
                </div>

                {/* Summary */}
                <p className="text-slate-300 text-[14px] leading-[1.9] mb-6 border-l-2 border-emerald-500/30 pl-4">
                  {analysis.summary}
                </p>

                {/* Stats row */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {analysis.experienceYears != null && (
                    <div className="px-4 py-2 rounded-xl bg-slate-900/60 border border-white/[0.06] text-center">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Experience</p>
                      <p className="text-lg font-black text-white">{analysis.experienceYears} yrs</p>
                    </div>
                  )}
                  {analysis.education && (
                    <div className="px-4 py-2 rounded-xl bg-slate-900/60 border border-white/[0.06] text-center">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Education</p>
                      <p className="text-sm font-semibold text-white leading-snug">{analysis.education}</p>
                    </div>
                  )}
                </div>

                {/* Skills */}
                {skills.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Detected Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, idx) => (
                        <span key={idx}
                          className="px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Row 2: Improvements Needed ── */}
            <div className="glass-card p-8">
              <div className="flex items-center gap-2.5 mb-6">
                <TrendingUp className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <h2 className="text-base font-bold text-white tracking-tight">Improvements Needed</h2>
              </div>
              {improvements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {improvements.map((imp, i) => (
                    <div key={i} className="flex gap-3 p-4 rounded-xl bg-amber-500/[0.05] border border-amber-500/15">
                      <span className="text-amber-400 font-bold text-sm flex-shrink-0 mt-0.5">→</span>
                      <p className="text-slate-300 text-[13.5px] leading-relaxed">{imp}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm">No specific improvements identified. Resume looks solid!</p>
              )}
            </div>

          </div>

        ) : resume.status === 'FAILED' ? (
          <div className="glass-card p-14 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto mb-5">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Analysis Unsuccessful</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-6 leading-relaxed">
              The AI model could not process this resume. Please try re-uploading with clean plain text formatting.
            </p>
            <Link to="/upload" className="btn-primary btn-sm">Re-upload Resume</Link>
          </div>
        ) : (
          <div className="glass-card p-14 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto mb-5 animate-pulse">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Analysis in Progress</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto">
              Your resume is queued for AI evaluation. Refresh the page shortly to view results.
            </p>
          </div>
        )}

      </main>
    </AppLayout>
  );
}
