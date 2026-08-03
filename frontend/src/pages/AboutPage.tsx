import AppLayout from '../components/AppLayout';
import { Monitor, Server, Brain, Rocket, UploadCloud, FileSearch, Lightbulb, ShieldCheck, BarChart3 } from 'lucide-react';

const techStack = [
  {
    category: 'Frontend',
    color: 'blue',
    icon: <Monitor className="w-5 h-5" />,
    items: [
      { name: 'React 18', desc: 'Component-based UI with hooks and concurrent rendering' },
      { name: 'TypeScript', desc: 'Typed JavaScript for scalable, safe code' },
      { name: 'Vite', desc: 'Lightning-fast build tool and dev server' },
      { name: 'Tailwind CSS v4', desc: 'Utility-first CSS with zero-config setup' },
      { name: 'React Router v7', desc: 'Client-side routing with protected guards' },
    ],
  },
  {
    category: 'Backend',
    color: 'indigo',
    icon: <Server className="w-5 h-5" />,
    items: [
      { name: 'Spring Boot 3.4', desc: 'Production-grade Java framework' },
      { name: 'Spring Security + JWT', desc: 'Stateless auth with HS512-signed tokens' },
      { name: 'Spring Data JPA', desc: 'Repository pattern with Hibernate ORM' },
      { name: 'Spring AMQP', desc: 'RabbitMQ integration for async queuing' },
      { name: 'Spring AI', desc: 'Groq LLM via OpenAI-compatible API' },
    ],
  },
  {
    category: 'AI & Data',
    color: 'teal',
    icon: <Brain className="w-5 h-5" />,
    items: [
      { name: 'Groq Cloud API', desc: '500+ tokens/sec ultra-fast inference' },
      { name: 'LLaMA 3.3 70B', desc: "Meta's flagship open-weight model" },
      { name: 'PostgreSQL 15', desc: 'Production relational database via Docker' },
      { name: 'RabbitMQ', desc: 'Message broker for async AI pipeline' },
    ],
  },
  {
    category: 'Infrastructure',
    color: 'amber',
    icon: <Rocket className="w-5 h-5" />,
    items: [
      { name: 'Docker Compose', desc: 'Multi-service orchestration' },
      { name: 'Maven Wrapper', desc: 'Reproducible builds with pinned version' },
      { name: 'BCrypt', desc: 'Adaptive password hashing' },
    ],
  },
];

const features = [
  {
    icon: <UploadCloud className="w-6 h-6" />,
    title: 'Resume Upload',
    desc: 'Upload .txt or PDF resumes via drag-and-drop. PDFs are parsed client-side with PDF.js before submission.',
    color: 'blue',
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: 'AI Analysis Pipeline',
    desc: 'Resumes are queued via RabbitMQ and processed asynchronously by a Spring worker sending prompts to Groq LLM.',
    color: 'indigo',
  },
  {
    icon: <FileSearch className="w-6 h-6" />,
    title: 'Skill Extraction',
    desc: 'The LLM extracts skills, estimates experience, identifies education, and generates a professional summary.',
    color: 'teal',
  },
  {
    icon: <Lightbulb className="w-6 h-6" />,
    title: 'AI Recommendations',
    desc: 'Each resume gets actionable improvement suggestions tailored to modern job market expectations.',
    color: 'amber',
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: 'Secure Auth',
    desc: 'JWT-based stateless authentication with BCrypt passwords. Tokens expire after 24 hours.',
    color: 'emerald',
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Dashboard Analytics',
    desc: 'Real-time stats on total, analyzed, in-queue, and failed resumes with a sortable history table.',
    color: 'purple',
  },
];

const colorMap: Record<string, { border: string; iconBg: string; iconColor: string; dot: string; title: string }> = {
  blue:    { border: 'border-blue-500/20',    iconBg: 'bg-blue-500/10',    iconColor: 'text-blue-400',    dot: 'bg-blue-500',    title: 'text-blue-300'    },
  indigo:  { border: 'border-indigo-500/20',  iconBg: 'bg-indigo-500/10',  iconColor: 'text-indigo-400',  dot: 'bg-indigo-500',  title: 'text-indigo-300'  },
  teal:    { border: 'border-teal-500/20',    iconBg: 'bg-teal-500/10',    iconColor: 'text-teal-400',    dot: 'bg-teal-500',    title: 'text-teal-300'    },
  amber:   { border: 'border-amber-500/20',   iconBg: 'bg-amber-500/10',   iconColor: 'text-amber-400',   dot: 'bg-amber-500',   title: 'text-amber-300'   },
  emerald: { border: 'border-emerald-500/20', iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-400', dot: 'bg-emerald-500', title: 'text-emerald-300' },
  purple:  { border: 'border-purple-500/20',  iconBg: 'bg-purple-500/10',  iconColor: 'text-purple-400',  dot: 'bg-purple-500',  title: 'text-purple-300'  },
};

export default function AboutPage() {
  return (
    <AppLayout>
      <main className="max-w-5xl mx-auto pl-10 pr-6 sm:pl-32 sm:pr-12 pt-10 sm:pt-16 pb-10 w-full">

        {/* ── Page Title ── */}
        <div className="mt-12 sm:mt-24 mb-16 text-center flex flex-col items-center">
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3">About the Platform</h1>
          <p className="text-slate-400 text-[14.5px] leading-relaxed max-w-lg mx-auto">
            An end-to-end AI-powered resume intelligence system built with modern full-stack technologies.
          </p>
        </div>

        <div className="section-divider mb-10" />

        {/* ── How It Works ── */}
        <section className="mb-14 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">How It Works</h2>
          <p className="text-slate-500 text-sm mb-10 text-center">A fully asynchronous pipeline from upload to AI-generated insights</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {features.map((f) => {
              const c = colorMap[f.color];
              return (
                <div
                  key={f.title}
                  className={`glass-card p-8 flex flex-col items-center text-center gap-5 border ${c.border} hover:-translate-y-1 transition-transform duration-200`}
                >
                  <div className={`w-12 h-12 rounded-2xl ${c.iconBg} border ${c.border} flex items-center justify-center ${c.iconColor} flex-shrink-0`}>
                    {f.icon}
                  </div>
                  <div className="flex flex-col items-center">
                    <h3 className="text-[16px] font-bold text-white mb-2">{f.title}</h3>
                    <p className="text-slate-400 text-[13.5px] leading-[1.8]">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="section-divider mb-10" />

        {/* ── Architecture Flow ── */}
        <section className="mb-14 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">Architecture</h2>
          <p className="text-slate-500 text-sm mb-10 text-center">Layered MVC with a decoupled async AI pipeline</p>

          <div className="glass-card p-10 flex flex-col items-center text-center w-full">
            <p className="text-slate-300 text-[14px] leading-[2.0] mb-8 max-w-3xl mx-auto">
              The backend uses a <strong className="text-white">layered MVC architecture</strong> with a clear separation between
              controllers, services, and repositories. The AI pipeline is fully decoupled via{' '}
              <strong className="text-white">RabbitMQ</strong> — uploads are accepted instantly, then processed
              asynchronously so the API stays responsive at all times.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-2 text-xs font-semibold">
              {['React', '→', 'Vite Proxy', '→', 'Spring Boot', '→', 'RabbitMQ', '→', 'AI Worker', '→', 'Groq LLM'].map((s, i) =>
                s === '→'
                  ? <span key={i} className="text-slate-600 text-sm">→</span>
                  : <span key={i} className="px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-slate-300">{s}</span>
              )}
            </div>
          </div>
        </section>

        <div className="section-divider mb-10" />

        {/* ── Tech Stack ── */}
        <section className="mb-8 flex flex-col items-center w-full">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">Technology Stack</h2>
          <p className="text-slate-500 text-sm mb-10 text-center">Modern, production-grade tools across the full stack</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
            {techStack.map((section) => {
              const c = colorMap[section.color];
              return (
                <div key={section.category} className={`glass-card overflow-hidden border ${c.border} flex flex-col items-center text-center`}>
                  <div className={`px-7 py-6 border-b ${c.border} w-full flex flex-col items-center justify-center gap-4`}>
                    <div className="flex items-center gap-3">
                      <span className={`${c.iconColor} scale-125`}>{section.icon}</span>
                      <h3 className={`text-[16px] font-extrabold ${c.title}`}>{section.category}</h3>
                    </div>
                    <span className={`text-[10px] font-bold px-4 py-1.5 rounded-full border ${c.iconBg} ${c.border} ${c.title} uppercase tracking-wider`}>
                      {section.items.length} tools
                    </span>
                  </div>
                  <div className="px-7 py-8 space-y-8 w-full flex flex-col items-center">
                    {section.items.map((item, i) => (
                      <div key={i} className="flex flex-col items-center gap-2.5">
                        <div className={`w-4 h-1 rounded-full ${c.dot} opacity-70`} />
                        <div className="flex flex-col items-center">
                          <p className="text-[15px] font-bold text-white">{item.name}</p>
                          <p className="text-[13.5px] text-slate-400 leading-relaxed mt-1.5 max-w-sm">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </main>
    </AppLayout>
  );
}
