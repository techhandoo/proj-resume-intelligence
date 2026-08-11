import { Link } from 'react-router-dom';
import Logo from '../Logo';
import ThemeToggle from '../ui/ThemeToggle';
import { ArrowRight, LayoutDashboard } from 'lucide-react';
import { isAuthenticated } from '../../lib/auth';

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#roadmap', label: 'Roadmap' },
];

export default function LandingHeader() {
  const authenticated = isAuthenticated();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-background/85 px-6 sm:px-8 py-3.5 backdrop-blur-xl">
      <Logo size="md" href="/" />

      {/* Desktop anchor nav */}
      <nav className="hidden md:flex items-center gap-7" aria-label="Landing navigation">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-[13px] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        {authenticated ? (
          <Link to="/dashboard" className="btn-primary py-2 px-4.5 text-xs font-bold">
            <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" /> Open Dashboard
          </Link>
        ) : (
          <>
            <Link to="/login" className="hidden sm:block text-[13px] font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="btn-primary py-2 px-4.5 text-xs font-bold">
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
