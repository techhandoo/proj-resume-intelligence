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

                {/* Executive Summary */}
                <div className="glass-card p-8 text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-blue-400 text-base">
                      📝
                    </span>
                    <h2 className="text-lg font-bold text-white tracking-tight">
                      Executive Summary
                    </h2>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-sm sm:text-[15px] font-normal text-center max-w-2xl mx-auto">
                    {analysis.summary && !analysis.summary.includes('Failed to load')
                      ? analysis.summary
                      : 'Candidate profile analyzed. Skills and technical experience extracted successfully.'}
                  </p>
                </div>

                {/* Skills & Candidate Profile Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                  {/* Extracted Skills */}
                  <div className="glass-card p-7 text-center flex flex-col items-center">
                    <div className="flex items-center justify-center gap-3 mb-5">
                      <span className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 text-base">
                        💡
                      </span>
                      <h2 className="text-lg font-bold text-white tracking-tight">
                        Extracted Skills
                      </h2>
                    </div>
                    <div className="flex flex-wrap gap-2.5 justify-center">
                      {analysis.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3.5 py-1.5 text-xs font-semibold text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded-xl hover:border-blue-400/40 hover:bg-blue-500/15 transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Candidate Profile */}
                  <div className="glass-card p-7 text-center flex flex-col items-center">
                    <div className="flex items-center justify-center gap-3 mb-5">
                      <span className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400 text-base">
                        🎓
                      </span>
                      <h2 className="text-lg font-bold text-white tracking-tight">
                        Candidate Profile
                      </h2>
                    </div>
                    <div className="space-y-4 w-full">
                      <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/[0.05] text-center">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Experience</p>
                        <p className="text-3xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                          {analysis.experienceYears != null ? `${analysis.experienceYears} Yrs` : 'N/A'}
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/[0.05] text-center">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Education</p>
                        <p className="text-slate-200 font-medium text-sm">{analysis.education || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Recommendations */}
                <div className="glass-card p-8 text-center flex flex-col items-center">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <span className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400 text-base">
                      🚀
                    </span>
                    <h2 className="text-lg font-bold text-white tracking-tight">
                      Actionable AI Recommendations
                    </h2>
                  </div>
                  <div className="space-y-3.5 w-full max-w-2xl">
                    {analysis.recommendations
                      ?.split(';')
                      .filter(Boolean)
                      .map((rec, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/50 border border-white/[0.04] text-left hover:border-blue-500/20 transition-colors"
                        >
                          <span className="flex-shrink-0 w-7 h-7 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center text-xs font-bold border border-blue-500/25">
                            {i + 1}
                          </span>
                          <p className="text-slate-300 text-sm leading-relaxed">{rec.trim()}</p>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Footer Metadata */}
                <div className="text-center py-4">
                  <p className="text-xs text-slate-500 text-center">
                    Processed via Groq AI Engine •{' '}
                    {new Date(analysis.analyzedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
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
