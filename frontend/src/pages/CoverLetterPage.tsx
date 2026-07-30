import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AnimatedLayout from '../components/AnimatedLayout';
import { Target, Mail, PenTool, Loader2, Download, FileText } from 'lucide-react';
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

  useEffect(() => {
    // Fetch all user resumes to populate the dropdown
    api.get('/resumes').then(res => {
      const fetchedResumes = res.data;
      setResumes(fetchedResumes);
      if (!selectedResumeId && fetchedResumes.length > 0) {
        setSelectedResumeId(fetchedResumes[0].id);
      }
    }).catch(() => {
      setError('Failed to load resumes. Please try again.');
    });
  }, [selectedResumeId]);

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
        jobDescription
      });
      setCoverLetter(response.data.coverLetterMarkdown);
    } catch (err: any) {
      setError('Failed to generate cover letter. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = () => {
    const element = document.getElementById('cover-letter-content');
    if (!element) return;
    const opt = {
      margin: 1,
      filename: 'Aura_Cover_Letter.pdf',
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const }
    };
    html2pdf().set(opt).from(element).save();
  };

  const exportWord = async () => {
    if (!coverLetter) return;
    const paragraphs = coverLetter.split('\n').map(line => 
      new Paragraph({
        children: [new TextRun(line)],
      })
    );
    const doc = new Document({ sections: [{ properties: {}, children: paragraphs }] });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Aura_Cover_Letter.docx");
  };

  return (
    <AnimatedLayout className="vibrant-bg min-h-screen relative">
      <div className="vibrant-overlay" />
      <div className="relative z-10">
        <Navbar />

        <main className="max-w-[1440px] mx-auto px-6 sm:px-14 py-12">
          {/* Header */}
          <div className="page-header text-left">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Link to="/dashboard" className="text-sm font-semibold text-zinc-500 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <span className="text-zinc-700">/</span>
                <span className="text-sm font-bold text-white">Cover Letter</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">AI Cover Letter Generator</h1>
              <p className="text-[15px] leading-relaxed text-zinc-400 max-w-xl">
                Paste the job description below, and Aura AI will write a highly tailored cover letter based on your extracted resume profile.
              </p>
            </div>
          </div>

          <div className="section-divider mb-10" />

          {/* Split Screen Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Left Panel: Input */}
            <div className="glass-card p-8 flex flex-col h-[650px]">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
                  <Target className="w-5 h-5" />
                </span>
                <h2 className="text-lg font-bold text-white tracking-tight">Target Job Description</h2>
              </div>
              
              <div className="mb-4">
                <label className="form-label">Select Candidate Resume</label>
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  disabled={loading || resumes.length === 0}
                  className="form-input bg-black"
                >
                  {resumes.length === 0 && <option value="">No resumes found...</option>}
                  {resumes.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.fileName} (Uploaded: {new Date(r.uploadedAt).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>

              <label className="form-label mt-2">Job Description</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                className="form-input flex-1 resize-none font-mono text-sm leading-relaxed mb-6"
                disabled={loading}
              />
              
              {error && <p className="text-rose-400 text-sm font-semibold mb-4 text-center">{error}</p>}
              
              <button 
                onClick={generateCoverLetter} 
                disabled={loading || !selectedResumeId}
                className="btn-primary w-full py-4 text-base mt-auto flex-shrink-0"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Writing Cover Letter...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <PenTool className="w-4 h-4" /> Generate Cover Letter
                  </span>
                )}
              </button>
            </div>

            {/* Right Panel: Output */}
            <div className="glass-card p-8 flex flex-col h-[650px] relative overflow-hidden group">
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
                    <Mail className="w-5 h-5" />
                  </span>
                  <h2 className="text-lg font-bold text-white tracking-tight">Generated Cover Letter</h2>
                </div>
                {coverLetter && (
                  <div className="flex items-center gap-2">
                    <button onClick={exportPDF} className="btn-secondary btn-sm flex items-center gap-1.5 px-3 py-1.5" title="Download PDF">
                      <Download className="w-4 h-4" /> PDF
                    </button>
                    <button onClick={exportWord} className="btn-secondary btn-sm flex items-center gap-1.5 px-3 py-1.5" title="Download Word">
                      <FileText className="w-4 h-4" /> Word
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex-1 bg-black border border-white/[0.05] rounded-xl p-6 overflow-y-auto relative z-10">
                {coverLetter ? (
                  <div id="cover-letter-content" className="prose prose-invert max-w-none text-zinc-300 text-[15px] leading-relaxed whitespace-pre-wrap font-sans">
                    {coverLetter}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                    <PenTool className="w-10 h-10 mb-4 text-zinc-600" />
                    <p className="text-zinc-500 font-medium">Your generated cover letter will appear here.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </AnimatedLayout>
  );
}
