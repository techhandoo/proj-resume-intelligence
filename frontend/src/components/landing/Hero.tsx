import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Award, FileText, BookOpen, LayoutDashboard } from 'lucide-react';
import { HeroWithMockup } from '../ui/hero-with-mockup';
import { DashboardMockup } from '../ui/dashboard-mockup';
import { isAuthenticated } from '../../lib/auth';

const metrics = [
  { label: 'Parsing Accuracy', value: '99.4%', icon: ShieldCheck },
  { label: 'Resumes Analyzed', value: '10,000+', icon: FileText },
  { label: 'Inference Latency', value: '< 1.5s', icon: Cpu },
  { label: 'ATS Score Match', value: '98.2%', icon: Award },
];

export default function LandingHero() {
  const authenticated = isAuthenticated();

  return (
    <div className="relative">
      <HeroWithMockup
        title={
          <>
            Transform resumes into{' '}
            <span className="bg-gradient-to-r from-[var(--color-accent-strong)] via-[color-mix(in_oklab,var(--color-success)_55%,var(--color-accent-strong))] to-[color-mix(in_oklab,var(--color-success)_85%,white)] bg-clip-text text-transparent">
              actionable AI insights.
            </span>
          </>
        }
        description="Analyze, categorize, and evaluate candidate resumes at scale. Extract technical skill matrices, ATS score compatibility, and automated cover letters in seconds."
        primaryCta={
          authenticated
            ? { text: 'Open Your Dashboard', href: '/dashboard', icon: <LayoutDashboard className="mr-2 h-4 w-4" /> }
            : { text: 'Start Free Trial', href: '/register' }
        }
        secondaryCta={{
          text: 'Explore Architecture',
          href: '/about',
          icon: <BookOpen className="mr-2 h-4 w-4" />,
        }}
        mockup={<DashboardMockup className="w-full h-auto" />}
      />

      {/* Metrics bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl w-full mx-auto px-6 sm:px-10 mt-16 pb-4"
      >
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="glass-card p-5 flex items-center gap-4">
              <div className="p-3 rounded-[var(--radius-inner)] bg-accent-soft border border-accent/25 text-[var(--color-accent-strong)]">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-[var(--color-text-primary)] tracking-tight tabular">{m.value}</div>
                <div className="text-xs text-[var(--color-text-muted)] font-medium">{m.label}</div>
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
