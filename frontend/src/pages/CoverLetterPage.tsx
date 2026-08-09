import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { Target, Mail, PenTool, Loader2, Download, FileText, ChevronRight } from 'lucide-react';
import api from '../lib/api';
import html2pdf from 'html2pdf.js';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

export default function CoverLetterPage() {
  const [searchParams] = useSearchParams();
  const initialResumeId = searchParams.get('resumeId') || '';

  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState(initialResumeId);
  const [jobDescription, setJobDescription] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ── Fetch resumes once on mount only (no selectedResumeId in deps — prevents infinite loop)
  useEffect(() => {
    api.get('/resumes').then(res => {
      const fetchedResumes = res.data;
      setResumes(fetchedResumes);
      // Auto-select first resume only if no resumeId came from the URL
      if (!initialResumeId && fetchedResumes.length > 0) {
        setSelectedResumeId(fetchedResumes[0].id);
      }
    }).catch(() => {
      setError('Failed to load resumes. Please try again.');
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — only run once

  const generateCoverLetter = async () => {
    if (!jobDescription.trim()) {
      setError('Please provide a job description.');
      return;
    }
    if (!selectedResumeId) {
      setError('No resume selected. Please upload a resume first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/cover-letter/generate', {
        resumeId: selectedResumeId,
        jobDescription,
      });
      setCoverLetter(response.data.coverLetterMarkdown);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'An unexpected error occurred.';
      setError('Failed to generate cover letter: ' + msg);
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = () => {
    const element = document.getElementById('cover-letter-content');
    if (!element) return;
    html2pdf().set({
      margin: 1,
      filename: 'Resumify_Cover_Letter.pdf',
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const },
    }).from(element).save();
  };

  const exportWord = async () => {
    if (!coverLetter) return;
    const paragraphs = coverLetter.split('\n').map(line =>
      new Paragraph({ children: [new TextRun(line)] })
    );
    const doc = new Document({ sections: [{ properties: {}, children: paragraphs }] });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, 'Cover_Letter.docx');
  };

  const copyToClipboard = () => {
    if (!coverLetter) return;
    navigator.clipboard.writeText(coverLetter);
    alert('Cover letter copied to clipboard!');
  };

  return (
    <AppLayout>
      <main className="max-w-[1200px] mx-auto px-6 sm:px-10 py-10 w-full">

        {/* ── Breadcrumb ── */}
        <div className="flex items-center justify-center gap-2 text-sm mb-6">
          <Link to="/dashboard" className="text-slate-500 hover:text-blue-400 transition-colors">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-white font-semibold">Cover Letter</span>
        </div>

        {/* ── Page Title ── */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">AI Cover Letter Generator</h1>
          <p className="text-slate-400 text-[14px] leading-relaxed max-w-lg mx-auto">
            Select a resume, paste the job description, and Resumify AI will write a tailored cover letter.
          </p>
        </div>

        <div className="section-divider mb-8" />

        {/* ── Split Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ── Left: Input ── */}
          <div className="glass-card p-8 flex flex-col min-h-[600px]">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <Target className="w-4 h-4 text-slate-300" />
              </span>
              <h2 className="text-[15px] font-bold text-white">Target Job Description</h2>
            </div>

            {/* Resume selector */}
            <div className="mb-5">
              <label className="form-label">Select Resume</label>
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                disabled={loading || resumes.length === 0}
                className="form-input bg-black"
              >
                {resumes.length === 0 && <option value="">No resumes found — upload one first</option>}
                {resumes.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.fileName} · {new Date(r.uploadedAt).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Job description */}
            <label className="form-label">Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here..."
              className="form-input flex-1 resize-none font-mono text-[13px] leading-relaxed mb-5"
              disabled={loading}
            />

            {error && (
              <p className="text-rose-400 text-sm font-semibold mb-4 rounded-lg bg-rose-500/10 border border-rose-500/20 px-4 py-3">
                {error}
              </p>
            )}

            <button
              onClick={generateCoverLetter}
              disabled={loading || !selectedResumeId}
              className="btn-primary w-full py-3.5 text-[14px] mt-auto flex-shrink-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Writing Cover Letter...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <PenTool className="w-4 h-4" /> Generate Cover Letter
                </span>
              )}
            </button>
          </div>

          {/* ── Right: Output ── */}
          <div className="glass-card p-8 flex flex-col min-h-[600px]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-slate-300" />
                </span>
                <h2 className="text-[15px] font-bold text-white">Generated Cover Letter</h2>
              </div>
              {coverLetter && (
                <div className="flex items-center gap-2">
                  <button onClick={copyToClipboard} className="btn-secondary btn-sm flex items-center gap-1.5 bg-zinc-800/50 hover:bg-zinc-800" title="Copy to Clipboard">
                    <FileText className="w-3.5 h-3.5" /> Copy
                  </button>
                  <button onClick={exportPDF} className="btn-secondary btn-sm flex items-center gap-1.5" title="Download PDF">
                    <Download className="w-3.5 h-3.5" /> PDF
                  </button>
                  <button onClick={exportWord} className="btn-secondary btn-sm flex items-center gap-1.5" title="Download Word">
                    <FileText className="w-3.5 h-3.5" /> Word
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 bg-black/60 border border-white/[0.05] rounded-xl p-6 overflow-y-auto">
              {coverLetter ? (
                <div
                  id="cover-letter-content"
                  className="prose prose-invert max-w-none text-slate-300 text-[14px] leading-[1.9] whitespace-pre-wrap font-sans"
                >
                  {coverLetter}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <PenTool className="w-10 h-10 mb-4 text-zinc-600" />
                  <p className="text-zinc-500 font-medium text-sm">
                    {loading ? 'Generating your cover letter...' : 'Your cover letter will appear here.'}
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </AppLayout>
  );
}
