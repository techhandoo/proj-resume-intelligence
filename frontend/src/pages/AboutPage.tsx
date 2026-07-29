import Navbar from '../components/Navbar';


const techStack = [
  {
    category: 'Frontend',
    color: 'blue',
    icon: '🖥️',
    items: [
      { name: 'React 18', desc: 'Component-based UI library with hooks and concurrent rendering' },
      { name: 'TypeScript', desc: 'Typed JavaScript for safer, more scalable code' },
      { name: 'Vite', desc: 'Lightning-fast build tool and development server' },
      { name: 'Tailwind CSS v4', desc: 'Utility-first CSS framework with zero-config setup' },
      { name: 'React Router v7', desc: 'Client-side routing with protected route guards' },
      { name: 'Axios', desc: 'HTTP client with interceptors for auth and error handling' },
      { name: 'PDF.js', desc: 'In-browser PDF text extraction for resume uploads' },
    ],
  },
  {
    category: 'Backend',
    color: 'indigo',
    icon: '⚙️',
    items: [
      { name: 'Spring Boot 3.4', desc: 'Production-grade Java framework with auto-configuration' },
      { name: 'Spring Security', desc: 'JWT-based stateless authentication and authorization' },
      { name: 'Spring Data JPA', desc: 'Repository pattern with Hibernate ORM for database access' },
      { name: 'Spring AMQP', desc: 'RabbitMQ integration for async resume processing queue' },
      { name: 'Spring AI', desc: 'Groq LLM integration via OpenAI-compatible API' },
      { name: 'Flyway', desc: 'Database schema versioning and migration management' },
      { name: 'Lombok', desc: 'Boilerplate reduction with annotation-based code generation' },
    ],
  },
  {
    category: 'AI & Data',
    color: 'teal',
    icon: '🤖',
    items: [
      { name: 'Groq Cloud API', desc: 'Ultra-fast LLM inference — 500+ tokens/second throughput' },
      { name: 'LLaMA 3.3 70B', desc: 'Meta\'s flagship open-weight model for deep text understanding' },
      { name: 'H2 Database', desc: 'Embedded file-based SQL database — zero setup required' },
      { name: 'PostgreSQL 15', desc: 'Production-ready relational database via Docker' },
      { name: 'RabbitMQ', desc: 'Message broker for decoupled async AI analysis pipeline' },
    ],
  },
  {
    category: 'Infrastructure',
    color: 'amber',
    icon: '🚀',
    items: [
      { name: 'Docker Compose', desc: 'Multi-service orchestration for Postgres and RabbitMQ' },
      { name: 'Maven Wrapper', desc: 'Reproducible builds with pinned Maven version' },
      { name: 'JWT (JJWT 0.12)', desc: 'HS512-signed tokens with 24-hour expiry' },
      { name: 'BCrypt', desc: 'Adaptive password hashing with configurable work factor' },
    ],
  },
];

const features = [
  {
    icon: '📤',
    title: 'Resume Upload',
    desc: 'Upload plain-text (.txt) or PDF resumes via drag-and-drop or file browse. PDFs are parsed client-side using PDF.js before submission.',
  },
  {
    icon: '🧠',
    title: 'AI Analysis Pipeline',
    desc: 'Uploaded resumes are queued via RabbitMQ and processed asynchronously by a Spring worker that sends structured prompts to the Groq LLM.',
  },
  {
    icon: '🔍',
    title: 'Skill Extraction',
    desc: 'The LLM extracts technical and soft skills, estimates years of experience, identifies education background, and generates a professional summary.',
  },
  {
    icon: '💡',
    title: 'AI Recommendations',
    desc: 'Each analyzed resume receives a list of actionable improvement suggestions tailored to modern job market expectations.',
  },
  {
    icon: '🔐',
    title: 'Secure Auth',
    desc: 'JWT-based stateless authentication with BCrypt-hashed passwords. Tokens expire after 24 hours and are automatically cleared on expiry.',
  },
  {
    icon: '📊',
    title: 'Dashboard Analytics',
    desc: 'Real-time stats on total, analyzed, in-queue, and failed resumes with a sortable history table and quick access to individual reports.',
  },
];

const colorMap: Record<string, { border: string; bg: string; badge: string; dot: string; title: string }> = {
  blue: { border: 'border-blue-500/20', bg: 'bg-blue-500/8', badge: 'bg-blue-500/10 border-blue-500/20 text-blue-300', dot: 'bg-blue-500', title: 'text-blue-300' },
  indigo: { border: 'border-indigo-500/20', bg: 'bg-indigo-500/8', badge: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300', dot: 'bg-indigo-500', title: 'text-indigo-300' },
  teal: { border: 'border-teal-500/20', bg: 'bg-teal-500/8', badge: 'bg-teal-500/10 border-teal-500/20 text-teal-300', dot: 'bg-teal-500', title: 'text-teal-300' },
  amber: { border: 'border-amber-500/20', bg: 'bg-amber-500/8', badge: 'bg-amber-500/10 border-amber-500/20 text-amber-300', dot: 'bg-amber-500', title: 'text-amber-300' },
};

export default function AboutPage() {
  return (
    <div className="vibrant-bg min-h-screen relative overflow-x-hidden flex flex-col justify-between">
      <div className="vibrant-overlay" />
      <div className="hero-glow" />
      <div className="hero-glow-secondary" />
      <div className="relative z-10">
        <Navbar />

        <main className="max-w-[1440px] w-full mx-auto px-6 sm:px-12 py-16 flex flex-col items-center">

          {/* ── 1. Hero Section Removed ── */}
          <div className="section-divider my-10" />

          {/* ── 2. How It Works — Symmetrical Grid ── */}
          <div className="mb-20">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-extrabold text-white tracking-tight mb-4 text-center">
                How It Works
              </h2>
              <p className="text-slate-400 text-[15px] leading-[1.85] max-w-xl mx-auto text-center">
                A fully asynchronous pipeline from upload to AI-generated insights
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="glass-card px-8 py-10 glass-card-hover flex flex-col items-center text-center justify-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-3xl mb-6 shadow-md">
                    {f.icon}
                  </div>
                  <h3 className="text-[17px] font-bold text-white mb-3 text-center tracking-tight">
                    {f.title}
                  </h3>
                  <p className="text-slate-400 text-[14px] leading-[1.9] text-center">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="section-divider my-20" />

          {/* ── 3. Architecture Card — Pure Symmetrical Centered Box In-Between ── */}
          <div className="my-20 flex justify-center">
            <div className="glass-card p-10 sm:p-12 text-center max-w-3xl w-full mx-auto flex flex-col items-center justify-center shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-3xl mb-6 shadow-md">
                🏗️
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-5 tracking-tight text-center">
                Architecture
              </h3>

              <p className="text-slate-400 text-[15px] sm:text-[16px] leading-[2.05] mb-8 text-center max-w-2xl mx-auto font-normal px-2">
                PROJ uses a <strong className="text-slate-200 font-semibold">layered MVC architecture</strong> on the backend
                with a clear separation between controllers, services, and repositories.
                The AI pipeline is fully decoupled via <strong className="text-slate-200 font-semibold">RabbitMQ</strong> — uploads are
                accepted instantly, then processed asynchronously so the API stays responsive.
                The frontend communicates through a <strong className="text-slate-200 font-semibold">Vite proxy</strong> in development
                and can be served as a static bundle behind a reverse proxy in production.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs font-semibold w-full">
                {['React', '→', 'Vite Proxy', '→', 'Spring Boot', '→', 'RabbitMQ', '→', 'AI Worker', '→', 'Groq LLM'].map((s, i) => (
                  s === '→'
                    ? <span key={i} className="text-slate-600 text-base">→</span>
                    : <span key={i} className="px-3.5 py-1.5 bg-slate-800/80 border border-slate-700/60 rounded-xl text-slate-300 shadow-sm">{s}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="section-divider my-20" />

          {/* ── 4. Technology Stack — Centered Grid & Cards ── */}
          <div className="mb-16">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-extrabold text-white tracking-tight mb-4 text-center">
                Technology Stack
              </h2>
              <p className="text-slate-400 text-[15px] leading-[1.85] max-w-xl mx-auto text-center">
                Built with modern, production-grade tools across the full stack
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
              {techStack.map((section) => {
                const c = colorMap[section.color];
                return (
                  <div key={section.category} className={`glass-card overflow-hidden border ${c.border}`}>
                    {/* Section header */}
                    <div className={`px-8 py-5 border-b ${c.border} ${c.bg} flex items-center justify-between`}>
                      <div className="flex items-center gap-3.5">
                        <span className="text-2xl">{section.icon}</span>
                        <h3 className={`text-[16px] font-extrabold tracking-tight ${c.title}`}>
                          {section.category}
                        </h3>
                      </div>
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${c.badge}`}>
                        {section.items.length} technologies
                      </span>
                    </div>

                    {/* Tech items */}
                    <div className="px-8 py-6 space-y-4">
                      {section.items.map((item, i) => (
                        <div key={i} className="flex items-start gap-4">
                          <div className={`w-2.5 h-2.5 rounded-full ${c.dot} flex-shrink-0 mt-[6px]`} />
                          <div className="text-left">
                            <span className="text-[14px] font-bold text-white">{item.name}</span>
                            <span className="text-slate-500 mx-2 text-xs">—</span>
                            <span className="text-[13.5px] text-slate-400 leading-[1.75]">{item.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
