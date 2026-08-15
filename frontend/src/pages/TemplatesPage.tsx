import { useState, useMemo } from 'react';
import AppLayout from '../components/AppLayout';
import TemplatePreview from '../components/templates/TemplatePreview';
import { Search, Download, FileText, File, Sparkles, Star, ShieldCheck, TrendingUp, SlidersHorizontal, LayoutGrid } from 'lucide-react';
import { TEMPLATES, TEMPLATE_CATEGORIES, templateFile } from '../lib/templates';
import type { TemplateMeta } from '../lib/templates';

type SortKey = 'featured' | 'downloads' | 'rating' | 'name';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'featured', label: 'Featured' },
  { key: 'downloads', label: 'Most Downloaded' },
  { key: 'rating', label: 'Top Rated' },
  { key: 'name', label: 'Name A–Z' },
];

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5 text-[var(--color-warning)]" title={`${rating} / 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`w-3 h-3 ${i <= Math.round(rating) ? 'fill-[var(--color-warning)]' : 'opacity-25'}`} />
      ))}
      <span className="ml-1 text-[11px] font-bold text-text-primary font-mono">{rating.toFixed(1)}</span>
    </span>
  );
}

function formatDownloads(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : `${n}`;
}

function TemplateCard({ template }: { template: TemplateMeta }) {
  const pdfHref = templateFile(template, 'pdf');
  const docxHref = templateFile(template, 'docx');
  const baseName = template.name.replace(/\s+/g, '_');

  return (
    <article className="glass-card flex flex-col overflow-hidden group hover:border-accent/40 transition-all">
      {/* Preview */}
      <div className="relative bg-raised border-b border-border overflow-hidden p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.07] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <TemplatePreview
          template={template}
          className="w-full h-auto transition-transform duration-300 group-hover:scale-[1.03] drop-shadow-[0_6px_16px_rgba(0,0,0,0.08)]"
        />
        {/* Badges */}
        <div className="absolute top-5 left-5 flex items-center gap-1.5">
          <span className="badge badge-zinc text-[10px]">{template.category}</span>
          {template.featured && (
            <span className="badge badge-blue text-[10px]">
              <Sparkles className="w-3 h-3 text-[var(--color-accent-strong)]" /> Featured
            </span>
          )}
        </div>
        {template.category === 'ATS Optimized' && (
          <div className="absolute top-5 right-5">
            <span className="badge badge-emerald text-[10px]" title="Tested against common ATS parsers">
              <ShieldCheck className="w-3 h-3" /> ATS
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-bold text-text-primary group-hover:text-[var(--color-accent-strong)] transition-colors">
            {template.name}
          </h3>
          <Stars rating={template.rating} />
        </div>

        <p className="text-[11px] leading-relaxed text-text-muted mb-4 line-clamp-2 min-h-[2.5rem]">{template.blurb}</p>

        <div className="flex items-center gap-3 text-[10px] font-semibold text-text-muted mb-4">
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> {formatDownloads(template.downloads)} downloads
          </span>
          <span className="flex items-center gap-1">
            <LayoutGrid className="w-3 h-3" /> {template.layout === 'band' ? 'Banded header' : template.layout === 'sidebar' ? 'Sidebar layout' : template.layout === 'minimal' ? 'Minimal layout' : 'Formal layout'}
          </span>
        </div>

        <div className="mt-auto flex items-center gap-2">
          <a
            href={pdfHref}
            download={`${baseName}.pdf`}
            className="flex-1 btn-primary btn-sm py-2 flex items-center justify-center gap-1.5 text-xs font-bold"
          >
            <Download className="w-3.5 h-3.5" /> PDF
          </a>
          <a
            href={docxHref}
            download={`${baseName}.docx`}
            className="flex-1 btn-secondary btn-sm py-2 flex items-center justify-center gap-1.5 text-xs font-semibold"
          >
            <FileText className="w-3.5 h-3.5" /> Word
          </a>
        </div>
      </div>
    </article>
  );
}

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortKey, setSortKey] = useState<SortKey>('featured');

  const filteredTemplates = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = TEMPLATES.filter((t) => {
      const matchesSearch = !q || t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || t.blurb.toLowerCase().includes(q);
      const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    switch (sortKey) {
      case 'downloads':
        return [...list].sort((a, b) => b.downloads - a.downloads);
      case 'rating':
        return [...list].sort((a, b) => b.rating - a.rating);
      case 'name':
        return [...list].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return [...list].sort((a, b) => Number(b.featured) - Number(a.featured) || b.downloads - a.downloads);
    }
  }, [searchQuery, selectedCategory, sortKey]);

  return (
    <AppLayout>
      <div className="w-full max-w-[1280px] mx-auto space-y-8 pb-16">

        {/* ── Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Resume Templates</h1>
              <span className="badge badge-blue">
                <Sparkles className="w-3 h-3 text-[var(--color-accent-strong)]" /> {TEMPLATES.length} Premium Templates
              </span>
            </div>
            <p className="text-xs text-text-muted">
              Recruiter-approved, ATS-tested resume templates — download each as an editable Word document or a print-ready PDF.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                id="template-search"
                name="template-search"
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search templates"
                className="form-input py-2.5 pl-10 text-xs bg-raised"
              />
            </div>
            <div className="relative">
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
              <select
                id="template-sort"
                name="template-sort"
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as SortKey)}
                aria-label="Sort templates"
                className="form-input py-2.5 pl-9 pr-8 text-xs bg-raised cursor-pointer appearance-none"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.key} value={opt.key}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── Stats strip ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: FileText, label: `${TEMPLATES.length} templates`, sub: 'PDF + Word formats' },
            { icon: LayoutGrid, label: `${TEMPLATE_CATEGORIES.length - 1} categories`, sub: 'Role-matched designs' },
            { icon: ShieldCheck, label: 'ATS-tested', sub: 'Parser-safe structure' },
            { icon: TrendingUp, label: `${TEMPLATES.reduce((s, t) => s + t.downloads, 0).toLocaleString()}+ downloads`, sub: 'By professionals' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent-soft border border-accent/25 flex items-center justify-center text-[var(--color-accent-strong)] flex-shrink-0">
                <stat.icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-text-primary truncate">{stat.label}</p>
                <p className="text-[10px] text-text-muted truncate">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Category filters ── */}
        <div className="flex border-b border-border gap-2 overflow-x-auto pb-2 text-xs font-semibold select-none">
          {TEMPLATE_CATEGORIES.map((cat) => (
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
              <span className="ml-1.5 text-[10px] opacity-60">
                {cat === 'All' ? TEMPLATES.length : TEMPLATES.filter((t) => t.category === cat).length}
              </span>
            </button>
          ))}
        </div>

        {/* ── Grid ── */}
        {filteredTemplates.length === 0 ? (
          <div className="col-span-full py-20 text-center glass-card">
            <File className="w-10 h-10 text-text-subtle mx-auto mb-3" />
            <p className="text-text-secondary font-bold text-sm">No templates matching "{searchQuery}"</p>
            <p className="text-text-muted text-xs mt-1">Try another search term or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        )}

        {/* ── Footer strip ── */}
        <div className="glass-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-text-primary">Every template is ATS-friendly</p>
              <p className="text-[11px] text-text-muted mt-0.5 max-w-xl">
                Standard section headings, parseable dates, and keyword-dense structures — Word files are fully editable,
                PDFs are print-ready at letter size.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-text-muted flex-shrink-0">
            v1 · Updated August 2026
          </span>
        </div>

      </div>
    </AppLayout>
  );
}
