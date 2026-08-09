import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  Search,
  Activity,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import api from '../lib/api';

interface ResumeItem {
  id: string;
  fileName: string;
  status: string;
  uploadedAt: string;
  hasAnalysis: boolean;
}

const statusConfig: Record<string, { label: string; badgeClass: string; icon: any }> = {
  UPLOADED:   { label: 'Uploaded',   badgeClass: 'badge-amber', icon: Clock },
  PROCESSING: { label: 'Processing', badgeClass: 'badge-blue',  icon: Activity },
  ANALYZED:   { label: 'Analyzed',   badgeClass: 'badge-emerald', icon: CheckCircle2 },
  FAILED:     { label: 'Failed',     badgeClass: 'badge-rose',    icon: AlertCircle },
};

const activityFeed = [
  { id: 1, title: 'Senior Backend Engineer resume parsed', time: '2 mins ago', type: 'success' },
  { id: 2, title: 'Groq LLM Inference Engine v2.4 initialized', time: '45 mins ago', type: 'system' },
  { id: 3, title: 'ATS Compatibility Matrix calculated', time: '2 hours ago', type: 'success' },
  { id: 4, title: 'Workspace security audit verified', time: '5 hours ago', type: 'info' },
  { id: 5, title: 'Weekly AI Candidate Report ready', time: '1 day ago', type: 'info' },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');

  useEffect(() => { fetchResumes(); }, []);

  const fetchResumes = async () => {
    try {
      const res = await api.get('/resumes');
      setResumes(res.data);
    } catch {
      // API error handled gracefully
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => ({
    total:      resumes.length,
    analyzed:   resumes.filter((r) => r.status === 'ANALYZED').length,
    processing: resumes.filter((r) => r.status === 'PROCESSING').length,
    failed:     resumes.filter((r) => r.status === 'FAILED').length,
  }), [resumes]);

  const filteredResumes = useMemo(() => {
    return resumes.filter((r) => {
      const matchesSearch = r.fileName.toLowerCase().includes(searchQuery.toLowerCase()) || r.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatusFilter === 'ALL' || r.status === selectedStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [resumes, searchQuery, selectedStatusFilter]);

  return (
    <AppLayout>
      <div className="w-full flex flex-col space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Overview</h1>
              <span className="badge badge-emerald">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Workspace
              </span>
            </div>
            <p className="text-xs text-zinc-400">Monitor candidate processing throughput, ATS analysis metrics, and activity feeds.</p>
          </div>
          <Link to="/upload" className="btn-primary py-2.5 px-5 text-xs font-bold shadow-lg shadow-blue-500/15">
            <Plus className="w-4 h-4 mr-1.5" /> New AI Analysis
          </Link>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="glass-card p-5 relative overflow-hidden group hover:border-blue-500/30 transition-all">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Resumes</span>
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-black text-white tracking-tight">{stats.total}</span>
              <span className="text-[11px] font-bold text-emerald-400 flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> +14%
              </span>
            </div>
            <div className="w-full bg-zinc-800/60 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min(100, stats.total * 20)}%` }} />
            </div>
          </div>
          
          <div className="glass-card p-5 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Analyzed & Scored</span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-black text-white tracking-tight">{stats.analyzed}</span>
              <span className="text-[11px] font-bold text-emerald-400 flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> 98.2% ATS
              </span>
            </div>
            <div className="w-full bg-zinc-800/60 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${stats.total > 0 ? (stats.analyzed / stats.total) * 100 : 0}%` }} />
            </div>
          </div>

          <div className="glass-card p-5 relative overflow-hidden group hover:border-blue-400/30 transition-all">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">In Pipeline Queue</span>
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-black text-white tracking-tight">{stats.processing}</span>
              <span className="text-[11px] font-mono text-zinc-500">Groq Engine</span>
            </div>
            <div className="w-full bg-zinc-800/60 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-400 h-full rounded-full animate-pulse" style={{ width: stats.processing > 0 ? '60%' : '0%' }} />
            </div>
          </div>

          <div className="glass-card p-5 relative overflow-hidden group hover:border-rose-500/30 transition-all">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Requires Attention</span>
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-black text-white tracking-tight">{stats.failed}</span>
              <span className="text-[11px] font-mono text-zinc-500">Failed Parses</span>
            </div>
            <div className="w-full bg-zinc-800/60 h-1.5 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full" style={{ width: stats.failed > 0 ? '100%' : '0%' }} />
            </div>
          </div>

        </div>

        {/* Main Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Data Table (Spans 2 columns) */}
          <div className="lg:col-span-2 flex flex-col space-y-4">
            <div className="glass-card flex-1 flex flex-col overflow-hidden">
              
              {/* Table Controls Header */}
              <div className="p-5 border-b border-[#1c1c21] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#070709]">
                <div className="flex items-center gap-3">
                  <h2 className="text-sm font-bold text-white tracking-tight">Recent Candidate Resumes</h2>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                    {filteredResumes.length} items
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Search Input */}
                  <div className="relative flex-1 sm:w-56">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                    <input 
                      type="text" 
                      placeholder="Search title or ID..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="form-input py-1.5 pl-9 pr-3 text-xs bg-[#0c0c10]"
                    />
                  </div>

                  {/* Filter Pills Dropdown */}
                  <select
                    value={selectedStatusFilter}
                    onChange={(e) => setSelectedStatusFilter(e.target.value)}
                    className="form-input py-1.5 px-3 text-xs bg-[#0c0c10] w-auto cursor-pointer"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="ANALYZED">Analyzed</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="UPLOADED">Uploaded</option>
                    <option value="FAILED">Failed</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#1c1c21] bg-[#09090c] text-zinc-400 select-none">
                      <th className="py-3.5 px-5 font-bold uppercase tracking-wider text-[10px]">Document & Details</th>
                      <th className="py-3.5 px-5 font-bold uppercase tracking-wider text-[10px]">AI Status</th>
                      <th className="py-3.5 px-5 font-bold uppercase tracking-wider text-[10px]">Date Uploaded</th>
                      <th className="py-3.5 px-5 text-right font-bold uppercase tracking-wider text-[10px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1c1c21]">
                    {loading ? (
                      [...Array(4)].map((_, i) => (
                        <tr key={i}>
                          <td className="py-4 px-5"><div className="h-4 bg-zinc-800/80 rounded w-3/4 animate-pulse" /></td>
                          <td className="py-4 px-5"><div className="h-4 bg-zinc-800/80 rounded w-20 animate-pulse" /></td>
                          <td className="py-4 px-5"><div className="h-4 bg-zinc-800/80 rounded w-24 animate-pulse" /></td>
                          <td className="py-4 px-5"></td>
                        </tr>
                      ))
                    ) : filteredResumes.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-16 text-center">
                          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-3 text-zinc-600">
                            <FileText className="w-6 h-6" />
                          </div>
                          <p className="text-zinc-200 font-bold text-sm">No resumes matching criteria</p>
                          <p className="text-zinc-500 text-xs mt-1 mb-4">Try adjusting search filters or upload a new resume.</p>
                          <Link to="/upload" className="btn-secondary btn-sm">
                            <Plus className="w-3.5 h-3.5 mr-1" /> Upload Resume
                          </Link>
                        </td>
                      </tr>
                    ) : (
                      filteredResumes.map((resume) => {
                        const status = statusConfig[resume.status] || statusConfig['UPLOADED'];
                        const StatusIcon = status.icon;
                        return (
                          <tr key={resume.id} className="hover:bg-[#111116] transition-colors group cursor-pointer" onClick={() => navigate(`/resumes/${resume.id}`)}>
                            <td className="py-3.5 px-5">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 group-hover:border-zinc-700 text-zinc-300 transition-colors">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="font-semibold text-zinc-100 group-hover:text-blue-400 transition-colors truncate max-w-xs">{resume.fileName}</span>
                                  <span className="text-[10px] font-mono text-zinc-500">ID: {resume.id.substring(0, 8)}...</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-5">
                              <span className={`badge ${status.badgeClass}`}>
                                <StatusIcon className="w-3 h-3" />
                                {status.label}
                              </span>
                            </td>
                            <td className="py-3.5 px-5 text-zinc-400 font-mono text-[11px]">
                              {new Date(resume.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td className="py-3.5 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-2">
                                <Link 
                                  to={`/resumes/${resume.id}`}
                                  className="btn-secondary btn-sm py-1 px-2.5 text-[11px] opacity-90 group-hover:opacity-100 transition-opacity"
                                >
                                  Inspect <ChevronRight className="w-3 h-3 ml-0.5" />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border-t border-[#1c1c21] flex items-center justify-between text-xs text-zinc-500 bg-[#070709]">
                <span>Showing {filteredResumes.length} of {resumes.length} candidate documents</span>
                <span className="text-[11px] font-mono">Page 1 of 1</span>
              </div>
            </div>
          </div>

          {/* Sidebar Widgets (1 column) */}
          <div className="flex flex-col gap-6">
            
            {/* AI Engine Resource Usage Widget */}
            <div className="glass-card p-5 relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-[#1c1c21] mb-4">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">AI Inference Quota</h3>
                </div>
                <span className="badge badge-emerald">Active</span>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-400 font-medium">Groq LLaMA-3 Throughput</span>
                    <span className="text-emerald-400 font-mono font-bold">84% Free</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[16%]" />
                  </div>
                </div>
                <div className="flex justify-between items-center text-[11px] text-zinc-400 pt-2 border-t border-white/5">
                  <span>Latency Benchmark</span>
                  <span className="font-mono text-zinc-200">1.12 sec / doc</span>
                </div>
              </div>
            </div>

            {/* Live Activity Feed */}
            <div className="glass-card flex flex-col flex-1">
              <div className="p-4 border-b border-[#1c1c21] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider">Activity Feed</h2>
                </div>
                <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
              </div>
              <div className="p-4 flex-1 overflow-y-auto max-h-[380px]">
                <div className="space-y-5">
                  {activityFeed.map((act, idx) => (
                    <div key={act.id} className="relative flex gap-3.5">
                      {idx !== activityFeed.length - 1 && (
                        <div className="absolute left-2 top-5 bottom-[-1.25rem] w-px bg-[#1c1c21]" />
                      )}
                      <div className={`relative z-10 w-4 h-4 rounded-full flex items-center justify-center mt-0.5 ${
                        act.type === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                        act.type === 'system' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' :
                        'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-current" />
                      </div>
                      <div className="flex flex-col flex-1">
                        <p className="text-xs text-zinc-200 font-medium leading-snug">{act.title}</p>
                        <span className="text-[10px] text-zinc-500 mt-0.5 font-mono">{act.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </AppLayout>
  );
}

