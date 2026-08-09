import { useState, useMemo } from 'react';
import AppLayout from '../components/AppLayout';
import { Search, Download, FileText, File } from 'lucide-react';

// Generate 20 dummy templates
const dummyTemplates = Array.from({ length: 20 }, (_, i) => ({
  id: `template-${i + 1}`,
  name: [
    'Minimalist Pro', 'Creative Director', 'Tech Standard', 'Executive Suite', 'Startup Modern',
    'Academic Scholar', 'Corporate Classic', 'Designer Portfolio', 'Finance Specialist', 'Medical Professional',
    'Engineering Bold', 'Marketing Guru', 'Sales Closer', 'HR Manager', 'Consultant Elite',
    'Entry Level Clean', 'Senior Leader', 'Data Analyst', 'Product Manager', 'UX Researcher'
  ][i],
  category: ['Professional', 'Creative', 'Modern', 'Simple', 'Academic'][i % 5],
  pdfUrl: `/templates/resume-template.pdf`,
  docxUrl: `/templates/resume-template.docx`,
}));

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredTemplates = useMemo(() => {
    return dummyTemplates.filter(t => 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <AppLayout>
      <div className="w-full max-w-[1200px] mx-auto pb-16">
        
        {/* Header & Search */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold text-zinc-100 tracking-tight mb-2">Resume Templates</h1>
            <p className="text-[14px] text-zinc-400">
              Download premium templates optimized for ATS and modern recruiters.
            </p>
          </div>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search templates..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#1f1f22] rounded-md py-2.5 pl-9 pr-4 text-[14px] text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
            />
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTemplates.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <FileText className="w-10 h-10 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-400 font-medium">No templates found for "{searchQuery}"</p>
            </div>
          ) : (
            filteredTemplates.map(template => (
              <div key={template.id} className="glass-card flex flex-col overflow-hidden group">
                <div className="h-40 bg-[#171717] border-b border-[#1f1f22] flex items-center justify-center relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                   <FileText className="w-12 h-12 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-[15px] font-semibold text-zinc-100 mb-1">{template.name}</h3>
                  <span className="text-[12px] font-medium text-zinc-500 mb-4 bg-zinc-900 inline-block w-fit px-2 py-0.5 rounded border border-[#1f1f22]">
                    {template.category}
                  </span>
                  
                  <div className="mt-auto flex items-center gap-2 pt-2">
                    <a 
                      href={template.pdfUrl} 
                      download={`${template.name.replace(/\s+/g, '_')}.pdf`}
                      className="flex-1 btn-secondary btn-sm py-2 flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> PDF
                    </a>
                    <a 
                      href={template.docxUrl} 
                      download={`${template.name.replace(/\s+/g, '_')}.docx`}
                      className="flex-1 btn-secondary btn-sm py-2 flex items-center justify-center gap-1.5"
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
