import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';
import Navbar from '../components/Navbar';
import AnimatedLayout from '../components/AnimatedLayout';
import { UploadCloud, FileText, File, AlertCircle, Loader2, CheckCircle, Zap } from 'lucide-react';
import api from '../lib/api';

// Configure PDF.js worker (use CDN for simplicity in Vite)
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n';
  }
  return fullText.trim();
}

export default function UploadPage() {
  const navigate = useNavigate();
  const [fileName, setFileName] = useState('');
  const [content,  setContent ] = useState('');
  const [error,    setError   ] = useState('');
  const [loading,  setLoading ] = useState(false);
  const [parsing,  setParsing ] = useState(false);
  const [fileType, setFileType] = useState<'txt' | 'pdf' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/resumes', { fileName, content });
      navigate(`/resumes/${res.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Upload failed. Please verify resume text and try again.');
      setLoading(false);
    }
  };

  const processFile = async (file: File) => {
    setError('');
    const isPDF = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    const isTXT = file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.text');

    if (!isPDF && !isTXT) {
      setError('Unsupported file type. Please upload a .pdf or .txt file.');
      return;
    }

    setFileName(file.name.replace(/\.[^/.]+$/, ''));
    setFileType(isPDF ? 'pdf' : 'txt');

    if (isPDF) {
      setParsing(true);
      try {
        const text = await extractTextFromPDF(file);
        if (!text) {
          setError('Could not extract text from this PDF. It may be scanned or image-only. Please try a text-based PDF or paste the content manually.');
        } else {
          setContent(text);
        }
      } catch {
        setError('PDF parsing failed. Please paste the resume text manually below.');
      } finally {
        setParsing(false);
      }
    } else {
      const reader = new FileReader();
      reader.onload = (ev) => setContent(ev.target?.result as string);
      reader.readAsText(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const isReady = content.trim() && fileName.trim() && !parsing;

  return (
    <AnimatedLayout className="vibrant-bg min-h-screen relative">
      <div className="vibrant-overlay" />
      <div className="relative z-10">
        <Navbar />

        <main className="flex justify-center px-4 sm:px-6 py-14">
          <div className="w-full max-w-2xl">

            {/* Page Header */}
            <div className="text-left mb-12">
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white mb-6 shadow-md">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">
                Upload Resume
              </h1>
              <p className="text-zinc-400 text-[15px] leading-relaxed max-w-lg">
                Drop a <span className="text-white font-semibold">.pdf</span> or{' '}
                <span className="text-white font-semibold">.txt</span> file, or paste the
                resume text below to launch automated AI analysis.
              </p>
            </div>

            <div className="section-divider mb-10" />

            {/* Error */}
            {error && (
              <div className="mb-7 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5 text-rose-400">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <p className="text-rose-400 text-sm font-medium leading-relaxed">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Resume Title */}
              <div className="glass-card px-8 py-7">
                <label htmlFor="fileName" className="form-label">
                  Resume Title / Candidate Name
                  <span className="text-zinc-500 ml-1 normal-case tracking-normal font-normal text-xs">(required)</span>
                </label>
                <input
                  id="fileName"
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  required
                  className="form-input"
                  placeholder="e.g. Sarah_Jenkins_FullStack_Resume"
                />
                <p className="mt-2.5 text-xs text-zinc-500 leading-relaxed">
                  This identifier appears in your dashboard resume list
                </p>
              </div>

              {/* Drop Zone & Text Area */}
              <div className="glass-card px-8 py-7">
                <label htmlFor="content" className="form-label">
                  Resume Content
                  <span className="text-blue-400 ml-1 normal-case tracking-normal font-normal text-xs">(required)</span>
                </label>

                {/* Drop Zone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="mb-6 border border-dashed border-white/20 hover:border-white/40 rounded-2xl py-10 px-6 text-center bg-black/40 hover:bg-white/5 transition-all cursor-pointer group"
                >
                  {parsing ? (
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-10 h-10 text-white animate-spin" />
                      <p className="text-sm font-semibold text-zinc-300">Extracting text from PDF...</p>
                      <p className="text-xs text-zinc-500">This may take a moment for large files</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                        <UploadCloud className="w-7 h-7" />
                      </div>
                      <p className="text-base font-semibold text-white mb-2">
                        Drag &amp; drop your resume here
                      </p>
                      <p className="text-sm text-zinc-400 mb-1 leading-relaxed">
                        Supports <span className="text-white font-medium">.pdf</span> and{' '}
                        <span className="text-white font-medium">.txt</span> files
                      </p>
                      <p className="text-xs text-zinc-600 mb-6">PDF text is extracted automatically in the browser</p>
                      <label className="btn-secondary btn-sm cursor-pointer">
                        Browse Files
                        <input
                          type="file"
                          accept=".pdf,.txt,.text"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </label>
                    </>
                  )}
                </div>

                {/* File type indicator */}
                {fileType && content && !parsing && (
                  <div className={`mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    fileType === 'pdf'
                      ? 'bg-red-500/10 border-red-500/20 text-red-400'
                      : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                  }`}>
                    {fileType === 'pdf' ? (
                      <><File className="w-4 h-4" /> PDF parsed</>
                    ) : (
                      <><FileText className="w-4 h-4" /> TXT loaded</>
                    )} — {content.length.toLocaleString()} characters extracted
                  </div>
                )}

                {/* Divider */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-white/[0.05]" />
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-widest">or paste text below</span>
                  <div className="flex-1 h-px bg-white/[0.05]" />
                </div>

                {/* Textarea */}
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={14}
                  className="form-input resize-y leading-[1.75]"
                  style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace", fontSize: '13px' }}
                  placeholder={`Paste full resume text here...\n\nExample:\nJohn Smith\nSenior Full-Stack Engineer | 6 Years Experience\n\nSkills: Java, React, TypeScript, PostgreSQL, Docker, AWS\nEducation: B.S. Computer Science, Stanford University (2020)\n\nExperience:\n  Lead Developer, CloudScale Inc (2022–Present)\n  Architected microservices handling 2M+ daily requests`}
                />

                {/* Counter */}
                <div className="flex items-center justify-between mt-3.5">
                  <span className="text-xs text-zinc-500">
                    {content.length > 0
                      ? `${content.length.toLocaleString()} characters`
                      : 'Supports plain text and PDF-extracted content'}
                  </span>
                  {content.length > 0 && (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" />
                      Ready for submission
                    </span>
                  )}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !isReady}
                className="btn-primary w-full py-4 text-base tracking-wide"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Resume...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5" /> Submit for AI Analysis
                  </span>
                )}
              </button>

              {!isReady && !parsing && (
                <p className="text-center text-xs text-zinc-600 font-medium -mt-2">
                  Fill in both the title and resume content to enable submission
                </p>
              )}
            </form>
          </div>
        </main>
      </div>
    </AnimatedLayout>
  );
}
