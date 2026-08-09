import { Link } from 'react-router-dom';
import AnimatedLayout from '../components/AnimatedLayout';
import Logo from '../components/Logo';
import { FileText, Brain, Zap, ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Cpu, Award } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';

const features = [
  {
    icon: FileText,
    title: 'Smart Resume Ingestion',
    description: 'Instant multi-format parsing for PDF & TXT with layout-aware structural section extraction.',
    badge: 'v2.4 Engine',
  },
  {
    icon: Brain,
    title: 'Deep AI Analytics',
    description: 'Powered by high-throughput Groq LLM inference to score ATS compatibility and skill matrices.',
    badge: 'Groq Speed',
  },
  {
    icon: Zap,
    title: 'Instant Action Plans',
    description: 'Automated executive recommendations and precision targeted cover letter generation in seconds.',
    badge: '1-Click Export',
  },
];

const metrics = [
  { label: 'Parsing Accuracy', value: '99.4%', icon: ShieldCheck },
  { label: 'Resumes Analyzed', value: '10,000+', icon: FileText },
  { label: 'Inference Latency', value: '< 1.5s', icon: Cpu },
  { label: 'ATS Score Match', value: '98.2%', icon: Award },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', bounce: 0, duration: 0.6 } },
};

export default function LandingPage() {
  return (
    <AnimatedLayout className="min-h-screen bg-[#030304] bg-mesh-pattern relative flex flex-col selection:bg-blue-500/30 selection:text-blue-100 overflow-hidden">
      
      {/* Ambient Radial Spotlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-600/15 via-emerald-500/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 border-b border-white/10 bg-[#030304]/80 backdrop-blur-xl">
        <Logo size="md" href="/" />
        <div className="flex items-center gap-5">
          <Link to="/login" className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link to="/register" className="btn-primary py-2 px-5 text-xs font-bold">
            Get Started <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center pt-20 pb-24 px-6 max-w-7xl mx-auto w-full">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="max-w-4xl w-full mx-auto flex flex-col items-center text-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-8 border border-blue-500/30 rounded-full bg-blue-500/10 backdrop-blur-md shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span className="text-[11px] font-bold text-blue-300 tracking-wider uppercase">Resumify AI 2.0 Engine is live</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-8">
            Transform resumes into<br />
            <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
              actionable AI insights.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p variants={itemVariants} className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-12">
            Analyze, categorize, and evaluate candidate resumes at scale. Extract technical skill matrices, ATS score compatibility, and automated cover letters in seconds.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link to="/register" className="btn-primary w-full sm:w-auto px-8 py-3.5 text-sm shadow-lg shadow-blue-500/20">
              Start Free Trial <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link to="/about" className="btn-secondary w-full sm:w-auto px-8 py-3.5 text-sm">
              Explore Architecture
            </Link>
          </motion.div>

          {/* Interactive Mock Dashboard Preview */}
          <motion.div 
            variants={itemVariants}
            className="w-full mt-16 glass-card p-6 border border-white/10 shadow-2xl relative overflow-hidden text-left"
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#1c1c21]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-zinc-500">resume_analysis_preview.json</span>
              </div>
              <span className="badge badge-emerald">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Live Inference Demo
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl bg-[#07070a] border border-white/5 flex flex-col justify-between">
                <span className="text-xs font-bold text-zinc-400">ATS Score Compatibility</span>
                <div className="flex items-baseline gap-2 my-2">
                  <span className="text-4xl font-extrabold text-emerald-400">94</span>
                  <span className="text-xs text-zinc-500 font-mono">/ 100</span>
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-[94%]" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#07070a] border border-white/5 flex flex-col justify-between md:col-span-2">
                <span className="text-xs font-bold text-zinc-400 mb-2">Detected Tech Stack</span>
                <div className="flex flex-wrap gap-1.5">
                  {['React 19', 'TypeScript', 'Node.js', 'PostgreSQL', 'TailwindCSS', 'FastAPI', 'Docker', 'GraphQL', 'AWS EC2'].map((skill, i) => (
                    <span key={i} className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Metrics Counter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl w-full mx-auto mt-24"
        >
          {metrics.map((m, i) => {
            const Icon = m.icon;
            return (
              <div key={i} className="glass-card p-5 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white tracking-tight">{m.value}</div>
                  <div className="text-xs text-zinc-400 font-medium">{m.label}</div>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full mx-auto mt-16"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="glass-card p-6 flex flex-col group hover:border-blue-500/40 transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-11 h-11 rounded-xl bg-[#121216] border border-[#1c1c21] flex items-center justify-center group-hover:border-blue-500/40 transition-colors">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                    {feature.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1c1c21] py-8 px-8 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <Logo size="sm" showText={false} />
          <span className="text-xs text-zinc-500">© {new Date().getFullYear()} Resumify Inc. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium mt-4 sm:mt-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Groq & PostgreSQL Systems Operational
        </div>
      </footer>
    </AnimatedLayout>
  );
}

