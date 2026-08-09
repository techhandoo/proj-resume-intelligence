import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { Target, Mail, PenTool, Loader2, Download, FileText, ChevronRight, Copy, Check, SlidersHorizontal, Sparkles } from 'lucide-react';
import api from '../lib/api';
import html2pdf from 'html2pdf.js';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

const TONES = [
  { id: 'professional', label: 'Professional & Polished' },
  { id: 'executive', label: 'Executive & Strategic' },
  { id: 'technical', label: 'Technical & Data-Driven' },
  { id: 'creative', label: 'Modern & Persuasive' },
];

export default function CoverLetterPage() {
  const [searchParams] = useSearchParams();
  const initialResumeId = searchParams.get('resumeId') || '';

  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState(initialResumeId);
  const [selectedTone, setSelectedTone] = useState('professional');
  const [jobDescription, setJobDescription] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.get('/resumes').then(res => {
      const fetchedResumes = res.data;
      setResumes(fetchedResumes);
      if (!initialResumeId && fetchedResumes.length > 0) {
        setSelectedResumeId(fetchedResumes[0].id);
      }
    }).catch(() => {
      setError('Failed to load candidate resumes.');
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateCoverLetter = async () => {
    if (!jobDescription.trim()) {
      setError('Please provide the target job description.');
      return;
    }
    if (!selectedResumeId) {
      setError('No candidate resume selected. Please upload a resume first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/cover-letter/generate', {
        resumeId: selectedResumeId,
        jobDescription: `Tone: ${selectedTone}\n\n${jobDescription}`,
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
      margin: 0.75,
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
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppLayout>
      <main className="max-w-[1280px] mx-auto py-4 w-full space-y-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs">
          <Link to="/dashboard" className="text-zinc-500 hover:text-zinc-300 transition-colors">Overview</Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-white font-semibold">AI Cover Letter Generator</span>
        </div>

        {/* Page Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">AI Cover Letter Generator</h1>
            <p className="text-xs text-zinc-400 mt-1">
              Synthesize your candidate resume skills against target job postings using Groq LLM inference.
            </p>
          </div>
        </div>

        {/* Split Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left Column: Input Configuration */}
          <div className="glass-card p-6 flex flex-col min-h-[620px]">
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#1c1c21] mb-6">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Target Job Configuration</h2>
                <p className="text-[11px] text-zinc-500">Provide job requirements and select writing tone.</p>
              </div>
            </div>

            {/* Resume Select */}
            <div className="mb-5">
              <label className="form-label">Source Candidate Resume</label>
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                disabled={loading || resumes.length === 0}
                className="form-input bg-[#07070a] text-xs font-semibold cursor-pointer"
              >
                {resumes.length === 0 && <option value="">No resumes found — upload one first</option>}
                {resumes.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.fileName} · {new Date(r.uploadedAt).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Tone Selector */}
            <div className="mb-5">
              <label className="form-label flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" /> Writing Tone Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TONES.map(tone => (
                  <button
                    key={tone.id}
                    type="button"
                    onClick={() => setSelectedTone(tone.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border text-left transition-all cursor-pointer ${
                      selectedTone === tone.id
                        ? 'bg-blue-500/15 border-blue-500/40 text-blue-300'
                        : 'bg-[#07070a] border-[#1c1c21] text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {tone.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Job Description Textarea */}
            <div className="flex-1 flex flex-col mb-5">
              <label className="form-label">Target Job Description</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description or key position responsibilities here..."
                className="form-input flex-1 resize-none font-mono text-xs leading-relaxed bg-[#050508]"
                disabled={loading}
              />
            </div>

            {error && (
              <p className="text-rose-400 text-xs font-semibold mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3">
                {error}
              </p>
            )}

            <button
              onClick={generateCoverLetter}
              disabled={loading || !selectedResumeId}
              className="btn-primary w-full py-3.5 text-xs font-bold shadow-xl shadow-blue-500/20 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" /> Writing Custom Cover Letter...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" /> Generate Tailored Cover Letter
                </span>
              )}
            </button>
          </div>

          {/* Right Column: Output Paper Preview */}
          <div className="glass-card p-6 flex flex-col min-h-[620px]">
            <div className="flex items-center justify-between pb-4 border-b border-[#1c1c21] mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">Document Preview</h2>
                  <p className="text-[11px] text-zinc-500">Formatted cover letter output.</p>
                </div>
              </div>

              {coverLetter && (
                <div className="flex items-center gap-2">
                  <button onClick={copyToClipboard} className="btn-secondary btn-sm py-1 px-2.5 text-xs font-semibold cursor-pointer">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <button onClick={exportWord} className="btn-secondary btn-sm py-1 px-2.5 text-xs font-semibold cursor-pointer">
                    <FileText className="w-3.5 h-3.5 mr-1" /> DOCX
                  </button>
                  <button onClick={exportPDF} className="btn-secondary btn-sm py-1 px-2.5 text-xs font-semibold cursor-pointer">
                    <Download className="w-3.5 h-3.5 mr-1" /> PDF
                  </button>
                </div>
              )}
            </div>

            {/* Document Sheet Box */}
            <div className="flex-1 bg-[#050507] border border-white/5 rounded-2xl p-6 sm:p-8 overflow-y-auto max-h-[500px] shadow-inner">
              {coverLetter ? (
                <div
                  id="cover-letter-content"
                  className="prose prose-invert max-w-none text-zinc-200 text-xs leading-[2] whitespace-pre-wrap font-sans tracking-wide"
                >
                  {coverLetter}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-24 opacity-40">
                  <PenTool className="w-10 h-10 mb-4 text-zinc-600" />
                  <p className="text-zinc-400 font-semibold text-xs">
                    {loading ? 'Groq AI is crafting your cover letter...' : 'Select a candidate resume & click Generate to write a letter.'}
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

