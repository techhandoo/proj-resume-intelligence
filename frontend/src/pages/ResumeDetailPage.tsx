import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
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
}

const statusConfig: Record<string, { label: string; style: string; dot: string }> = {
  UPLOADED: { label: 'Uploaded', style: 'text-amber-400 bg-amber-500/10 border-amber-500/30', dot: 'bg-amber-400' },
  PROCESSING: { label: 'Processing', style: 'text-blue-400 bg-blue-500/10 border-blue-500/30 animate-pulse', dot: 'bg-blue-400' },
  ANALYZED: { label: 'Analyzed', style: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', dot: 'bg-emerald-400' },
  FAILED: { label: 'Failed', style: 'text-rose-400 bg-rose-500/10 border-rose-500/30', dot: 'bg-rose-400' },
};

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
    } catch (err: any) {
      setError('Failed to load resume details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="vibrant-bg min-h-screen relative">
        <div className="vibrant-overlay" />
        <div className="relative z-10">
          <Navbar />
          <div className="flex flex-col items-center justify-center py-40 gap-5">
            <div className="w-12 h-12 rounded-full border-[3px] border-blue-500/20 border-t-blue-500 animate-spin" />
            <p className="text-slate-400 font-medium text-sm">Loading resume details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="vibrant-bg min-h-screen relative">
        <div className="vibrant-overlay" />
        <div className="relative z-10">
          <Navbar />
          <div className="max-w-2xl mx-auto px-6 py-16 flex justify-center">
            <div className="glass-card p-12 text-center w-full">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-4 text-rose-400 text-2xl">
                ⚠
              </div>
              <p className="text-rose-400 font-bold text-base mb-5 text-center">{error || 'Resume not found'}</p>
              <Link to="/dashboard" className="btn-secondary btn-sm">
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = statusConfig[resume.status] || {
    label: resume.status,
    style: 'text-slate-400 bg-slate-800 border-slate-700',
    dot: 'bg-slate-400',
  };

  return (
    <div className="vibrant-bg min-h-screen relative">
      <div className="vibrant-overlay" />
      <div className="relative z-10">
        <Navbar />

        <main className="max-w-4xl mx-auto px-6 sm:px-8 py-12 flex flex-col items-center">

          {/* Return Breadcrumb */}
          <div className="w-full flex justify-start mb-6">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-blue-400 transition-colors"
            >
              ← Return to Dashboard
            </Link>
          </div>

          {/* Master Centered Box Container */}
          <div className="w-full space-y-8">

            {/* Resume Header Card */}
            <div className="glass-card p-8 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-3xl shadow-inner mb-4">
                📄
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight text-center mb-2">
                {resume.fileName}
              </h1>
              <p className="text-sm text-slate-400 text-center mb-4">
                Uploaded{' '}
                {new Date(resume.uploadedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <span className={`badge border ${statusInfo.style}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                {statusInfo.label}
              </span>
            </div>

            <div className="section-divider" />

            {/* Analysis Content */}
            {analysis ? (
              <div className="space-y-8">

                {/* Top Row: ATS Score & Executive Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* ATS Score Gauge */}
                  <div className="glass-card p-8 flex flex-col items-center justify-center text-center lg:col-span-1">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">ATS Compatibility</h2>
                    <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-slate-900/50 border-[6px] border-slate-800 shadow-inner mb-4">
                      {/* Fake SVG Circle for Score */}
                      <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="58" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                        <circle 
                          cx="64" cy="64" r="58" fill="none" 
                          stroke={analysis.atsScore && analysis.atsScore > 75 ? '#34d399' : analysis.atsScore && analysis.atsScore > 50 ? '#fbbf24' : '#f87171'} 
                          strokeWidth="6" 
                          strokeDasharray="364" 
                          strokeDashoffset={364 - (364 * (analysis.atsScore || 0)) / 100}
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <span className="text-4xl font-black text-white z-10">{analysis.atsScore || '--'}</span>
                    </div>
                    <p className="text-xs text-slate-400">Score based on keyword density and formatting</p>
                  </div>

                  {/* Executive Summary */}
                  <div className="glass-card p-8 flex flex-col justify-center lg:col-span-2">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-blue-400">📝</span>
                      <h2 className="text-lg font-bold text-white tracking-tight">Executive Summary</h2>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-[15px] font-normal">
                      {analysis.summary}
                    </p>
                  </div>
                </div>

                {/* Skills & Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Extracted Skills */}
                  <div className="glass-card p-7 lg:col-span-2">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400">💡</span>
                      <h2 className="text-lg font-bold text-white tracking-tight">Technical & Soft Skills</h2>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {analysis.skills.map((skill, idx) => (
                        <span key={idx} className="px-3.5 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Candidate Profile Stats */}
                  <div className="glass-card p-7 flex flex-col gap-4 justify-center">
                    <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/[0.05]">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Experience</p>
                      <p className="text-2xl font-black text-white">{analysis.experienceYears != null ? `${analysis.experienceYears} Years` : 'N/A'}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/[0.05]">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Education</p>
                      <p className="text-sm font-semibold text-slate-200 leading-snug">{analysis.education || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                {/* AI Insights & Improvements */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Key Insights */}
                  <div className="glass-card p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400">🔍</span>
                      <h2 className="text-lg font-bold text-white tracking-tight">Key Insights</h2>
                    </div>
                    <ul className="space-y-4">
                      {(analysis.insights || []).map((insight, i) => (
                        <li key={i} className="flex gap-3 text-sm text-slate-300">
                          <span className="text-indigo-400 mt-0.5">•</span> {insight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actionable Improvements */}
                  <div className="glass-card p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="w-8 h-8 rounded-lg bg-rose-500/15 border border-rose-500/25 flex items-center justify-center text-rose-400">📈</span>
                      <h2 className="text-lg font-bold text-white tracking-tight">Actionable Improvements</h2>
                    </div>
                    <ul className="space-y-4">
                      {(analysis.improvements || []).map((imp, i) => (
                        <li key={i} className="flex gap-3 text-sm text-slate-300">
                          <span className="text-rose-400 mt-0.5">→</span> {imp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* AI Recommendations String (Legacy Fallback / Summary) */}
                <div className="glass-card p-6 border-l-4 border-l-blue-500 bg-blue-500/5">
                  <p className="text-sm text-slate-300 leading-relaxed italic">
                    "{analysis.recommendations}"
                  </p>
                </div>

                {/* Action Row */}
                <div className="flex justify-center pt-4">
                  <Link to={`/cover-letter?resumeId=${resume.id}`} className="btn-primary">
                    ✨ Generate Cover Letter
                  </Link>
                </div>

                {/* Footer Metadata */}
                <div className="text-center pb-4">
                  <p className="text-[11px] text-slate-500">
                    Processed via Groq LLaMA 3 Engine • {new Date(analysis.analyzedAt).toLocaleDateString()}
                  </p>
                </div>

              </div>

            ) : resume.status === 'FAILED' ? (
              <div className="glass-card p-14 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-3xl mx-auto mb-5">
                  ❌
                </div>
                <h3 className="text-xl font-bold text-white mb-3 text-center">Analysis Unsuccessful</h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto mb-6 text-center leading-relaxed">
                  The AI model could not process this resume. Please try re-uploading with clean plain text formatting.
                </p>
                <div className="flex justify-center">
                  <Link to="/upload" className="btn-primary btn-sm">
                    Re-upload Resume
                  </Link>
                </div>
              </div>

            ) : (
              <div className="glass-card p-14 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-3xl mx-auto mb-5 animate-pulse">
                  ⏳
                </div>
                <h3 className="text-xl font-bold text-white mb-2 text-center">Analysis in Progress</h3>
                <p className="text-slate-400 text-sm max-w-sm mx-auto text-center">
                  Your resume is queued for AI evaluation. Refresh the page shortly to view results.
                </p>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
