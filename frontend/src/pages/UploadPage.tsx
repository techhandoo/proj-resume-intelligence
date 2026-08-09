import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as pdfjsLib from 'pdfjs-dist';
import AppLayout from '../components/AppLayout';
import { UploadCloud, FileText, File, AlertCircle, Loader2, CheckCircle2, Zap, Sparkles } from 'lucide-react';
import api from '../lib/api';

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

const uploadSchema = z.object({
  fileName: z.string().min(2, 'Resume title is required (min 2 characters)'),
  content: z.string().min(10, 'Resume content must be at least 10 characters for AI analysis'),
});

type UploadFormValues = z.infer<typeof uploadSchema>;

const SAMPLE_RESUME_CONTENT = `Johnathan Vance
Senior Full Stack Engineer & Cloud Architect
Email: j.vance@techcorp.io | Phone: +1 (555) 019-2834 | San Francisco, CA

PROFESSIONAL SUMMARY
Results-driven Senior Software Engineer with 7+ years of experience designing, building, and deploying microservice architectures and high-throughput web applications. Proven track record in TypeScript, React, Node.js, PostgreSQL, Docker, and AWS cloud infrastructures. Skilled in optimizing application performance, leading agile engineering teams, and building AI integrations.

CORE SKILLS
- Programming Languages: TypeScript, JavaScript, Python, SQL, Go
- Frontend Technologies: React 19, Next.js, Redux Toolkit, TailwindCSS, HTML5/CSS3
- Backend & Databases: Node.js, Express.js, FastAPI, PostgreSQL, Redis, Prisma ORM
- Cloud & DevOps: AWS (S3, EC2, Lambda), Docker, Kubernetes, CI/CD pipelines (GitHub Actions)
- AI & Analytics: OpenAI API, Groq LLM Inference, Vector Databases (Pinecone)

WORK EXPERIENCE
Senior Full Stack Developer | TechCorp Solutions, San Francisco, CA (2021 - Present)
- Architected and delivered a real-time analytics dashboard serving 250,000+ daily active users, reducing query latency by 45%.
- Migrated legacy monolith into containerized Node.js microservices using Docker and AWS ECS.
- Championed automated test coverage (Jest, Cypress) improving deployment stability by 35%.

Software Engineer | Apex Systems, Austin, TX (2018 - 2021)
- Built scalable web interfaces using React and Redux, increasing user engagement metrics by 28%.
- Integrated RESTful backend APIs and designed optimized PostgreSQL database schemas.

EDUCATION
Bachelor of Science in Computer Science | University of California, Berkeley (2014 - 2018)`;

export default function UploadPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [parsing, setParsing] = useState(false);
  const [fileType, setFileType] = useState<'txt' | 'pdf' | null>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      fileName: '',
      content: '',
    }
  });

  const contentValue = watch('content') || '';
  const isReady = contentValue.trim().length >= 10 && !parsing;

  const loadSampleData = () => {
    setValue('fileName', 'Johnathan Vance - Senior Full Stack Engineer', { shouldValidate: true });
    setValue('content', SAMPLE_RESUME_CONTENT, { shouldValidate: true });
    setFileType('txt');
    setError('');
  };

  const processFile = async (file: File) => {
    setError('');
    const isPDF = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    const isTXT = file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.text');

    if (!isPDF && !isTXT) {
      setError('Unsupported file type. Please upload a .pdf or .txt file.');
      return;
    }

    setValue('fileName', file.name.replace(/\.[^/.]+$/, ''), { shouldValidate: true });
    setFileType(isPDF ? 'pdf' : 'txt');

    if (isPDF) {
      setParsing(true);
      try {
        const text = await extractTextFromPDF(file);
        if (!text) {
          setError('Could not extract text from this PDF. It may be scanned or image-only.');
        } else {
          setValue('content', text, { shouldValidate: true });
        }
      } catch {
        setError('PDF parsing failed. Please paste the resume text manually below.');
      } finally {
        setParsing(false);
      }
    } else {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setValue('content', ev.target?.result as string, { shouldValidate: true });
      };
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

  const onSubmit = async (data: UploadFormValues) => {
    setError('');
    try {
      const res = await api.post('/resumes', data);
      navigate(`/resumes/${res.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Upload failed. Please verify and try again.');
    }
  };

  return (
    <AppLayout>
      <div className="w-full max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Upload Candidate Resume</h1>
            <p className="text-xs text-zinc-400 mt-1">
              Ingest a PDF or plain text resume to run real-time Groq LLM parsing and ATS evaluation.
            </p>
          </div>

          <button
            type="button"
            onClick={loadSampleData}
            className="btn-secondary py-2 px-4 text-xs font-semibold flex items-center gap-2 border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Load Sample Engineer Resume
          </button>
        </div>

        {/* Workflow Steps Indicator */}
        <div className="grid grid-cols-3 gap-3">
          <div className="glass-card p-3.5 flex items-center gap-3 border-blue-500/30">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 font-extrabold text-xs flex items-center justify-center">1</div>
            <div className="text-xs"><p className="font-bold text-white">Upload File</p><p className="text-[10px] text-zinc-500">PDF or TXT document</p></div>
          </div>
          <div className={`glass-card p-3.5 flex items-center gap-3 ${contentValue.length > 10 ? 'border-blue-500/30' : ''}`}>
            <div className="w-7 h-7 rounded-lg bg-zinc-800 text-zinc-300 font-extrabold text-xs flex items-center justify-center">2</div>
            <div className="text-xs"><p className="font-bold text-white">Review Text</p><p className="text-[10px] text-zinc-500">Normalized content</p></div>
          </div>
          <div className="glass-card p-3.5 flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-zinc-800 text-zinc-300 font-extrabold text-xs flex items-center justify-center">3</div>
            <div className="text-xs"><p className="font-bold text-white">Run AI Engine</p><p className="text-[10px] text-zinc-500">Groq LLM inference</p></div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <p className="text-rose-400 text-xs font-semibold leading-relaxed">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Resume Title Input */}
          <div className="glass-card p-6">
            <label htmlFor="fileName" className="form-label">Candidate Name / Resume Identifier</label>
            <input
              id="fileName"
              type="text"
              {...register('fileName')}
              disabled={isSubmitting}
              className={`form-input ${errors.fileName ? 'border-rose-500 focus:border-rose-500' : ''}`}
              placeholder="e.g. Johnathan Vance - Senior Full Stack Engineer"
            />
            {errors.fileName ? (
              <p className="mt-1.5 text-[11px] text-rose-400 font-medium">{errors.fileName.message}</p>
            ) : (
              <p className="mt-1.5 text-[11px] text-zinc-500">This title will identify the resume throughout your workspace dashboard.</p>
            )}
          </div>

          {/* Drag and Drop Zone */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="form-label mb-0">Document Content</label>
              {fileType && contentValue && !parsing && (
                <span className="badge badge-blue">
                  {fileType === 'pdf' ? <File className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                  {fileType.toUpperCase()} File Extracted
                </span>
              )}
            </div>
            
            {/* Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="mb-6 border-2 border-dashed border-[#22222a] hover:border-blue-500/50 rounded-2xl p-8 text-center bg-[#07070a] transition-all cursor-pointer group"
            >
              {parsing ? (
                <div className="flex flex-col items-center gap-3 py-4">
                  <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                  <p className="text-xs font-bold text-zinc-200">Parsing PDF structural text...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center py-2">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-colors mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-zinc-200 mb-1">
                    Drag and drop resume file here, or browse
                  </p>
                  <p className="text-xs text-zinc-500 mb-4">Supports standard PDF and plain text TXT documents</p>
                  <label className="btn-secondary btn-sm cursor-pointer font-semibold">
                    Browse Computer Files
                    <input
                      type="file"
                      accept=".pdf,.txt,.text"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 h-px bg-[#1c1c21]" />
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">or inspect & edit raw text</span>
              <div className="flex-1 h-px bg-[#1c1c21]" />
            </div>

            <textarea
              id="content"
              {...register('content')}
              disabled={isSubmitting}
              rows={10}
              className={`form-input resize-y font-mono text-xs leading-relaxed bg-[#050508] ${errors.content ? 'border-rose-500 focus:border-rose-500' : ''}`}
              placeholder="Paste raw candidate resume text here..."
            />
            {errors.content && (
              <p className="mt-1.5 text-[11px] text-rose-400 font-medium">{errors.content.message}</p>
            )}

            <div className="flex items-center justify-between mt-3 text-xs text-zinc-500 font-mono">
              <span>{contentValue.length} characters parsed</span>
              {isReady && (
                <span className="text-emerald-400 font-bold flex items-center gap-1.5 font-sans">
                  <CheckCircle2 className="w-4 h-4" /> Ready for AI Analysis
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !isReady}
              className="btn-primary py-3.5 px-8 text-xs font-bold shadow-xl shadow-blue-500/20 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Running Groq LLM Inference...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                  Execute AI Resume Analysis
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}

