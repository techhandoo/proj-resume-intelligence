import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../lib/api';

interface ResumeItem {
  id: string;
  fileName: string;
  status: string;
  uploadedAt: string;
  hasAnalysis: boolean;
}

const statusConfig: Record<string, { label: string; style: string; dot: string }> = {
  UPLOADED:   { label: 'Uploaded',   style: 'text-amber-400 bg-amber-500/10 border-amber-500/30',                    dot: 'bg-amber-400'  },
  PROCESSING: { label: 'Processing', style: 'text-blue-400 bg-blue-500/10 border-blue-500/30 animate-pulse',         dot: 'bg-blue-400'   },
  ANALYZED:   { label: 'Analyzed',   style: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',              dot: 'bg-emerald-400'},
  FAILED:     { label: 'Failed',     style: 'text-rose-400 bg-rose-500/10 border-rose-500/30',                       dot: 'bg-rose-400'   },
};

export default function DashboardPage() {
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError  ] = useState('');

  useEffect(() => { fetchResumes(); }, []);

  const fetchResumes = async () => {
    try {
      const res = await api.get('/resumes');
      setResumes(res.data);
    } catch {
      setError('Failed to load resumes. Please check the backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total:      resumes.length,
    analyzed:   resumes.filter((r) => r.status === 'ANALYZED').length,
    processing: resumes.filter((r) => r.status === 'PROCESSING').length,
    failed:     resumes.filter((r) => r.status === 'FAILED').length,
  };

  const statCards = [
    { label: 'Total Resumes',     value: stats.total,      gradient: 'from-blue-400 to-blue-500',     icon: '📄', iconBg: 'bg-blue-500/10 border-blue-500/20',    accent: 'hover:border-blue-500/25'    },
    { label: 'Analyzed',          value: stats.analyzed,   gradient: 'from-emerald-400 to-teal-400',  icon: '✅', iconBg: 'bg-emerald-500/10 border-emerald-500/20', accent: 'hover:border-emerald-500/25' },
    { label: 'In Queue',          value: stats.processing, gradient: 'from-amber-400 to-orange-400',  icon: '⏳', iconBg: 'bg-amber-500/10 border-amber-500/20',   accent: 'hover:border-amber-500/25'   },
    { label: 'Failed',            value: stats.failed,     gradient: 'from-rose-400 to-pink-500',     icon: '⚠️', iconBg: 'bg-rose-500/10 border-rose-500/20',     accent: 'hover:border-rose-500/25'    },
  ];

  return (
    <div className="vibrant-bg min-h-screen relative">
      <div className="vibrant-overlay" />
      <div className="relative z-10">
        <Navbar />

        <main className="max-w-[1440px] mx-auto px-8 sm:px-14 py-12">

          {/* ── Page Header ── */}
          <div className="flex flex-col items-center justify-center text-center gap-6 mb-12">
            <div>
              <h1 className="text-4xl sm:text-[2.5rem] font-extrabold text-white tracking-tight leading-tight">
                Resume Intelligence
              </h1>
              <p className="text-slate-400 text-[15.5px] leading-[1.85] mt-3 max-w-xl mx-auto">
                AI-driven candidate analysis, skill extraction, and resume recommendations.
              </p>
            </div>
            <Link to="/upload" className="btn-primary flex-shrink-0 px-8 py-3.5 shadow-lg shadow-blue-500/20">
              + Upload Resume
            </Link>
          </div>

          <div className="section-divider mb-10" />

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {statCards.map((stat) => (
              <div key={stat.label} className={`stat-card ${stat.accent}`}>
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                    {stat.label}
                  </p>
                  <p className={`text-[2.2rem] font-black leading-none bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.iconBg} border flex items-center justify-center text-xl flex-shrink-0`}>
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>

          <div className="section-divider mb-8" />

          {/* ── Resume Table Card ── */}
          <div className="glass-card overflow-hidden">

            {/* Header Bar */}
            <div className="px-8 py-5 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.012]">
              <h2 className="text-[15px] font-bold text-white flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                Resume Records
              </h2>
              <span className="text-[12px] font-semibold text-slate-500 bg-slate-800/60 px-3.5 py-1.5 rounded-full border border-slate-700/50">
                {resumes.length} {resumes.length === 1 ? 'entry' : 'entries'}
              </span>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-28 gap-5">
                <div className="w-11 h-11 rounded-full border-[3px] border-blue-500/20 border-t-blue-500 animate-spin" />
                <p className="text-[14px] font-medium text-slate-400 leading-relaxed">
                  Loading resume records...
                </p>
              </div>

            ) : error ? (
              <div className="py-16 text-center px-8">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-5 text-2xl">⚠</div>
                <p className="text-rose-400 font-semibold text-[15px] mb-2">Connection Error</p>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-sm mx-auto">{error}</p>
                <button onClick={fetchResumes} className="btn-secondary btn-sm">
                  Retry Connection
                </button>
              </div>

            ) : resumes.length === 0 ? (
              <div className="py-24 text-center px-8">
                <div className="w-20 h-20 rounded-3xl bg-blue-500/8 border border-blue-500/15 flex items-center justify-center text-4xl mx-auto mb-7">
                  📂
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  No resumes yet
                </h3>
                <p className="text-slate-400 text-[14px] leading-[1.8] max-w-md mx-auto mb-8">
                  Upload your first candidate resume to extract technical skills,
                  estimate years of experience, and receive AI-powered recommendations.
                </p>
                <Link to="/upload" className="btn-primary">
                  + Upload Your First Resume
                </Link>
              </div>

            ) : (
              <div className="overflow-x-auto">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Candidate File</th>
                      <th>Status</th>
                      <th>Upload Date</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resumes.map((resume) => {
                      const statusInfo = statusConfig[resume.status] || {
                        label: resume.status,
                        style: 'text-slate-400 bg-slate-800 border-slate-700',
                        dot:   'bg-slate-400',
                      };
                      return (
                        <tr key={resume.id}>
                          <td>
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-slate-800/70 border border-slate-700/50 flex items-center justify-center flex-shrink-0">
                                📄
                              </div>
                              <div className="space-y-1">
                                <p className="text-white font-semibold text-[14px] leading-tight">
                                  {resume.fileName}
                                </p>
                                <p className="text-[11px] text-slate-500 font-mono">
                                  #{resume.id.substring(0, 8)}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`badge border ${statusInfo.style}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                              {statusInfo.label}
                            </span>
                          </td>
                          <td>
                            <span className="text-[13px] text-slate-400 leading-relaxed">
                              {new Date(resume.uploadedAt).toLocaleDateString('en-US', {
                                month: 'short', day: 'numeric', year: 'numeric',
                              })}
                            </span>
                          </td>
                          <td className="text-right">
                            <Link to={`/resumes/${resume.id}`} className="btn-ghost btn-sm">
                              View Analysis →
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
