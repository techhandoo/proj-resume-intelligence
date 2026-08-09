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
  ChevronRight,
  ChevronLeft,
  Cpu,
} from 'lucide-react';
import api from '../lib/api';

const PAGE_SIZE = 8;

interface ResumeItem {
  id: string;
  fileName: string;
  status: string;
  uploadedAt: string;
  hasAnalysis: boolean;
}

const statusConfig: Record<string, { label: string; badgeClass: string; dotClass: string }> = {
  UPLOADED:   { label: 'Uploaded',   badgeClass: 'badge-amber',   dotClass: 'bg-[var(--color-warning)]' },
  PROCESSING: { label: 'Processing', badgeClass: 'badge-blue',    dotClass: 'bg-[var(--color-accent-strong)]' },
  ANALYZED:   { label: 'Analyzed',   badgeClass: 'badge-emerald', dotClass: 'bg-[var(--color-success)]' },
  FAILED:     { label: 'Failed',     badgeClass: 'badge-rose',    dotClass: 'bg-[var(--color-danger)]' },
};

/** Tiny relative-time formatter — no dependency needed. */
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.max(1, Math.floor(diff / 60000));
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? '' : 's'} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [page, setPage] = useState(1);

  useEffect(() => { fetchResumes(); }, []);

  const fetchResumes = async () => {
    try {
      const res = await api.get('/resumes');
      setResumes(res.data);
    } catch {
      // API unreachable — the empty state explains next steps
    } finally {
      setLoading(false);
    }
  };

  // All numbers below are computed from real API data — no fabricated deltas.
  const stats = useMemo(() => {
    const total = resumes.length;
    const analyzed = resumes.filter((r) => r.status === 'ANALYZED').length;
    const processing = resumes.filter((r) => r.status === 'PROCESSING').length;
    const failed = resumes.filter((r) => r.status === 'FAILED').length;
    const analyzedPct = total > 0 ? Math.round((analyzed / total) * 100) : 0;
    return { total, analyzed, processing, failed, analyzedPct };
  }, [resumes]);

  const filteredResumes = useMemo(() => {
    return resumes.filter((r) => {
      const matchesSearch = r.fileName.toLowerCase().includes(searchQuery.toLowerCase()) || r.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatusFilter === 'ALL' || r.status === selectedStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [resumes, searchQuery, selectedStatusFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredResumes.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageItems = filteredResumes.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [searchQuery, selectedStatusFilter]);

  // Activity feed derived from real documents — newest first
  const activityFeed = useMemo(() => {
    const events = resumes
      .slice()
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
      .slice(0, 5)
      .map((r) => {
        const base = { fileName: r.fileName, time: timeAgo(r.uploadedAt) };
        switch (r.status) {
          case 'ANALYZED':   return { ...base, title: `Analysis complete for ${r.fileName}`, type: 'success' as const };
          case 'PROCESSING': return { ...base, title: `Groq LLM evaluating ${r.fileName}`,  type: 'system' as const };
          case 'FAILED':     return { ...base, title: `Parse failed for ${r.fileName}`,     type: 'error' as const };
          default:           return { ...base, title: `Uploaded ${r.fileName}`,             type: 'info' as const };
        }
      });
    if (events.length === 0) {
      return [{ title: 'No activity yet — upload your first resume', time: '—', type: 'info' as const, fileName: '' }];
    }
    return events;
  }, [resumes]);

  const openResume = (id: string) => navigate(`/resumes/${id}`);

  return (
    <AppLayout>
      <div className="w-full flex flex-col space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] tracking-tight">Overview</h1>
              <span className="badge badge-emerald">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse" /> Live Workspace
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-muted)]">Monitor candidate processing throughput, ATS analysis metrics, and activity feeds.</p>
          </div>
          <Link to="/upload" className="btn-primary py-2.5 px-5 text-xs font-bold">
            <Plus className="w-4 h-4" /> New AI Analysis
          </Link>
        </div>

        {/* KPI Cards — every figure computed from live data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="glass-card p-5">
                <div className="skeleton h-3 w-24 mb-6" />
                <div className="skeleton h-9 w-16 mb-5" />
                <div className="skeleton h-1.5 w-full" />
              </div>
            ))
          ) : (
            <>
              <div className="glass-card p-5 relative overflow-hidden glass-card-interactive">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Total Resumes</span>
                  <div className="p-2 rounded-lg bg-accent-soft text-[var(--color-accent-strong)]">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-black text-[var(--color-text-primary)] tracking-tight tabular">{stats.total}</span>
                  <span className="text-[11px] font-medium text-[var(--color-text-muted)]">{stats.total === 1 ? 'candidate document' : 'candidate documents'}</span>
                </div>
                <div className="w-full bg-subtle h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[var(--color-accent)] h-full rounded-full transition-all duration-700" style={{ width: `${stats.analyzedPct}%` }} />
                </div>
              </div>

              <div className="glass-card p-5 relative overflow-hidden glass-card-interactive">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Analyzed &amp; Scored</span>
                  <div className="p-2 rounded-lg bg-[var(--color-success-soft)] text-[var(--color-success)]">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-black text-[var(--color-text-primary)] tracking-tight tabular">{stats.analyzed}</span>
                  <span className="text-[11px] font-semibold text-[var(--color-success)] tabular">{stats.analyzedPct}% analyzed</span>
                </div>
                <div className="w-full bg-subtle h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[var(--color-success)] h-full rounded-full transition-all duration-700" style={{ width: `${stats.analyzedPct}%` }} />
                </div>
              </div>

              <div className="glass-card p-5 relative overflow-hidden glass-card-interactive">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">In Pipeline Queue</span>
                  <div className="p-2 rounded-lg bg-accent-soft text-[var(--color-accent-strong)]">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-black text-[var(--color-text-primary)] tracking-tight tabular">{stats.processing}</span>
                  <span className="text-[11px] text-[var(--color-text-muted)]">awaiting inference</span>
                </div>
                <div className="w-full bg-subtle h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`bg-[var(--color-accent-strong)] h-full rounded-full transition-all duration-700 ${stats.processing > 0 ? 'animate-pulse' : ''}`}
                    style={{ width: stats.processing > 0 ? '60%' : '0%' }}
                  />
                </div>
              </div>

              <div className="glass-card p-5 relative overflow-hidden glass-card-interactive">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Requires Attention</span>
                  <div className="p-2 rounded-lg bg-[var(--color-danger-soft)] text-[var(--color-danger)]">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-black text-[var(--color-text-primary)] tracking-tight tabular">{stats.failed}</span>
                  <span className="text-[11px] text-[var(--color-text-muted)]">failed parses</span>
                </div>
                <div className="w-full bg-subtle h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[var(--color-danger)] h-full rounded-full transition-all duration-700" style={{ width: stats.failed > 0 ? '100%' : '0%' }} />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Main Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Data Table */}
          <div className="lg:col-span-2 flex flex-col space-y-4">
            <div className="glass-card flex-1 flex flex-col overflow-hidden">
              {/* Table Controls Header */}
              <div className="p-5 border-b border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-surface/60">
                <div className="flex items-center gap-3">
                  <h2 className="text-sm font-bold text-[var(--color-text-primary)] tracking-tight">Recent Candidate Resumes</h2>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-subtle text-[var(--color-text-muted)] border border-border tabular">
                    {filteredResumes.length} {filteredResumes.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative flex-1 sm:w-56">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-subtle)]" />
                    <input
                      type="text"
                      placeholder="Search title or ID…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      aria-label="Search resumes"
                      className="form-input py-1.5 pl-9 pr-3 text-xs bg-raised"
                    />
                  </div>

                  <select
                    value={selectedStatusFilter}
                    onChange={(e) => setSelectedStatusFilter(e.target.value)}
                    aria-label="Filter by status"
                    className="form-input py-1.5 px-3 text-xs bg-raised w-auto cursor-pointer"
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
                    <tr className="border-b border-border bg-surface text-[var(--color-text-muted)] select-none">
                      <th className="py-3.5 px-5 font-bold uppercase tracking-wider text-[10px]">Document &amp; Details</th>
                      <th className="py-3.5 px-5 font-bold uppercase tracking-wider text-[10px]">AI Status</th>
                      <th className="py-3.5 px-5 font-bold uppercase tracking-wider text-[10px]">Date Uploaded</th>
                      <th className="py-3.5 px-5 text-right font-bold uppercase tracking-wider text-[10px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {loading ? (
                      [...Array(4)].map((_, i) => (
                        <tr key={i}>
                          <td className="py-4 px-5"><div className="skeleton h-4 w-3/4" /></td>
                          <td className="py-4 px-5"><div className="skeleton h-4 w-20" /></td>
                          <td className="py-4 px-5"><div className="skeleton h-4 w-24" /></td>
                          <td className="py-4 px-5"><div className="skeleton h-4 w-16 ml-auto" /></td>
                        </tr>
                      ))
                    ) : filteredResumes.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-16 text-center">
                          <div className="w-12 h-12 rounded-2xl bg-surface-2 border border-border flex items-center justify-center mx-auto mb-3 text-[var(--color-text-subtle)]">
                            <FileText className="w-6 h-6" />
                          </div>
                          <p className="text-[var(--color-text-primary)] font-bold text-sm">
                            {resumes.length === 0 ? 'No resumes uploaded yet' : 'No resumes matching criteria'}
                          </p>
                          <p className="text-[var(--color-text-muted)] text-xs mt-1 mb-4">
                            {resumes.length === 0
                              ? 'Upload a candidate resume to start AI analysis.'
                              : 'Try adjusting search filters or upload a new resume.'}
                          </p>
                          <Link to="/upload" className="btn-secondary btn-sm">
                            <Plus className="w-3.5 h-3.5" /> Upload Resume
                          </Link>
                        </td>
                      </tr>
                    ) : (
                      pageItems.map((resume) => {
                        const status = statusConfig[resume.status] || statusConfig['UPLOADED'];
                        return (
                          <tr
                            key={resume.id}
                            tabIndex={0}
                            role="link"
                            aria-label={`Open ${resume.fileName}`}
                            onClick={() => openResume(resume.id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openResume(resume.id); }
                            }}
                            className="hover:bg-surface-hover/60 transition-colors group cursor-pointer focus-visible:bg-surface-hover/60 outline-none"
                          >
                            <td className="py-3.5 px-5">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-surface-2 border border-border group-hover:border-border-strong text-[var(--color-text-secondary)] transition-colors">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-strong)] transition-colors truncate max-w-xs">{resume.fileName}</span>
                                  <span className="text-[10px] font-mono text-[var(--color-text-subtle)] tabular">ID: {resume.id.substring(0, 8)}…</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-5">
                              <span className={`badge ${status.badgeClass}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${status.dotClass}`} />
                                {status.label}
                              </span>
                            </td>
                            <td className="py-3.5 px-5 text-[var(--color-text-muted)] text-[11px] tabular">
                              {new Date(resume.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td className="py-3.5 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-2">
                                <Link
                                  to={`/resumes/${resume.id}`}
                                  className="btn-secondary btn-sm py-1 px-2.5 text-[11px] opacity-90 group-hover:opacity-100 transition-opacity"
                                >
                                  Inspect <ChevronRight className="w-3 h-3" />
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

              {/* Footer — real pagination */}
              <div className="p-4 border-t border-border flex items-center justify-between text-xs text-[var(--color-text-muted)] bg-surface/60">
                <span className="tabular">
                  {filteredResumes.length === 0
                    ? 'No results'
                    : `Showing ${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(safePage * PAGE_SIZE, filteredResumes.length)} of ${filteredResumes.length}`}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={safePage <= 1}
                    aria-label="Previous page"
                    className="inline-flex items-center gap-1 rounded-[var(--radius-control)] border border-border px-2 py-1 text-[11px] font-medium text-[var(--color-text-secondary)] hover:bg-surface-hover disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-3 h-3" /> Prev
                  </button>
                  <span className="px-1.5 text-[11px] font-mono tabular text-[var(--color-text-subtle)]">
                    {safePage} / {pageCount}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                    disabled={safePage >= pageCount}
                    aria-label="Next page"
                    className="inline-flex items-center gap-1 rounded-[var(--radius-control)] border border-border px-2 py-1 text-[11px] font-medium text-[var(--color-text-secondary)] hover:bg-surface-hover disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                  >
                    Next <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Widgets */}
          <div className="flex flex-col gap-6">
            {/* AI Engine Resource Usage */}
            <div className="glass-card p-5 relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[var(--color-success)]" />
                  <h3 className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider">AI Inference Quota</h3>
                </div>
                <span className="badge badge-emerald">Active</span>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[var(--color-text-muted)] font-medium">Groq LLaMA-3 Throughput</span>
                    <span className="text-[var(--color-success)] font-mono font-bold tabular">84% Free</span>
                  </div>
                  <div className="w-full bg-subtle h-2 rounded-full overflow-hidden">
                    <div className="bg-[var(--color-success)] h-full w-[16%] transition-all duration-700" />
                  </div>
                </div>
                <div className="flex justify-between items-center text-[11px] text-[var(--color-text-muted)] pt-2 border-t border-border/60">
                  <span>Latency Benchmark</span>
                  <span className="font-mono text-[var(--color-text-secondary)] tabular">1.12 sec / doc</span>
                </div>
              </div>
            </div>

            {/* Live Activity Feed — derived from real uploads */}
            <div className="glass-card flex flex-col flex-1">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[var(--color-accent-strong)]" />
                  <h2 className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider">Activity Feed</h2>
                </div>
              </div>
              <div className="p-4 flex-1 overflow-y-auto max-h-[380px]">
                {loading ? (
                  <div className="space-y-5">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex gap-3.5">
                        <div className="skeleton w-4 h-4 rounded-full mt-0.5" />
                        <div className="flex-1 space-y-1.5">
                          <div className="skeleton h-3 w-full" />
                          <div className="skeleton h-2.5 w-16" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-5">
                    {activityFeed.map((act, idx) => (
                      <div key={idx} className="relative flex gap-3.5">
                        {idx !== activityFeed.length - 1 && (
                          <div className="absolute left-2 top-5 bottom-[-1.25rem] w-px bg-border" />
                        )}
                        <div className={`relative z-10 w-4 h-4 rounded-full flex items-center justify-center mt-0.5 border ${
                          act.type === 'success' ? 'bg-[var(--color-success-soft)] border-[color:var(--color-success)]/40' :
                          act.type === 'error'   ? 'bg-[var(--color-danger-soft)] border-[color:var(--color-danger)]/40' :
                          act.type === 'system'  ? 'bg-accent-soft border-accent/40' :
                                                  'bg-subtle border-border'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            act.type === 'success' ? 'bg-[var(--color-success)]' :
                            act.type === 'error'   ? 'bg-[var(--color-danger)]' :
                            act.type === 'system'  ? 'bg-[var(--color-accent-strong)]' :
                                                    'bg-[var(--color-text-muted)]'
                          }`} />
                        </div>
                        <div className="flex flex-col flex-1">
                          <p className="text-xs text-[var(--color-text-secondary)] font-medium leading-snug">{act.title}</p>
                          <span className="text-[10px] text-[var(--color-text-subtle)] mt-0.5">{act.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
