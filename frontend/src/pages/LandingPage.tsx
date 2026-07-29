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

      {/* ── Navbar ── */}
      <header className="relative z-10 border-b border-white/[0.05]">
        <div className="max-w-[1440px] mx-auto px-8 sm:px-14 flex items-center justify-between h-[72px]">
          <Logo size="sm" href="/" />
          <div className="flex items-center gap-4">
            <Link to="/login" className="btn-secondary btn-sm">
              Sign In
            </Link>
            <Link to="/register" className="btn-primary btn-sm">
              Get Started →
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Content Area ── */}
      <main className="relative z-10 flex-1 w-full flex flex-col items-center justify-center px-6 sm:px-12 py-16">

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

        {/* Feature Cards Section — Symmetrical Grid */}
        <div className="w-full max-w-[1440px] mx-auto">
          <div className="section-divider mb-16" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="glass-card glass-card-hover px-8 py-10 text-center flex flex-col items-center justify-center animate-fade-in-up"
                style={{ animationDelay: `${0.42 + index * 0.14}s` }}
              >
                <div className={`w-16 h-16 rounded-2xl ${feature.iconBg} border flex items-center justify-center text-3xl mb-6 shadow-md`}>
                  {feature.icon}
                </div>
                <h3 className="text-[18px] font-bold text-white mb-3 tracking-tight text-center">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-[14px] leading-[1.9] text-center">
                  {feature.description}
                </p>
              </div>
            ))}
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
