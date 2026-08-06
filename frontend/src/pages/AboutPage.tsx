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
      <main className="w-full flex flex-col items-center px-4 sm:px-8 py-10 pb-20">
        
        {/* ── Main Container (Centered strictly) ── */}
        <div className="w-full max-w-4xl flex flex-col items-center text-center">

          {/* ── Page Title ── */}
          <div className="mt-16 sm:mt-24 mb-16 flex flex-col items-center">
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
              About the <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Platform</span>
            </h1>
            <p className="text-slate-400 text-[15px] sm:text-base leading-relaxed max-w-xl mx-auto">
              An end-to-end AI-powered resume intelligence system built with modern full-stack technologies.
            </p>
          </div>

          <div className="w-full h-px bg-white/[0.05] mb-16" />

          {/* ── How It Works ── */}
          <section className="w-full flex flex-col items-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-3">How It Works</h2>
            <p className="text-slate-500 text-[14.5px] mb-10">A fully asynchronous pipeline from upload to AI-generated insights</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {features.map((f) => {
                const c = colorMap[f.color];
                return (
                  <div
                    key={f.title}
                    className={`glass-card p-8 flex flex-col items-center text-center gap-5 border ${c.border} transition-colors duration-300 hover:bg-white/[0.02]`}
                    style={{ transition: 'transform 200ms var(--ease-out), background-color 300ms ease' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-6px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div className={`w-14 h-14 rounded-2xl ${c.iconBg} border ${c.border} flex items-center justify-center ${c.iconColor}`}>
                      {f.icon}
                    </div>
                    <div className="flex flex-col items-center">
                      <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                      <p className="text-slate-400 text-[13.5px] leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <div className="w-full h-px bg-white/[0.05] mb-16" />

          {/* ── Architecture Flow ── */}
          <section className="w-full flex flex-col items-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-3">Architecture</h2>
            <p className="text-slate-500 text-[14.5px] mb-10">Layered MVC with a decoupled async AI pipeline</p>

            <div className="glass-card p-10 flex flex-col items-center text-center w-full shadow-lg border border-white/[0.05]">
              <p className="text-slate-300 text-[15px] leading-relaxed mb-8 max-w-2xl mx-auto">
                The backend uses a <strong className="text-white">layered MVC architecture</strong> with a clear separation between
                controllers, services, and repositories. The AI pipeline is fully decoupled via{' '}
                <strong className="text-white">RabbitMQ</strong> — uploads are accepted instantly, then processed
                asynchronously so the API stays responsive at all times.
              </p>
              <div className="flex flex-wrap justify-center items-center gap-3">
                {['React', '→', 'Vite Proxy', '→', 'Spring Boot', '→', 'RabbitMQ', '→', 'AI Worker', '→', 'Groq LLM'].map((s, i) =>
                  s === '→'
                    ? <span key={i} className="text-slate-600 font-bold">→</span>
                    : <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-slate-300 text-[13px] font-semibold">{s}</span>
                )}
              </div>
            </div>
          </section>

          <div className="w-full h-px bg-white/[0.05] mb-16" />

          {/* ── Tech Stack ── */}
          <section className="w-full flex flex-col items-center">
            <h2 className="text-3xl font-bold text-white mb-3">Technology Stack</h2>
            <p className="text-slate-500 text-[14.5px] mb-10">Modern, production-grade tools across the full stack</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {techStack.map((section) => {
                const c = colorMap[section.color];
                return (
                  <div key={section.category} className={`glass-card overflow-hidden border ${c.border} flex flex-col items-center text-center hover:bg-white/[0.02] transition-colors`}>
                    <div className={`px-8 py-6 border-b ${c.border} w-full flex flex-col items-center justify-center gap-3 bg-white/[0.01]`}>
                      <span className={`${c.iconColor} scale-125 mb-1`}>{section.icon}</span>
                      <h3 className={`text-xl font-extrabold ${c.title}`}>{section.category}</h3>
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${c.iconBg} ${c.border} ${c.title} uppercase tracking-widest`}>
                        {section.items.length} tools
                      </span>
                    </div>
                    <div className="px-8 py-8 w-full flex flex-col items-center gap-6">
                      {section.items.map((item, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <p className="text-base font-bold text-white mb-1">{item.name}</p>
                          <p className="text-[13.5px] text-slate-400 leading-relaxed max-w-[280px]">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

        </div>
      </main>
    </AppLayout>
  );
}
