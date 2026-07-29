import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AnimatedLayout from '../components/AnimatedLayout';
import { Target, Mail, PenTool, Loader2 } from 'lucide-react';
import api from '../lib/api';

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

  return (
    <AnimatedLayout className="vibrant-bg min-h-screen relative">
      <div className="vibrant-overlay" />
      <div className="relative z-10">
        <Navbar />

        <main className="max-w-[1440px] mx-auto px-6 sm:px-14 py-12">
          {/* Header */}
          <div className="page-header">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link to="/dashboard" className="text-sm font-semibold text-slate-400 hover:text-blue-400 transition-colors">
                  Dashboard
                </Link>
                <span className="text-slate-600">/</span>
                <span className="text-sm font-semibold text-blue-400">Cover Letter</span>
              </div>
              <h1 className="page-title">AI Cover Letter Generator</h1>
              <p className="page-subtitle max-w-xl">
                Paste the job description below, and our AI will write a highly tailored cover letter based on your extracted resume profile.
              </p>
            </div>
          </div>

          <div className="section-divider mb-10" />

          {/* Split Screen Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Left Panel: Input */}
            <div className="glass-card p-8 flex flex-col h-[650px]">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
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
                  className="form-input bg-slate-900/60"
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
            <div className="glass-card p-8 flex flex-col h-[650px] relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <span className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-blue-400">
                  <Mail className="w-5 h-5" />
                </span>
                <h2 className="text-lg font-bold text-white tracking-tight">Generated Cover Letter</h2>
              </div>
              
              <div className="flex-1 bg-slate-900/60 border border-white/[0.05] rounded-xl p-6 overflow-y-auto relative z-10">
                {coverLetter ? (
                  <div className="prose prose-invert max-w-none text-slate-300 text-[15px] leading-relaxed whitespace-pre-wrap font-sans">
                    {coverLetter}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                    <PenTool className="w-10 h-10 mb-4 text-slate-400" />
                    <p className="text-slate-400 font-medium">Your generated cover letter will appear here.</p>
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
