import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  MoreHorizontal, 
  Search,
  Filter,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import api from '../lib/api';

interface ResumeItem {
  id: string;
  fileName: string;
  status: string;
  uploadedAt: string;
  hasAnalysis: boolean;
}

const statusConfig: Record<string, { label: string; textClass: string; bgClass: string; icon: any }> = {
  UPLOADED:   { label: 'Uploaded',   textClass: 'text-zinc-400', bgClass: 'bg-zinc-800', icon: Clock },
  PROCESSING: { label: 'Processing', textClass: 'text-blue-400', bgClass: 'bg-blue-500/10', icon: Activity },
  ANALYZED:   { label: 'Analyzed',   textClass: 'text-emerald-400', bgClass: 'bg-emerald-500/10', icon: CheckCircle2 },
  FAILED:     { label: 'Failed',     textClass: 'text-rose-400', bgClass: 'bg-rose-500/10', icon: AlertCircle },
};

const activityFeed = [
  { id: 1, title: 'John Doe Resume Analyzed', time: '2 mins ago', type: 'success' },
  { id: 2, title: 'System maintenance completed', time: '1 hour ago', type: 'info' },
  { id: 3, title: 'Failed to process PDF file', time: '3 hours ago', type: 'error' },
  { id: 4, title: 'New workspace member joined', time: '5 hours ago', type: 'info' },
  { id: 5, title: 'Weekly report generated', time: '1 day ago', type: 'success' },
];

export default function DashboardPage() {
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchResumes(); }, []);

  const fetchResumes = async () => {
    try {
      const res = await api.get('/resumes');
      setResumes(res.data);
    } catch {
      // Keep empty or show error toast
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

  return (
    <AppLayout>
      <div className="w-full flex flex-col space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight">Overview</h1>
            <p className="text-[13px] text-zinc-400 mt-1">Monitor your workspace metrics and recent resume analyses.</p>
          </div>
          <Link to="/upload" className="btn-primary">
            <Plus className="w-4 h-4 mr-1.5" /> New Analysis
          </Link>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="glass-card p-5">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[13px] font-medium text-zinc-400">Total Resumes</span>
              <FileText className="w-4 h-4 text-zinc-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-zinc-100">{stats.total}</span>
              <span className="text-[11px] font-medium text-emerald-400 flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> 12%
              </span>
            </div>
          </div>
          
          <div className="glass-card p-5">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[13px] font-medium text-zinc-400">Analyzed</span>
              <CheckCircle2 className="w-4 h-4 text-zinc-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-zinc-100">{stats.analyzed}</span>
              <span className="text-[11px] font-medium text-emerald-400 flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> 4%
              </span>
            </div>
          </div>

          <div className="glass-card p-5">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[13px] font-medium text-zinc-400">In Queue</span>
              <Clock className="w-4 h-4 text-zinc-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-zinc-100">{stats.processing}</span>
            </div>
          </div>

          <div className="glass-card p-5">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[13px] font-medium text-zinc-400">Failed</span>
              <AlertCircle className="w-4 h-4 text-zinc-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-zinc-100">{stats.failed}</span>
            </div>
          </div>
        </div>

        {/* Main Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Data Table (Spans 2 columns) */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="glass-card flex-1 flex flex-col">
              
              <div className="p-4 border-b border-[#1f1f22] flex items-center justify-between">
                <h2 className="text-[14px] font-semibold text-zinc-100">Recent Resumes</h2>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                    <input 
                      type="text" 
                      placeholder="Search..." 
                      className="bg-[#050505] border border-[#1f1f22] rounded-md py-1.5 pl-8 pr-3 text-[12px] text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                  <button className="p-1.5 border border-[#1f1f22] rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-[#171717] transition-colors">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left border-collapse text-[13px]">
                  <thead>
                    <tr className="border-b border-[#1f1f22] bg-[#050505]">
                      <th className="py-3 px-4 font-medium text-zinc-400 w-[50%]">Name</th>
                      <th className="py-3 px-4 font-medium text-zinc-400">Status</th>
                      <th className="py-3 px-4 font-medium text-zinc-400">Date</th>
                      <th className="py-3 px-4 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1f1f22]">
                    {loading ? (
                      [...Array(4)].map((_, i) => (
                        <tr key={i}>
                          <td className="py-3 px-4"><div className="h-4 bg-[#1f1f22] rounded w-3/4 animate-pulse" /></td>
                          <td className="py-3 px-4"><div className="h-4 bg-[#1f1f22] rounded w-16 animate-pulse" /></td>
                          <td className="py-3 px-4"><div className="h-4 bg-[#1f1f22] rounded w-24 animate-pulse" /></td>
                          <td className="py-3 px-4"></td>
                        </tr>
                      ))
                    ) : resumes.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-12 text-center">
                          <FileText className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                          <p className="text-zinc-300 font-medium text-[14px]">No resumes found</p>
                          <p className="text-zinc-500 text-[12px] mt-1">Upload a resume to get started.</p>
                        </td>
                      </tr>
                    ) : (
                      resumes.map((resume) => {
                        const status = statusConfig[resume.status] || statusConfig['UPLOADED'];
                        const StatusIcon = status.icon;
                        return (
                          <tr key={resume.id} className="hover:bg-[#050505] transition-colors group">
                            <td className="py-3 px-4">
                              <div className="flex flex-col">
                                <span className="font-medium text-zinc-200">{resume.fileName}</span>
                                <span className="text-[11px] text-zinc-500 mt-0.5">ID: {resume.id.substring(0, 8)}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium ${status.bgClass} ${status.textClass}`}>
                                <StatusIcon className="w-3 h-3" />
                                {status.label}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-zinc-400 text-[12px]">
                              {new Date(resume.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Link to={`/resumes/${resume.id}`} className="p-1.5 text-zinc-500 hover:text-zinc-200 opacity-0 group-hover:opacity-100 transition-all rounded-md hover:bg-[#1f1f22] inline-flex">
                                <MoreHorizontal className="w-4 h-4" />
                              </Link>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="p-3 border-t border-[#1f1f22] flex items-center justify-between text-[12px] text-zinc-500 bg-[#050505]">
                <span>Showing {resumes.length} results</span>
                <div className="flex gap-2">
                  <button className="px-2 py-1 rounded-md hover:bg-[#1f1f22] transition-colors" disabled>Previous</button>
                  <button className="px-2 py-1 rounded-md hover:bg-[#1f1f22] transition-colors" disabled>Next</button>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Feed (1 column) */}
          <div className="glass-card flex flex-col">
            <div className="p-4 border-b border-[#1f1f22]">
              <h2 className="text-[14px] font-semibold text-zinc-100">Activity Feed</h2>
            </div>
            <div className="p-4 flex-1">
              <div className="space-y-6">
                {activityFeed.map((activity, idx) => (
                  <div key={activity.id} className="relative flex gap-4">
                    {idx !== activityFeed.length - 1 && (
                      <div className="absolute left-2 top-6 bottom-[-1.5rem] w-px bg-[#1f1f22]" />
                    )}
                    <div className="relative z-10 w-4 h-4 rounded-full bg-[#0a0a0a] border-[3px] border-[#1f1f22] mt-0.5" />
                    <div className="flex flex-col flex-1">
                      <p className="text-[13px] text-zinc-300 font-medium leading-snug">{activity.title}</p>
                      <span className="text-[11px] text-zinc-500 mt-0.5">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
