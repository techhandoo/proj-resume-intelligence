import { Link } from 'react-router-dom';
import { Check, Sparkles } from 'lucide-react';
import { Reveal, Section, SectionHeader } from './shared';

const plans = [
  {
    name: 'Starter',
    price: '$0',
    period: 'forever',
    description: 'Explore the pipeline with real AI analysis.',
    features: [
      '5 resume analyses / month',
      'ATS score & executive summary',
      'Skill matrix extraction',
      'PDF export',
    ],
    cta: 'Start Free',
    to: '/register',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: 'per month',
    description: 'For active job seekers and busy recruiters.',
    features: [
      'Unlimited resume analyses',
      'Action plans & score tracking',
      'AI cover letters (all tones)',
      'Full ATS template library',
      'DOCX + PDF export',
      'Priority inference queue',
    ],
    cta: 'Start 14-day trial',
    to: '/register',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'annual billing',
    description: 'For teams that need control and scale.',
    features: [
      'Everything in Pro',
      'Team workspaces & roles',
      'SSO / SAML & audit logs',
      'Dedicated inference capacity',
      'API access & ATS integrations',
      'Custom scoring models',
    ],
    cta: 'Talk to Sales',
    to: '/register',
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <Section id="pricing">
      <SectionHeader
        eyebrow="Pricing"
        title="Simple plans that scale with you"
        description="Start free, upgrade when the volume justifies it. No hidden fees, cancel anytime."
      />

      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {plans.map((p, idx) => (
          <Reveal key={p.name} delay={idx * 0.08} className="h-full">
            <div className={`glass-card p-7 h-full flex flex-col relative ${p.highlighted ? 'border-accent/50 shadow-[0_0_0_1px_oklch(0.61_0.17_262/0.4),0_24px_60px_-20px_oklch(0.55_0.2_262/0.45)]' : ''}`}>
              {p.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge badge-blue whitespace-nowrap">
                  <Sparkles className="w-3 h-3" /> Most Popular
                </span>
              )}
              <h3 className="text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-wider">{p.name}</h3>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-[var(--color-text-primary)] tracking-tight tabular">{p.price}</span>
                <span className="text-xs text-[var(--color-text-muted)]">{p.period}</span>
              </div>
              <p className="mt-2 text-xs text-[var(--color-text-muted)] leading-relaxed">{p.description}</p>

              <ul className="mt-6 space-y-3 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[13px] text-[var(--color-text-secondary)]">
                    <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${p.highlighted ? 'text-[var(--color-accent-strong)]' : 'text-[var(--color-success)]'}`} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={p.to}
                className={`mt-8 w-full ${p.highlighted ? 'btn-primary' : 'btn-secondary'} py-2.5 text-xs font-bold`}
              >
                {p.cta}
              </Link>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2} className="mt-10 text-center">
        <p className="text-xs text-[var(--color-text-muted)]">
          All plans include enterprise-grade encryption and a privacy guarantee — your documents never train public models.
        </p>
      </Reveal>
    </Section>
  );
}
