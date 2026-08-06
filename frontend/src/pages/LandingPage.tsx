import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import AnimatedLayout from '../components/AnimatedLayout';
import { FileText, Brain, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

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

// Emil Kowalski Stagger Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 250,
      damping: 25,
      mass: 0.5
    }
  },
};

export default function LandingPage() {
  return (
    <AnimatedLayout className="vibrant-bg min-h-screen relative overflow-x-hidden flex flex-col justify-between">
      <div className="vibrant-overlay" />
      <div className="hero-glow" />
      <div className="hero-glow-secondary" />

      {/* ── Floating Navbar ── */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none"
      >
        <div className="pointer-events-auto bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-2 py-2 flex items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.8)] w-full max-w-4xl transition-all duration-300">
          <div className="ml-2">
            <Logo size="sm" href="/" />
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-zinc-400 hover:text-white transition-colors duration-200 active:scale-95">
              Sign In
            </Link>
            <Link to="/register" className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold bg-white text-black hover:bg-zinc-200 transition-colors duration-200 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]">
              Get Started
            </Link>
          </div>
        </div>
      </motion.header>

      {/* ── Main Content Area ── */}
      <main className="relative z-10 flex-1 w-full flex flex-col items-center justify-center px-6 sm:px-12 pt-32 pb-16">

        {/* Hero Section */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="text-center max-w-4xl w-full mx-auto flex flex-col items-center justify-center"
        >

          {/* Badge Pill */}
          <motion.div variants={itemVariants} className="flex justify-center mb-8">
            <span className="inline-flex items-center gap-2.5 px-6 py-2.5 text-xs font-bold tracking-widest uppercase text-blue-400 bg-blue-500/10 border border-blue-500/25 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.15)]">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Automated Resume Intelligence Platform
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-8 text-center w-full flex flex-col items-center">
            <span className="text-white pb-2 block">Transform Resumes </span>
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-300 bg-clip-text text-transparent block">
              Into Actionable Insights
            </span>
          </motion.h1>

          {/* Description Text */}
          <motion.p variants={itemVariants} className="text-[17px] sm:text-lg text-slate-400 max-w-2xl mx-auto leading-[1.8] text-center font-medium mb-12 px-4">
            Analyze, categorize, and evaluate candidate resumes at scale.
            Extract key technical skills, experience estimates, and AI recommendations seamlessly.
          </motion.p>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24 w-full">
            <Link
              to="/register"
              className="btn-primary w-full sm:w-auto px-10 py-4 text-[15px] shadow-[0_0_30px_rgba(59,130,246,0.15)]"
            >
              Start Free Analysis →
            </Link>
            <Link
              to="/login"
              className="btn-secondary w-full sm:w-auto px-10 py-4 text-[15px]"
            >
              Sign In to Account
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature Cards Section — Bento Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="w-full max-w-[1200px] mx-auto px-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
                className="glass-card p-8 flex flex-col items-start transition-colors duration-300 hover:bg-white/[0.02]"
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.iconBg} border flex items-center justify-center text-2xl mb-6 shadow-lg`}>
                  {feature.icon}
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-white mb-3 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-400 text-[14px] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}

          </div>
        </motion.div>

      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/[0.05] py-7">
        <div className="max-w-[1440px] mx-auto px-8 sm:px-14 flex items-center justify-between flex-wrap gap-4">
          <span className="text-sm text-slate-500 font-medium">
            © {new Date().getFullYear()} PROJ Intelligence Systems. All rights reserved.
          </span>
          <span className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-black/40 px-3.5 py-1.5 rounded-full border border-white/[0.05]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
            All systems operational
          </span>
        </div>
      </footer>
    </AnimatedLayout>
  );
}
