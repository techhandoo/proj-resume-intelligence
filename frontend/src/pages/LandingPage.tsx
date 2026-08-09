import AnimatedLayout from '../components/AnimatedLayout';
import LandingHeader from '../components/landing/Header';
import LandingHero from '../components/landing/Hero';
import { FeaturesGrid, FeatureShowcase, HowItWorks } from '../components/landing/Features';
import { UseCases, SecurityBand, Testimonials } from '../components/landing/Social';
import Pricing from '../components/landing/Pricing';
import { Roadmap, FinalCTA, LandingFooter } from '../components/landing/Roadmap';

export default function LandingPage() {
  return (
    <AnimatedLayout className="min-h-screen bg-background bg-mesh-pattern relative flex flex-col selection:bg-accent/25 selection:text-white overflow-hidden">
      <LandingHeader />
      <LandingHero />

      <FeaturesGrid />
      <FeatureShowcase />
      <HowItWorks />
      <UseCases />
      <SecurityBand />
      <Testimonials />
      <Pricing />
      <Roadmap />
      <FinalCTA />
      <LandingFooter />
    </AnimatedLayout>
  );
}
