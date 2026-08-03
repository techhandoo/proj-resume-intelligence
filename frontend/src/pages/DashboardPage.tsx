import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { FileText, CheckCircle, Hourglass, AlertTriangle, FolderOpen, AlertCircle, UploadCloud } from 'lucide-react';
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
    { label: 'Total Resumes',     value: stats.total,      gradient: 'from-blue-400 to-indigo-400',   icon: <FileText className="w-5 h-5 text-blue-400" />, iconBg: 'bg-blue-500/10 border-blue-500/20',    accent: 'hover:border-blue-500/30 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]'    },
    { label: 'Analyzed',          value: stats.analyzed,   gradient: 'from-emerald-400 to-teal-400',  icon: <CheckCircle className="w-5 h-5 text-emerald-400" />, iconBg: 'bg-emerald-500/10 border-emerald-500/20', accent: 'hover:border-emerald-500/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]' },
    { label: 'In Queue',          value: stats.processing, gradient: 'from-amber-400 to-orange-400',  icon: <Hourglass className="w-5 h-5 text-amber-400" />, iconBg: 'bg-amber-500/10 border-amber-500/20',   accent: 'hover:border-amber-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]'   },
    { label: 'Failed',            value: stats.failed,     gradient: 'from-rose-400 to-pink-500',     icon: <AlertTriangle className="w-5 h-5 text-rose-400" />, iconBg: 'bg-rose-500/10 border-rose-500/20',     accent: 'hover:border-rose-500/30 hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]'    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <AppLayout>
      <main className="w-full flex flex-col items-center px-4 sm:px-8 py-10">
        <div className="w-full max-w-5xl flex flex-col items-center">
          
          {/* ── Hero Header ── */}
          <div className="mt-16 sm:mt-24 mb-16 w-full flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Overview
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
              Resume <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Intelligence</span>
            </h1>
            <p className="text-slate-400 text-[15px] sm:text-base max-w-xl leading-relaxed mb-10">
              AI-driven candidate analysis, skill extraction, and automated resume recommendations in one seamless pipeline.
            </p>
            <Link to="/upload" className="btn-primary group flex items-center gap-3 px-8 py-4 shadow-[0_0_20px_rgba(59,130,246,0.25)] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all">
              <UploadCloud className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
              Upload New Resume
            </Link>
          </div>

          {/* ── Stat Cards ── */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-16"
          >
            {statCards.map((stat) => (
              <motion.div variants={itemVariants} key={stat.label} className={`glass-card p-6 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1.5 ${stat.accent}`}>
                <div className={`w-14 h-14 rounded-2xl ${stat.iconBg} border flex items-center justify-center mb-5 shadow-lg`}>
                  {stat.icon}
                </div>
                <p className={`text-4xl font-black leading-none tracking-tight bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                  {stat.value}
                </p>
                <p className="text-[12px] font-bold uppercase tracking-widest text-zinc-500">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Resume Table Card ── */}
          <div className="w-full flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-6 px-2">
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
                Recent Records
              </h2>
              <span className="text-[12px] font-bold text-blue-400 bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20 uppercase tracking-widest">
                {resumes.length} {resumes.length === 1 ? 'entry' : 'entries'}
              </span>
            </div>

            <div className="w-full glass-card overflow-hidden border border-white/[0.05]">
              {/* Loading */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-6">
                  <div className="w-12 h-12 rounded-full border-[3px] border-blue-500/20 border-t-blue-500 animate-spin" />
                  <p className="text-[15px] font-medium text-slate-400">
                    Syncing records...
                  </p>
                </div>

              ) : error ? (
                <div className="py-24 flex flex-col items-center px-8 text-center">
                  <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6 text-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.15)]">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <p className="text-rose-400 font-bold text-lg mb-2">Connection Error</p>
                  <p className="text-slate-400 text-[15px] leading-relaxed mb-8 max-w-md mx-auto">{error}</p>
                  <button onClick={fetchResumes} className="btn-secondary px-8 py-3 rounded-xl font-semibold">
                    Retry Connection
                  </button>
                </div>

              ) : resumes.length === 0 ? (
                <div className="py-32 flex flex-col items-center px-8 text-center">
                  <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto mb-8 shadow-[0_0_40px_rgba(59,130,246,0.15)]">
                    <FolderOpen className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tight mb-3">
                    Workspace is empty
                  </h3>
                  <p className="text-slate-400 text-[15px] leading-[1.8] max-w-lg mx-auto mb-10">
                    You haven't processed any resumes yet. Upload a candidate document to automatically extract skills, calculate experience, and generate insights.
                  </p>
                  <Link to="/upload" className="btn-primary shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                    Upload First Document
                  </Link>
                </div>

              ) : (
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-white/[0.05] bg-black/20">
                        <th className="py-5 px-8 text-[12px] font-bold text-zinc-500 uppercase tracking-widest w-[40%]">Document</th>
                        <th className="py-5 px-8 text-[12px] font-bold text-zinc-500 uppercase tracking-widest w-[25%] text-center">Status</th>
                        <th className="py-5 px-8 text-[12px] font-bold text-zinc-500 uppercase tracking-widest w-[20%] text-center">Uploaded</th>
                        <th className="py-5 px-8 text-right w-[15%]"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                      {resumes.map((resume) => {
                        const statusInfo = statusConfig[resume.status] || {
                          label: resume.status,
                          style: 'text-slate-400 bg-slate-800/50 border-slate-700',
                          dot:   'bg-slate-400',
                        };
                        return (
                          <tr key={resume.id} className="group hover:bg-white/[0.02] transition-colors">
                            <td className="py-5 px-8">
                              <div className="flex items-center gap-5">
                                <div className="w-11 h-11 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                  <FileText className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                                </div>
                                <div className="flex flex-col justify-center">
                                  <p className="text-white font-bold text-[14.5px] leading-tight mb-1 truncate max-w-[200px] sm:max-w-[300px]">
                                    {resume.fileName}
                                  </p>
                                  <p className="text-[11px] text-zinc-500 font-mono tracking-wider">
                                    ID-{resume.id.substring(0, 8)}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-5 px-8 text-center">
                              <div className="flex justify-center">
                                <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase border ${statusInfo.style}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                                  {statusInfo.label}
                                </span>
                              </div>
                            </td>
                            <td className="py-5 px-8 text-center">
                              <span className="text-[13.5px] font-medium text-slate-400">
                                {new Date(resume.uploadedAt).toLocaleDateString('en-US', {
                                  month: 'short', day: 'numeric', year: 'numeric',
                                })}
                              </span>
                            </td>
                            <td className="py-5 px-8 text-right">
                              <Link to={`/resumes/${resume.id}`} className="inline-flex items-center justify-center px-4 py-2 text-[13px] font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors">
                                View →
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
          </div>

        </div>
      </main>
    </AppLayout>
  );
}
