import { useState, useMemo } from 'react';
import AppLayout from '../components/AppLayout';
import { Search, Download, FileText, File, Sparkles, Star } from 'lucide-react';

const CATEGORIES = ['All', 'Executive', 'Tech', 'Creative', 'ATS Optimized', 'Simple'];

const dummyTemplates = Array.from({ length: 20 }, (_, i) => ({
  id: `template-${i + 1}`,
  name: [
    'Minimalist Pro', 'Creative Director', 'Tech Standard', 'Executive Suite', 'Startup Modern',
    'Academic Scholar', 'Corporate Classic', 'Designer Portfolio', 'Finance Specialist', 'Medical Professional',
    'Engineering Bold', 'Marketing Guru', 'Sales Closer', 'HR Manager', 'Consultant Elite',
    'Entry Level Clean', 'Senior Leader', 'Data Analyst', 'Product Manager', 'UX Researcher'
  ][i],
  category: ['Executive', 'Creative', 'Tech', 'ATS Optimized', 'Simple'][i % 5],
  rating: (4.7 + (i % 3) * 0.1).toFixed(1),
  pdfUrl: `/templates/resume-template.pdf`,
  docxUrl: `/templates/resume-template.docx`,
}));

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const filteredTemplates = useMemo(() => {
    return dummyTemplates.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <AppLayout>
      <div className="w-full max-w-[1280px] mx-auto space-y-8 pb-16">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Resume Templates</h1>
              <span className="badge badge-blue">
                <Sparkles className="w-3 h-3 text-[var(--color-accent-strong)]" /> ATS Optimized
              </span>
            </div>
            <p className="text-xs text-text-muted">
              Download recruiter-approved, ATS-tested resume templates in PDF and Word formats.
            </p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search template name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input py-2.5 pl-10 text-xs bg-raised"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex border-b border-border gap-2 overflow-x-auto pb-2 text-xs font-semibold select-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-accent-soft border border-accent/35 text-[var(--color-accent-strong)]'
                  : 'text-text-muted hover:text-text-primary hover:bg-surface-hover'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTemplates.length === 0 ? (
            <div className="col-span-full py-20 text-center glass-card">
              <FileText className="w-10 h-10 text-text-subtle mx-auto mb-3" />
              <p className="text-text-secondary font-bold text-sm">No templates matching "{searchQuery}"</p>
              <p className="text-text-muted text-xs mt-1">Try selecting another category filter.</p>
            </div>
          ) : (
            filteredTemplates.map(template => (
              <div key={template.id} className="glass-card flex flex-col overflow-hidden group hover:border-accent/35 transition-all">
                {/* Mockup Preview Area */}
                <div className="h-44 bg-raised border-b border-border flex flex-col items-center justify-center relative overflow-hidden p-4 text-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <FileText className="w-12 h-12 text-text-subtle group-hover:text-[var(--color-accent-strong)] transition-colors mb-2" />
                  <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">{template.category} Spec</span>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-text-primary group-hover:text-[var(--color-accent-strong)] transition-colors">{template.name}</h3>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[var(--color-warning)] font-mono">
                      <Star className="w-3 h-3 fill-[var(--color-warning)]" /> {template.rating}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <span className="badge badge-zinc text-[10px]">
                      {template.category}
                    </span>
                  </div>
                  
                  <div className="mt-auto flex items-center gap-2">
                    <a 
                      href={template.pdfUrl} 
                      download={`${template.name.replace(/\s+/g, '_')}.pdf`}
                      className="flex-1 btn-secondary btn-sm py-2 flex items-center justify-center gap-1.5 text-xs font-semibold"
                    >
                      <Download className="w-3.5 h-3.5" /> PDF
                    </a>
                    <a 
                      href={template.docxUrl} 
                      download={`${template.name.replace(/\s+/g, '_')}.docx`}
                      className="flex-1 btn-secondary btn-sm py-2 flex items-center justify-center gap-1.5 text-xs font-semibold"
                    >
                      <File className="w-3.5 h-3.5" /> Word
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
      </div>
    </AppLayout>
  );
}

