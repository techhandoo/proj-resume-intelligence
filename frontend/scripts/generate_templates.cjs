/**
 * Resume template generator.
 *
 * Produces a PDF and a DOCX file for every template in TEMPLATES, each with its
 * own layout, colors, and realistic content, into public/templates/.
 *
 *   npm run generate:templates
 *
 * Dependencies: pdfkit (dev) and docx (dev) — see package.json.
 */
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const {
  Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel,
  Table, TableRow, TableCell, WidthType, BorderStyle,
} = require('docx');

const templatesDir = path.join(__dirname, '../public/templates');
fs.mkdirSync(templatesDir, { recursive: true });

// ────────────────────────────────────────────────────────────────────────────
// Template definitions — content, styling, and layout variant per template.
// ────────────────────────────────────────────────────────────────────────────

const TEMPLATES = [
  {
    id: 'executive-suite',
    name: 'Executive Suite',
    category: 'Executive',
    blurb: 'Formal, commanding layout for C-suite and leadership applications. Serif typography, restrained color.',
    accent: '#1F2937',
    layout: 'centered',
    serif: true,
    rating: 4.9,
    downloads: 12480,
    featured: true,
    content: {
      name: 'Jonathan P. Mercer',
      role: 'Chief Technology Officer',
      email: 'j.mercer@exec.com',
      phone: '+1 (415) 555-0142',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/jonathanmercer',
      summary: 'Technology executive with 18+ years scaling engineering organizations at high-growth companies. Track record of building platforms that moved $400M+ in annual revenue, leading 300+ engineers across three continents, and modernizing legacy infrastructure without business interruption.',
      experience: [
        { title: 'Chief Technology Officer', org: 'Vertex Cloud, San Francisco, CA', dates: '2020 - Present', bullets: [
            'Led engineering org of 320+ staff across 6 countries; grew platform revenue from $90M to $410M ARR.',
            'Directed $28M infrastructure modernization program, cutting cloud spend 34% while doubling uptime to 99.99%.',
            'Established the company\u2019s first ML platform, now powering 12 product lines with $18M annual savings.',
        ] },
        { title: 'VP of Engineering', org: 'Nova Systems, Austin, TX', dates: '2015 - 2020', bullets: [
            'Scaled the engineering team from 18 to 140 while shipping 3 major product lines to 2M+ users.',
            'Introduced org-wide SRE practice, reducing mean time to recovery from 4 hours to 22 minutes.',
        ] },
      ],
      skills: ['Executive Leadership', 'Strategic Planning', 'M&A Technology Due Diligence', 'Cloud Architecture', 'P&L Management', 'Board Reporting', 'Talent Development', 'Security & Compliance'],
      education: [{ degree: 'M.S. in Computer Science', school: 'Stanford University', note: '2009' }],
      extras: [{ title: 'BOARD & ADVISORY', items: ['Board advisor, Launchpad Ventures (2021 - Present)', 'Guest lecturer, Stanford GSB (2019 - Present)'] }],
    },
  },
  {
    id: 'tech-standard',
    name: 'Tech Standard',
    category: 'Tech',
    blurb: 'The reliable engineering resume: clean sans-serif, blue accents, keyword-dense sections that ATS parsers love.',
    accent: '#2563EB',
    layout: 'band',
    serif: false,
    rating: 4.8,
    downloads: 9820,
    featured: true,
    content: {
      name: 'Aarav Sharma',
      role: 'Senior Software Engineer',
      email: 'aarav.sharma@devmail.com',
      phone: '+1 (206) 555-0173',
      location: 'Seattle, WA',
      linkedin: 'linkedin.com/in/aaravsharma',
      summary: 'Senior full-stack engineer with 8+ years building high-throughput web platforms. Specialized in TypeScript, React, Node.js, and distributed systems on AWS; shipped products used by 5M+ monthly users.',
      experience: [
        { title: 'Senior Software Engineer', org: 'Brightpath, Seattle, WA', dates: '2021 - Present', bullets: [
            'Architected a real-time analytics dashboard processing 40K events/sec, cutting p95 latency 58%.',
            'Led migration of 30+ services to Kubernetes, improving deployment frequency 3x with zero downtime.',
            'Mentored 6 engineers; drove adoption of typed contracts (zod/OpenAPI) reducing integration bugs 45%.',
        ] },
        { title: 'Software Engineer', org: 'Loop Financial, Seattle, WA', dates: '2018 - 2021', bullets: [
            'Built payment processing flows handling $2.1B in annual transaction volume.',
            'Designed PostgreSQL schemas and caching layers that cut read latency 70% under peak load.',
        ] },
        { title: 'Junior Engineer', org: 'Hatch Labs, Portland, OR', dates: '2016 - 2018', bullets: [
            'Shipped React features adopted by 200K daily active users; grew test coverage from 22% to 84%.',
        ] },
      ],
      skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Kubernetes', 'Docker', 'AWS', 'GraphQL', 'Redis', 'CI/CD', 'Microservices', 'System Design'],
      education: [{ degree: 'B.S. in Computer Science', school: 'University of Washington', note: '2016' }],
      extras: [{ title: 'CERTIFICATIONS', items: ['AWS Certified Solutions Architect - Professional (2023)', 'Certified Kubernetes Administrator (2022)'] }],
    },
  },
  {
    id: 'creative-director',
    name: 'Creative Director',
    category: 'Creative',
    blurb: 'Bold magenta header band and expressive layout for design, brand, and creative leadership roles.',
    accent: '#DB2777',
    layout: 'band',
    serif: false,
    rating: 4.7,
    downloads: 6110,
    featured: false,
    content: {
      name: 'Sofia Reyes',
      role: 'Creative Director / Brand Designer',
      email: 'sofia@reyes.studio',
      phone: '+1 (310) 555-0118',
      location: 'Los Angeles, CA',
      linkedin: 'linkedin.com/in/sofiareyes',
      summary: 'Award-winning creative director with 12+ years leading brand systems for D2C and entertainment clients. Work featured in Awwwards and Behance (2.4M views); led rebrands that lifted brand recall 41% and conversion 27%.',
      experience: [
        { title: 'Creative Director', org: 'Northwind Studio, Los Angeles, CA', dates: '2019 - Present', bullets: [
            'Directed a 9-person creative team delivering 40+ brand engagements a year for clients including 3 Fortune 500 brands.',
            'Rebranded a national retail chain; net promoter score rose 23 points and e-commerce conversion +27%.',
            'Won 6 industry awards including Awwwards Site of the Day (2022, 2024).',
        ] },
        { title: 'Senior Designer', org: 'Fieldwork, New York, NY', dates: '2015 - 2019', bullets: [
            'Designed identity systems and campaigns for 30+ consumer brands.',
            'Built a reusable design-token system adopted across all studio projects, cutting delivery time 35%.',
        ] },
      ],
      skills: ['Brand Identity', 'Art Direction', 'Design Systems', 'Typography', 'Motion Design', 'Figma', 'After Effects', 'Client Strategy', 'Team Leadership', '3D & Prototyping'],
      education: [{ degree: 'B.F.A. in Graphic Design', school: 'Pratt Institute', note: '2015' }],
      extras: [{ title: 'SELECTED AWARDS', items: ['Awwwards Site of the Day x2 (2022, 2024)', 'Webby Nominee - Brand Experience (2023)', 'Type Directors Club - Certificate of Excellence (2021)'] }],
    },
  },
  {
    id: 'ats-optimized-classic',
    name: 'ATS Optimized Classic',
    category: 'ATS Optimized',
    blurb: 'Plain, single-column, standard headings — built to pass applicant tracking system parsers with 100% extraction.',
    accent: '#111827',
    layout: 'minimal',
    serif: false,
    rating: 4.9,
    downloads: 15430,
    featured: true,
    content: {
      name: 'Marcus Chen',
      role: 'Operations Manager',
      email: 'marcus.chen@opsmail.com',
      phone: '+1 (312) 555-0190',
      location: 'Chicago, IL',
      linkedin: 'linkedin.com/in/marcuschen',
      summary: 'Operations manager with 9+ years optimizing supply chain and warehouse operations. Reduced operating costs 22% while improving on-time delivery to 98.4% across a 6-state distribution network.',
      experience: [
        { title: 'Operations Manager', org: 'Midwest Logistics Group, Chicago, IL', dates: '2020 - Present', bullets: [
            'Manage daily operations for 4 distribution centers with 260 staff and $120M annual throughput.',
            'Implemented warehouse automation and slotting that cut pick times 31% and error rates 42%.',
            'Negotiated carrier contracts saving $1.8M annually while improving on-time delivery to 98.4%.',
        ] },
        { title: 'Distribution Supervisor', org: 'Falcon Freight, Indianapolis, IN', dates: '2016 - 2020', bullets: [
            'Supervised 45 staff across receiving, storage, and shipping; reduced shrinkage from 1.9% to 0.6%.',
            'Launched a safety program that cut recordable incidents 55% in two years.',
        ] },
      ],
      skills: ['Supply Chain Management', 'Lean Six Sigma', 'Warehouse Automation', 'Budgeting', 'Vendor Management', 'KPI Reporting', 'Process Improvement', 'Team Leadership'],
      education: [{ degree: 'B.S. in Business Administration, Supply Chain', school: 'Indiana University', note: '2016' }],
      extras: [{ title: 'CERTIFICATIONS', items: ['Lean Six Sigma Green Belt (2019)', 'Certified Supply Chain Professional - CSCP (2021)'] }],
    },
  },
  {
    id: 'minimalist-pro',
    name: 'Minimalist Pro',
    category: 'Simple',
    blurb: 'Generous whitespace, thin gray rules, and quiet typography for a confident, uncluttered impression.',
    accent: '#6B7280',
    layout: 'minimal',
    serif: false,
    rating: 4.6,
    downloads: 7205,
    featured: false,
    content: {
      name: 'Elena Petrova',
      role: 'Product Manager',
      email: 'elena.petrova@pmail.com',
      phone: '+1 (212) 555-0161',
      location: 'New York, NY',
      linkedin: 'linkedin.com/in/elenapetrova',
      summary: 'Product manager with 7+ years shipping B2B SaaS. Own the full lifecycle from discovery to GA; delivered 3 products that reached $1M+ ARR each within 18 months of launch.',
      experience: [
        { title: 'Senior Product Manager', org: 'Clerkly, New York, NY', dates: '2021 - Present', bullets: [
            'Own product strategy for the billing platform ($24M ARR); shipped 40+ releases with a 4-person squad.',
            'Ran discovery with 120+ customers, prioritizing a self-serve flow that lifted activation 34%.',
            'Partnered with engineering to cut infrastructure cost per customer 28% via usage-tier redesign.',
        ] },
        { title: 'Product Manager', org: 'Orbit Analytics, Boston, MA', dates: '2018 - 2021', bullets: [
            'Launched a reporting module that became the #1 upsell, contributing 19% of new revenue.',
            'Introduced weekly experimentation cadence; ran 60+ A/B tests with $2.3M attributable lift.',
        ] },
      ],
      skills: ['Product Strategy', 'Roadmapping', 'Customer Discovery', 'A/B Testing', 'SQL', 'Amplitude', 'Figma', 'Agile / Scrum', 'GTM Collaboration', 'Pricing'],
      education: [{ degree: 'M.B.A.', school: 'NYU Stern School of Business', note: '2018' }],
      extras: [],
    },
  },
  {
    id: 'modern-startup',
    name: 'Modern Startup',
    category: 'Simple',
    blurb: 'Emerald accents and a tight, energetic layout made for fast-moving teams and growth-stage companies.',
    accent: '#059669',
    layout: 'band',
    serif: false,
    rating: 4.7,
    downloads: 8940,
    featured: false,
    content: {
      name: 'Noah Williams',
      role: 'Full-Stack Developer',
      email: 'noah@buildit.dev',
      phone: '+1 (512) 555-0123',
      location: 'Austin, TX',
      linkedin: 'linkedin.com/in/noahwilliams',
      summary: 'Full-stack developer with 6+ years shipping consumer and developer tools. Fast, pragmatic, and product-obsessed: built features used by 1.2M weekly active users and open-source tooling with 4.1k GitHub stars.',
      experience: [
        { title: 'Full-Stack Developer', org: 'Tinker, Austin, TX', dates: '2022 - Present', bullets: [
            'Ship end-to-end features across React, Node, and Postgres; own 3 product surfaces used by 1.2M WAU.',
            'Cut cold-start latency 62% by moving to edge functions and reworking the data layer.',
            'Built internal CLI and design system adopted by all 8 product squads.',
        ] },
        { title: 'Software Developer', org: 'Copper Labs, Remote', dates: '2019 - 2022', bullets: [
            'Developed a realtime collaboration engine (WebSockets + CRDTs) powering 90K concurrent sessions.',
            'Contributed to the open-source community; authored 2 libraries with 4.1k combined GitHub stars.',
        ] },
      ],
      skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Edge Functions', 'WebSockets', 'Vite', 'Tailwind CSS', 'AWS', 'Open Source'],
      education: [{ degree: 'B.S. in Computer Science', school: 'University of Texas at Austin', note: '2019' }],
      extras: [{ title: 'OPEN SOURCE', items: ['Author: fast-queue (message queue for edge runtimes)', 'Maintainer: component-lib (design system, 2.1k stars)'] }],
    },
  },
  {
    id: 'academic-scholar',
    name: 'Academic Scholar',
    category: 'Academic',
    blurb: 'Serif typography with publications-first layout, ideal for faculty, research, and postdoc applications.',
    accent: '#92400E',
    layout: 'centered',
    serif: true,
    rating: 4.5,
    downloads: 3890,
    featured: false,
    content: {
      name: 'Dr. Amara Okafor',
      role: 'Research Scientist / Assistant Professor',
      email: 'a.okafor@univ.edu',
      phone: '+1 (617) 555-0154',
      location: 'Cambridge, MA',
      linkedin: 'linkedin.com/in/amaraokafor',
      summary: 'Computational biologist with a Ph.D. in Bioinformatics and 30+ peer-reviewed publications (12 as first author, h-index 14). 8 years of experience leading multi-institutional research projects and securing $4.2M in grant funding.',
      experience: [
        { title: 'Research Scientist', org: 'Harvard Medical School, Cambridge, MA', dates: '2020 - Present', bullets: [
            'Lead the single-cell genomics pipeline group; authored 9 papers including 2 in Nature Methods.',
            'Awarded $2.1M NIH R01 as co-PI for AI-driven biomarker discovery in oncology.',
            'Mentor 4 Ph.D. students and 6 postdocs; teach graduate bioinformatics (enrollment 90+/term).',
        ] },
        { title: 'Postdoctoral Fellow', org: 'MIT / Whitehead Institute, Cambridge, MA', dates: '2016 - 2020', bullets: [
            'Developed an open-source analysis framework used by 200+ labs worldwide (4.8k citations).',
            'Collaborated on 3 international consortia; presented 12 invited talks at major conferences.',
        ] },
      ],
      skills: ['Bioinformatics', 'Machine Learning', 'Statistical Genomics', 'Python', 'R', 'Single-Cell Analysis', 'Grant Writing', 'Scientific Publishing', 'Teaching & Mentoring'],
      education: [{ degree: 'Ph.D. in Bioinformatics', school: 'University of California, Berkeley', note: '2016' }, { degree: 'B.S. in Biochemistry', school: 'University of Lagos', note: '2011' }],
      extras: [{ title: 'SELECTED PUBLICATIONS', items: ['Okafor A, et al. (2024) "Scalable single-cell integration". Nature Methods.', 'Okafor A, et al. (2022) "Deep learning for early cancer detection". Cell Reports Medicine.'] }],
    },
  },
  {
    id: 'medical-professional',
    name: 'Medical Professional',
    category: 'Professional',
    blurb: 'Two-column layout with a calm teal sidebar for contact and credentials — built for clinical roles.',
    accent: '#0F766E',
    layout: 'sidebar',
    serif: false,
    rating: 4.6,
    downloads: 5210,
    featured: false,
    content: {
      name: 'Rachel Kim, BSN, RN',
      role: 'Registered Nurse - Critical Care',
      email: 'rachel.kim@hospmail.org',
      phone: '+1 (214) 555-0182',
      location: 'Dallas, TX',
      linkedin: 'linkedin.com/in/rachelkimrn',
      summary: 'Critical care registered nurse with 8+ years in Level I trauma and cardiac ICUs. ACLS/PALS certified, charge-nurse experienced, and recognized twice with the DAISY Award for extraordinary nursing care.',
      experience: [
        { title: 'Critical Care RN', org: 'St. Luke\u2019s Medical Center, Dallas, TX', dates: '2019 - Present', bullets: [
            'Manage care for 2-3 ventilated patients per shift in a 24-bed cardiac ICU; maintain 100% adherence to safety protocols.',
            'Serve as charge nurse for 8-12 staff; led a sepsis bundle initiative that cut ICU mortality 18%.',
            'Precept 6-8 new graduate nurses per year; achieved unit\u2019s highest patient satisfaction scores (94th percentile).',
        ] },
        { title: 'Medical-Surgical RN', org: 'Methodist Hospital, Houston, TX', dates: '2016 - 2019', bullets: [
            'Delivered direct patient care for 5-6 patients per shift across medical-surgical and step-down units.',
            'Trained 10+ staff on new EHR workflows, reducing documentation errors 35%.',
        ] },
      ],
      skills: ['Critical Care', 'Ventilator Management', 'ACLS / PALS / BLS', 'Hemodynamics', 'Central Line Care', 'EHR (Epic)', 'Patient Education', 'Charge Nurse Leadership'],
      education: [{ degree: 'B.S. in Nursing', school: 'Texas Christian University', note: '2016' }],
      extras: [{ title: 'CERTIFICATIONS', items: ['Registered Nurse - Texas Board of Nursing (Active)', 'ACLS, PALS, BLS - American Heart Association (2024)'] }],
    },
  },
  {
    id: 'engineering-bold',
    name: 'Engineering Bold',
    category: 'Tech',
    blurb: 'Confident orange sidebar with a skills matrix up front — for platform, DevOps, and infrastructure engineers.',
    accent: '#EA580C',
    layout: 'sidebar',
    serif: false,
    rating: 4.7,
    downloads: 7640,
    featured: false,
    content: {
      name: 'Dmitri Volkov',
      role: 'Platform / DevOps Engineer',
      email: 'dmitri@infra.dev',
      phone: '+1 (303) 555-0168',
      location: 'Denver, CO',
      linkedin: 'linkedin.com/in/dmitrivo',
      summary: 'Platform engineer with 9+ years designing reliable infrastructure for high-traffic products. Terraform + Kubernetes + AWS specialist; operate a fleet of 1,400 nodes serving 40K requests/sec with 99.98% uptime.',
      experience: [
        { title: 'Staff Platform Engineer', org: 'Relay Networks, Denver, CO', dates: '2021 - Present', bullets: [
            'Own the Kubernetes platform (1,400 nodes, 900 microservices); raised SLO attainment to 99.98%.',
            'Authored the company\u2019s infrastructure-as-code standards (Terraform) adopted across 45 teams.',
            'Cut deployment lead time from 2 days to 40 minutes via progressive delivery and automated canaries.',
        ] },
        { title: 'Senior DevOps Engineer', org: 'Cascade Cloud, Boulder, CO', dates: '2017 - 2021', bullets: [
            'Migrated 200+ workloads from VM sprawl to managed Kubernetes, cutting infra spend 38%.',
            'Built a self-serve CI/CD platform; 2,400 pipelines/month with a 99.9% success rate.',
        ] },
      ],
      skills: ['Kubernetes', 'Terraform', 'AWS', 'CI/CD', 'Prometheus', 'Grafana', 'Argo CD', 'Python', 'Go', 'Linux', 'Networking', 'SRE Practices'],
      education: [{ degree: 'B.S. in Computer Engineering', school: 'Colorado School of Mines', note: '2017' }],
      extras: [{ title: 'CERTIFICATIONS', items: ['CKA & CKS - Certified Kubernetes (2022)', 'HashiCorp Certified: Terraform Associate (2023)'] }],
    },
  },
  {
    id: 'finance-specialist',
    name: 'Finance Specialist',
    category: 'Executive',
    blurb: 'Deep-green banded header with a numbers-forward layout for finance, accounting, and analyst roles.',
    accent: '#166534',
    layout: 'band',
    serif: false,
    rating: 4.6,
    downloads: 4580,
    featured: false,
    content: {
      name: 'Priya Nair, CFA',
      role: 'Senior Financial Analyst',
      email: 'priya.nair@finmail.com',
      phone: '+1 (646) 555-0178',
      location: 'New York, NY',
      linkedin: 'linkedin.com/in/priyanair',
      summary: 'CFA charterholder with 8+ years in corporate finance and FP&A. Model 3-year forecasts for a $1.2B portfolio, cut forecasting cycle 45% with automated pipelines, and partner with leadership on $60M+ capital decisions.',
      experience: [
        { title: 'Senior Financial Analyst', org: 'Meridian Capital, New York, NY', dates: '2020 - Present', bullets: [
            'Own FP&A for a $1.2B business unit; delivered board-ready reporting that improved forecast accuracy 22%.',
            'Automated the monthly close and forecast process (Excel + SQL + Python), saving 180 analyst-hours/month.',
            'Modeled 12 acquisition scenarios; supported a $60M acquisition completed 2 months ahead of plan.',
        ] },
        { title: 'Financial Analyst', org: 'Brightline Holdings, New York, NY', dates: '2017 - 2020', bullets: [
            'Built driver-based revenue models used across 5 business lines, guiding a 15% margin expansion.',
            'Produced weekly variance analysis for the CFO; identified $4.1M in annual cost savings.',
        ] },
      ],
      skills: ['Financial Modeling', 'FP&A', 'Forecasting', 'Variance Analysis', 'Excel / VBA', 'SQL', 'Python', 'Tableau', 'M&A Support', 'Board Reporting'],
      education: [{ degree: 'B.S. in Finance, magna cum laude', school: 'Fordham University', note: '2017' }],
      extras: [{ title: 'CERTIFICATIONS', items: ['CFA Charterholder (2021)', 'Financial Modeling & Valuation Analyst - FMVA (2019)'] }],
    },
  },
];

// ────────────────────────────────────────────────────────────────────────────
// PDF generation (pdfkit)
// ────────────────────────────────────────────────────────────────────────────

function buildPdf(t) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'LETTER' });
    const out = path.join(templatesDir, `${t.id}.pdf`);
    const stream = fs.createWriteStream(out);
    doc.pipe(stream);
    stream.on('finish', resolve);
    stream.on('error', reject);

    const c = t.content;
    const accent = t.accent;
    const serif = t.serif;
    const SANS = { regular: 'Helvetica', bold: 'Helvetica-Bold', italic: 'Helvetica-Oblique' };
    const SERIF = { regular: 'Times-Roman', bold: 'Times-Bold', italic: 'Times-Italic' };
    const F = serif ? SERIF : SANS;

    const W = doc.page.width - 100; // usable width

    const sectionTitle = (label) => {
      doc.font(F.bold).fontSize(11).fillColor(accent).text(label.toUpperCase());
      const y = doc.y;
      doc.moveTo(50, y + 4).lineTo(50 + W, y + 4).lineWidth(0.8).strokeColor(accent).stroke();
      doc.moveDown(0.7);
    };

    const jobEntry = (job) => {
      doc.font(F.bold).fontSize(10.5).fillColor('#111827').text(`${job.title}  |  ${job.org}`);
      doc.font(F.regular).fontSize(9).fillColor('#6B7280').text(job.dates);
      doc.moveDown(0.25);
      doc.font(F.regular).fontSize(9.5).fillColor('#374151');
      for (const b of job.bullets) {
        doc.text(`\u2022  ${b}`, { indent: 0 });
        doc.moveDown(0.15);
      }
      doc.moveDown(0.4);
    };

    const educationBlock = (edu) => {
      for (const e of edu) {
        doc.font(F.bold).fontSize(10.5).fillColor('#111827').text(e.degree);
        doc.font(F.regular).fontSize(9).fillColor('#6B7280').text(`${e.school}  \u2022  ${e.note}`);
        doc.moveDown(0.4);
      }
    };

    const bulletsList = (items, color = '#374151') => {
      doc.font(F.regular).fontSize(9.5).fillColor(color);
      for (const item of items) {
        doc.text(`\u2022  ${item}`);
        doc.moveDown(0.15);
      }
    };

    // ── Header by layout ──
    if (t.layout === 'band') {
      const bandH = 118;
      doc.rect(0, 0, doc.page.width, bandH).fill(accent);
      doc.font(F.bold).fontSize(24).fillColor('#FFFFFF').text(c.name, 50, 32, { align: 'left', width: W });
      doc.font(F.regular).fontSize(12).fillColor('#E5E7EB').text(c.role, 50, 62, { width: W });
      doc.font(F.regular).fontSize(8.5).fillColor('#D1D5DB').text(
        `${c.email}   |   ${c.phone}   |   ${c.location}   |   ${c.linkedin}`, 50, 84, { width: W });
      doc.y = bandH + 28;
    } else if (t.layout === 'sidebar') {
      const sideW = 165;
      doc.rect(0, 0, sideW, doc.page.height).fill(accent);
      doc.font(F.bold).fontSize(15).fillColor('#FFFFFF').text(c.name, 24, 40, { width: sideW - 40 });
      doc.font(F.regular).fontSize(9.5).fillColor('#E5E7EB').text(c.role, 24, 62, { width: sideW - 40 });
      doc.moveDown(2);
      doc.font(F.regular).fontSize(8).fillColor('#D1D5DB');
      doc.text(`\u2709 ${c.email}`, 24, undefined, { width: sideW - 40 });
      doc.text(`\u260E ${c.phone}`, 24, undefined, { width: sideW - 40 });
      doc.text(c.location, 24, undefined, { width: sideW - 40 });
      doc.text(c.linkedin, 24, undefined, { width: sideW - 40 });
      doc.moveDown(1.5);
      doc.font(F.bold).fontSize(10).fillColor('#FFFFFF').text('SKILLS');
      doc.moveDown(0.3);
      doc.font(F.regular).fontSize(8.5).fillColor('#F3F4F6');
      for (const s of c.skills) {
        doc.text(`\u2022  ${s}`, 24, undefined, { width: sideW - 40 });
        doc.moveDown(0.12);
      }
      doc.x = sideW + 30;
      doc.y = 40;
    } else {
      // centered / minimal
      const nameSize = t.layout === 'minimal' ? 22 : 26;
      doc.font(F.bold).fontSize(nameSize).fillColor(accent).text(c.name, 50, 40, { align: 'center', width: W });
      doc.font(F.regular).fontSize(12).fillColor('#374151').text(c.role, 50, undefined, { align: 'center', width: W });
      doc.font(F.regular).fontSize(8.5).fillColor('#6B7280').text(
        `${c.email}   |   ${c.phone}   |   ${c.location}   |   ${c.linkedin}`, 50, undefined, { align: 'center', width: W });
      if (t.layout === 'minimal') {
        doc.moveDown(0.8);
        doc.moveTo(50, doc.y).lineTo(50 + W, doc.y).lineWidth(0.6).strokeColor('#D1D5DB').stroke();
        doc.moveDown(1);
      } else {
        doc.moveDown(1.4);
        doc.moveTo(50, doc.y).lineTo(50 + W, doc.y).lineWidth(1).strokeColor(accent).stroke();
        doc.moveDown(1);
      }
    }

    // ── Summary ──
    sectionTitle('Professional Summary');
    doc.font(F.regular).fontSize(9.5).fillColor('#374151').text(c.summary);
    doc.moveDown(0.8);

    // ── Experience ──
    sectionTitle('Professional Experience');
    for (const job of c.experience) jobEntry(job);

    // ── Skills ──
    if (t.layout !== 'sidebar') {
      sectionTitle('Core Skills');
      bulletsList(c.skills);
    }

    // ── Education ──
    sectionTitle('Education');
    educationBlock(c.education);

    // ── Extras ──
    for (const extra of c.extras) {
      sectionTitle(extra.title);
      bulletsList(extra.items);
    }

    doc.end();
  });
}

// ────────────────────────────────────────────────────────────────────────────
// DOCX generation (docx)
// ────────────────────────────────────────────────────────────────────────────

function accentNoHash(hex) {
  return hex.replace('#', '');
}

function buildDocx(t) {
  const c = t.content;
  const accent = accentNoHash(t.accent);

  const heading = (label) => new Paragraph({
    children: [new TextRun({ text: label.toUpperCase(), bold: true, color: accent, size: 22 })],
    spacing: { before: 240, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: accent, space: 2 } },
  });

  const jobPara = (job) => [
    new Paragraph({
      children: [new TextRun({ text: `${job.title}  |  ${job.org}`, bold: true, size: 21 })],
      spacing: { before: 120, after: 20 },
    }),
    new Paragraph({ children: [new TextRun({ text: job.dates, italics: true, color: '6B7280', size: 18 })] }),
    ...job.bullets.map((b) => new Paragraph({
      children: [new TextRun({ text: b, size: 20 })],
      bullet: { level: 0 },
    })),
  ];

  const eduPara = (edu) => edu.flatMap((e) => [
    new Paragraph({ children: [new TextRun({ text: e.degree, bold: true, size: 21 })], spacing: { before: 80 } }),
    new Paragraph({ children: [new TextRun({ text: `${e.school}  \u2022  ${e.note}`, color: '6B7280', size: 18 })] }),
  ]);

  const body = [
    // Summary
    heading('Professional Summary'),
    new Paragraph({ children: [new TextRun({ text: c.summary, size: 20 })], spacing: { after: 120 } }),
    // Experience
    heading('Professional Experience'),
    ...c.experience.flatMap(jobPara),
    // Skills
    heading('Core Skills'),
    new Paragraph({ children: [new TextRun({ text: c.skills.join('   \u2022   '), size: 20 })], spacing: { after: 120 } }),
    // Education
    heading('Education'),
    ...eduPara(c.education),
    // Extras
    ...c.extras.flatMap((extra) => [
      heading(extra.title),
      ...extra.items.map((item) => new Paragraph({
        children: [new TextRun({ text: item, size: 20 })],
        bullet: { level: 0 },
      })),
    ]),
  ];

  // Header paragraph(s) by layout
  let header;
  if (t.layout === 'band') {
    header = [
      new Paragraph({
        children: [new TextRun({ text: c.name, bold: true, color: 'FFFFFF', size: 40 })],
        alignment: AlignmentType.LEFT,
        shading: { fill: accent },
        spacing: { before: 120, after: 40 },
        indent: { left: 200, right: 200 },
      }),
      new Paragraph({
        children: [new TextRun({ text: c.role, color: 'FFFFFF', size: 22 })],
        shading: { fill: accent },
        spacing: { after: 40 },
        indent: { left: 200, right: 200 },
      }),
      new Paragraph({
        children: [new TextRun({ text: `${c.email} | ${c.phone} | ${c.location} | ${c.linkedin}`, color: 'FFFFFF', size: 16 })],
        shading: { fill: accent },
        spacing: { after: 160 },
        indent: { left: 200, right: 200 },
      }),
    ];
  } else if (t.layout === 'sidebar') {
    const sideCell = (children) => new TableCell({
      width: { size: 30, type: WidthType.PERCENTAGE },
      shading: { fill: accent },
      margins: { top: 300, bottom: 300, left: 200, right: 150 },
      children,
    });
    const mainCell = (children) => new TableCell({
      width: { size: 70, type: WidthType.PERCENTAGE },
      margins: { top: 200, bottom: 300, left: 300, right: 200 },
      children,
    });
    header = [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              sideCell([
                new Paragraph({ children: [new TextRun({ text: c.name, bold: true, color: 'FFFFFF', size: 30 })], spacing: { after: 60 } }),
                new Paragraph({ children: [new TextRun({ text: c.role, color: 'E5E7EB', size: 18 })], spacing: { after: 200 } }),
                new Paragraph({ children: [new TextRun({ text: c.email, color: 'D1D5DB', size: 16 })], spacing: { after: 40 } }),
                new Paragraph({ children: [new TextRun({ text: c.phone, color: 'D1D5DB', size: 16 })], spacing: { after: 40 } }),
                new Paragraph({ children: [new TextRun({ text: c.location, color: 'D1D5DB', size: 16 })], spacing: { after: 40 } }),
                new Paragraph({ children: [new TextRun({ text: c.linkedin, color: 'D1D5DB', size: 16 })], spacing: { after: 300 } }),
                new Paragraph({ children: [new TextRun({ text: 'SKILLS', bold: true, color: 'FFFFFF', size: 20 })], spacing: { after: 80 } }),
                ...c.skills.map((s) => new Paragraph({
                  children: [new TextRun({ text: `\u2022  ${s}`, color: 'F3F4F6', size: 16 })],
                  spacing: { after: 20 },
                })),
              ]),
              mainCell(body),
            ],
          }),
        ],
      }),
    ];
  } else {
    // centered / minimal
    header = [
      new Paragraph({
        children: [new TextRun({ text: c.name, bold: true, color: accent, size: 44 })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 120, after: 40 },
      }),
      new Paragraph({
        children: [new TextRun({ text: c.role, size: 24 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
      }),
      new Paragraph({
        children: [new TextRun({ text: `${c.email} | ${c.phone} | ${c.location} | ${c.linkedin}`, color: '6B7280', size: 16 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
        border: t.layout === 'minimal'
          ? { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'D1D5DB', space: 4 } }
          : { bottom: { style: BorderStyle.SINGLE, size: 8, color: accent, space: 4 } },
      }),
    ];
  }

  const document = new Document({
    styles: {
      default: {
        document: { run: { font: t.serif ? 'Times New Roman' : 'Calibri', size: 20 } },
      },
    },
    sections: [{ properties: {}, children: [...header, ...(t.layout === 'sidebar' ? [] : body)] }],
  });

  return Packer.toBuffer(document);
}

// ────────────────────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────────────────────

(async () => {
  for (const t of TEMPLATES) {
    try {
      await buildPdf(t);
      const buffer = await buildDocx(t);
      fs.writeFileSync(path.join(templatesDir, `${t.id}.docx`), buffer);
      console.log(`generated  ${t.id}.pdf  +  ${t.id}.docx`);
    } catch (err) {
      console.error(`FAILED for ${t.id}:`, err.message);
      process.exitCode = 1;
    }
  }
  console.log(`\nDone. ${TEMPLATES.length} templates written to ${templatesDir}`);
})();
