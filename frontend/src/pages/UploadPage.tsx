import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as pdfjsLib from 'pdfjs-dist';
import AppLayout from '../components/AppLayout';
import { UploadCloud, FileText, File, AlertCircle, Loader2, CheckCircle, Zap } from 'lucide-react';
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

  const contentValue = watch('content');
  const isReady = contentValue.trim().length >= 10 && !parsing;

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
      <div className="w-full max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="page-title">Upload Resume</h1>
          <p className="page-subtitle">
            Upload a PDF, TXT file, or paste content directly to run an AI analysis.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-md bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            <p className="text-rose-500 text-[13px] font-medium leading-snug">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="glass-card p-6">
            <label htmlFor="fileName" className="form-label">Resume Title</label>
            <input
              id="fileName"
              type="text"
              {...register('fileName')}
              disabled={isSubmitting}
              className={`form-input ${errors.fileName ? 'border-rose-500 focus:border-rose-500' : ''}`}
              placeholder="e.g. John Doe - Full Stack Developer"
            />
            {errors.fileName ? (
              <p className="mt-1.5 text-[12px] text-rose-500">{errors.fileName.message}</p>
            ) : (
              <p className="mt-1.5 text-[12px] text-zinc-500">This will be used to identify your resume in the dashboard.</p>
            )}
          </div>

          <div className="glass-card p-6">
            <label className="form-label mb-4">Resume Content</label>
            
            {/* Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="mb-6 border border-dashed border-[#262626] hover:border-zinc-500 rounded-lg py-8 px-6 text-center bg-[#050505] transition-colors cursor-pointer"
            >
              {parsing ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-6 h-6 text-zinc-400 animate-spin" />
                  <p className="text-[13px] font-medium text-zinc-300">Extracting text from PDF...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <UploadCloud className="w-8 h-8 text-zinc-500 mb-3" />
                  <p className="text-[13px] font-medium text-zinc-200 mb-1">
                    Click or drag file to this area to upload
                  </p>
                  <p className="text-[12px] text-zinc-500 mb-4">Supports .pdf and .txt files</p>
                  <label className="btn-secondary btn-sm cursor-pointer">
                    Browse Files
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

            {/* File type indicator */}
            {fileType && contentValue && !parsing && (
              <div className="mb-4 inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] font-medium border bg-[#171717] border-[#262626] text-zinc-300">
                {fileType === 'pdf' ? (
                  <><File className="w-3.5 h-3.5" /> PDF Parsed</>
                ) : (
                  <><FileText className="w-3.5 h-3.5" /> TXT Loaded</>
                )}
              </div>
            )}

            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-[#1f1f22]" />
              <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">or paste manually</span>
              <div className="flex-1 h-px bg-[#1f1f22]" />
            </div>

            <textarea
              id="content"
              {...register('content')}
              disabled={isSubmitting}
              rows={12}
              className={`form-input resize-y font-mono text-[12px] leading-relaxed ${errors.content ? 'border-rose-500 focus:border-rose-500' : ''}`}
              placeholder="Paste raw resume text here..."
            />
            {errors.content && (
              <p className="mt-1.5 text-[12px] text-rose-500">{errors.content.message}</p>
            )}

            <div className="flex items-center justify-between mt-3">
              <span className="text-[11px] text-zinc-500">
                {contentValue.length} characters
              </span>
              {isReady && (
                <span className="text-[11px] text-emerald-500 font-medium flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> Ready
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !isReady}
              className="btn-primary min-w-[160px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Run AI Analysis
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
