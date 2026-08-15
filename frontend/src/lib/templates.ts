export type TemplateLayout = 'band' | 'sidebar' | 'centered' | 'minimal';

export interface TemplateMeta {
  id: string;
  name: string;
  category: string;
  blurb: string;
  accent: string;
  layout: TemplateLayout;
  rating: number;
  downloads: number;
  featured: boolean;
}

export const TEMPLATE_CATEGORIES = [
  'All', 'Executive', 'Tech', 'Creative', 'ATS Optimized', 'Simple', 'Academic', 'Professional',
];

export const TEMPLATES: TemplateMeta[] = [
  { id: 'executive-suite', name: 'Executive Suite', category: 'Executive', layout: 'centered', accent: '#1F2937', rating: 4.9, downloads: 12480, featured: true,
    blurb: 'Formal, commanding layout for C-suite and leadership applications. Serif typography, restrained color.' },
  { id: 'tech-standard', name: 'Tech Standard', category: 'Tech', layout: 'band', accent: '#2563EB', rating: 4.8, downloads: 9820, featured: true,
    blurb: 'The reliable engineering resume: clean sans-serif, blue accents, keyword-dense sections that ATS parsers love.' },
  { id: 'creative-director', name: 'Creative Director', category: 'Creative', layout: 'band', accent: '#DB2777', rating: 4.7, downloads: 6110, featured: false,
    blurb: 'Bold magenta header band and expressive layout for design, brand, and creative leadership roles.' },
  { id: 'ats-optimized-classic', name: 'ATS Optimized Classic', category: 'ATS Optimized', layout: 'minimal', accent: '#111827', rating: 4.9, downloads: 15430, featured: true,
    blurb: 'Plain, single-column, standard headings — built to pass applicant tracking system parsers with 100% extraction.' },
  { id: 'minimalist-pro', name: 'Minimalist Pro', category: 'Simple', layout: 'minimal', accent: '#6B7280', rating: 4.6, downloads: 7205, featured: false,
    blurb: 'Generous whitespace, thin gray rules, and quiet typography for a confident, uncluttered impression.' },
  { id: 'modern-startup', name: 'Modern Startup', category: 'Simple', layout: 'band', accent: '#059669', rating: 4.7, downloads: 8940, featured: false,
    blurb: 'Emerald accents and a tight, energetic layout made for fast-moving teams and growth-stage companies.' },
  { id: 'academic-scholar', name: 'Academic Scholar', category: 'Academic', layout: 'centered', accent: '#92400E', rating: 4.5, downloads: 3890, featured: false,
    blurb: 'Serif typography with publications-first layout, ideal for faculty, research, and postdoc applications.' },
  { id: 'medical-professional', name: 'Medical Professional', category: 'Professional', layout: 'sidebar', accent: '#0F766E', rating: 4.6, downloads: 5210, featured: false,
    blurb: 'Two-column layout with a calm teal sidebar for contact and credentials — built for clinical roles.' },
  { id: 'engineering-bold', name: 'Engineering Bold', category: 'Tech', layout: 'sidebar', accent: '#EA580C', rating: 4.7, downloads: 7640, featured: false,
    blurb: 'Confident orange sidebar with a skills matrix up front — for platform, DevOps, and infrastructure engineers.' },
  { id: 'finance-specialist', name: 'Finance Specialist', category: 'Executive', layout: 'band', accent: '#166534', rating: 4.6, downloads: 4580, featured: false,
    blurb: 'Deep-green banded header with a numbers-forward layout for finance, accounting, and analyst roles.' },
];

export const templateFile = (template: TemplateMeta, ext: 'pdf' | 'docx') => `/templates/${template.id}.${ext}`;
