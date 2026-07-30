import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import AnimatedLayout from '../components/AnimatedLayout';
import { FileText, Brain, Zap } from 'lucide-react';

const features = [
  {
    icon: <FileText className="w-8 h-8 text-blue-400" />,
    title: 'Smart Resume Ingestion',
    description: 'Instant text parsing with drop-and-upload capabilities built for modern recruiter workflows.',
    iconBg: 'bg-blue-500/10 border-blue-500/20',
  },
  {
    icon: <Brain className="w-8 h-8 text-indigo-400" />,
    title: 'Deep AI Analytics',
    description: 'Powered by advanced Groq LLM engines to extract structured candidate skills, metrics, and education.',
    iconBg: 'bg-indigo-500/10 border-indigo-500/20',
  },
  {
    icon: <Zap className="w-8 h-8 text-teal-400" />,
    title: 'Instant Recommendations',
    description: 'Receive automated candidate improvement suggestions and structured career insights in seconds.',
    iconBg: 'bg-teal-500/10 border-teal-500/20',
  },
];

export default function LandingPage() {
  return (
    <AnimatedLayout className="vibrant-bg min-h-screen relative overflow-x-hidden flex flex-col justify-between">
      <div className="vibrant-overlay" />
      <div className="hero-glow" />
      <div className="hero-glow-secondary" />

      {/* ── Floating Navbar ── */}
      <header className="fixed top-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto bg-black/80 backdrop-blur-lg border border-white/10 rounded-full px-2 py-2 flex items-center justify-between shadow-2xl shadow-black/50 w-full max-w-4xl">
          <div className="ml-2">
            <Logo size="sm" href="/" />
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
              Sign In
            </Link>
            <Link to="/register" className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold bg-white text-black hover:bg-zinc-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Content Area ── */}
      <main className="relative z-10 flex-1 w-full flex flex-col items-center justify-center px-6 sm:px-12 pt-28 pb-16">

        {/* Hero Section — Pure Centered Layout */}
        <div className="text-center max-w-4xl w-full mx-auto flex flex-col items-center justify-center">

          {/* Badge Pill */}
          <div className="animate-fade-in-up flex justify-center mb-8">
            <span className="inline-flex items-center gap-2.5 px-6 py-2.5 text-xs font-bold tracking-widest uppercase text-blue-400 bg-blue-500/10 border border-blue-500/25 rounded-full shadow-lg shadow-blue-500/10">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Automated Resume Intelligence Platform
            </span>
          </div>

          {/* Headline — Balanced 2 lines */}
          <h1 className="animate-fade-in-up-delay-1 text-5xl sm:text-6xl lg:text-[72px] font-black leading-[1.15] tracking-tight mb-8 text-center w-full">
            <span className="text-white">Transform Resumes </span>
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-300 bg-clip-text text-transparent">
              Into Actionable Insights
            </span>
          </h1>

          {/* Description Text — Pure Symmetrical Centering */}
          <p className="animate-fade-in-up-delay-2 text-[17px] sm:text-lg text-slate-400 max-w-2xl mx-auto leading-[2.0] text-center font-normal mb-12 px-4">
            Analyze, categorize, and evaluate candidate resumes at scale.
            Extract key technical skills, experience estimates, and AI recommendations seamlessly.
          </p>

          {/* Action Buttons — Symmetrical Center */}
          <div className="animate-fade-in-up-delay-3 flex flex-col sm:flex-row items-center justify-center gap-5 mb-20 w-full">
            <Link
              to="/register"
              className="btn-primary w-full sm:w-auto px-10 py-4 text-[15px] shadow-xl shadow-blue-600/25"
            >
              Start Free Analysis →
            </Link>
            <Link
              to="/login"
              className="btn-secondary w-full sm:w-auto px-10 py-4 text-[15px]"
            >
              Sign In to Account
            </Link>
          </div>
        </div>

        {/* Feature Cards Section — Bento Grid */}
        <div className="w-full max-w-[1000px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            
            {/* Feature 1 (Spans 2 columns) */}
            <div
              className="md:col-span-2 glass-card glass-card-hover p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-8 animate-fade-in-up"
              style={{ animationDelay: '0.42s' }}
            >
              <div className={`w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-2xl ${features[0].iconBg} border flex items-center justify-center text-3xl shadow-md`}>
                {features[0].icon}
              </div>
              <div className="text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight">
                  {features[0].title}
                </h3>
                <p className="text-zinc-400 text-[15px] sm:text-base leading-relaxed">
                  {features[0].description}
                </p>
              </div>
            </div>

            {/* Feature 2 (Spans 1 column) */}
            <div
              className="md:col-span-1 glass-card glass-card-hover p-8 flex flex-col items-start animate-fade-in-up"
              style={{ animationDelay: '0.56s' }}
            >
              <div className={`w-14 h-14 rounded-2xl ${features[1].iconBg} border flex items-center justify-center text-2xl mb-6 shadow-md`}>
                {features[1].icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-3 tracking-tight text-left">
                {features[1].title}
              </h3>
              <p className="text-zinc-400 text-[14px] leading-relaxed text-left">
                {features[1].description}
              </p>
            </div>

            {/* Feature 3 (Spans 1 column) */}
            <div
              className="md:col-span-1 glass-card glass-card-hover p-8 flex flex-col items-start animate-fade-in-up"
              style={{ animationDelay: '0.70s' }}
            >
              <div className={`w-14 h-14 rounded-2xl ${features[2].iconBg} border flex items-center justify-center text-2xl mb-6 shadow-md`}>
                {features[2].icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-3 tracking-tight text-left">
                {features[2].title}
              </h3>
              <p className="text-zinc-400 text-[14px] leading-relaxed text-left">
                {features[2].description}
              </p>
            </div>

          </div>
        </div>

      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/[0.05] py-7">
        <div className="max-w-[1440px] mx-auto px-8 sm:px-14 flex items-center justify-between flex-wrap gap-4">
          <span className="text-sm text-slate-500">
            © {new Date().getFullYear()} PROJ Intelligence Systems. All rights reserved.
          </span>
          <span className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-900/60 px-3.5 py-1.5 rounded-full border border-white/5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            All systems operational
          </span>
        </div>
      </footer>
    </AnimatedLayout>
  );
}
