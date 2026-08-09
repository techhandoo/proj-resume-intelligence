import { Link } from 'react-router-dom';
import AnimatedLayout from '../components/AnimatedLayout';
import { Command, FileText, Brain, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';

const features = [
  {
    icon: FileText,
    title: 'Smart Resume Ingestion',
    description: 'Instant text parsing with drop-and-upload capabilities built for modern recruiter workflows.',
  },
  {
    icon: Brain,
    title: 'Deep AI Analytics',
    description: 'Powered by advanced Groq LLM engines to extract structured candidate skills, metrics, and education.',
  },
  {
    icon: Zap,
    title: 'Instant Recommendations',
    description: 'Receive automated candidate improvement suggestions and structured career insights in seconds.',
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', bounce: 0, duration: 0.5 } },
};

export default function LandingPage() {
  return (
    <AnimatedLayout className="min-h-screen bg-[#000000] relative flex flex-col selection:bg-zinc-800 selection:text-zinc-100">
      
      {/* Navbar */}
      <header className="absolute top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 border-b border-[#1f1f22] bg-[#000000]/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-white flex items-center justify-center">
            <Command className="w-4 h-4 text-black" />
          </div>
          <span className="font-semibold text-zinc-100 tracking-tight text-sm">Resumify Inc.</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-[13px] font-medium text-zinc-400 hover:text-zinc-100 transition-colors">
            Sign In
          </Link>
          <Link to="/register" className="btn-primary py-1.5 px-3 text-[13px]">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-6">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="max-w-4xl w-full mx-auto flex flex-col items-center text-center"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 mb-8 border border-[#1f1f22] rounded-full bg-[#050505]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-medium text-zinc-300 tracking-wide uppercase">Resumify AI 2.0 is live</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl md:text-7xl font-semibold text-zinc-100 tracking-tight leading-[1.1] mb-6">
            Transform resumes into<br/>
            <span className="text-zinc-500">actionable insights.</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-[16px] md:text-[18px] text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-16">
            Analyze, categorize, and evaluate candidate resumes at scale. 
            Extract key technical skills and AI recommendations instantly.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link to="/register" className="btn-primary w-full sm:w-auto px-8 py-3 text-[14px]">
              Start Building <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
            <Link to="/about" className="btn-secondary w-full sm:w-auto px-8 py-3 text-[14px]">
              Read the Docs
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full mx-auto mt-40"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="glass-card p-6 flex flex-col group">
                <div className="w-10 h-10 rounded-lg bg-[#171717] border border-[#1f1f22] flex items-center justify-center mb-5 group-hover:border-zinc-500 transition-colors">
                  <Icon className="w-5 h-5 text-zinc-300" />
                </div>
                <h3 className="text-[15px] font-semibold text-zinc-100 mb-2">{feature.title}</h3>
                <p className="text-[13px] text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1f1f22] py-6 px-6 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between">
        <span className="text-[12px] text-zinc-500">© {new Date().getFullYear()} Resumify Inc.</span>
        <div className="flex items-center gap-1.5 text-[12px] text-zinc-500 mt-4 sm:mt-0">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> All systems operational
        </div>
      </footer>
    </AnimatedLayout>
  );
}
