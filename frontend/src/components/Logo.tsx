import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md';
  href?: string;
  className?: string;
}

function LogoMark({ size = 'sm' }: { size: 'sm' | 'md' }) {
  const dim = size === 'sm' ? 36 : 48;
  return (
    <div
      className="flex-shrink-0 relative group-hover:scale-105 transition-transform duration-300"
      style={{ width: dim, height: dim }}
    >
      {/* Minimal Glowing Aura Ring */}
      <div
        className="absolute inset-0 rounded-full opacity-60 blur-md group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
        }}
      />
      
      {/* Inner Prism Surface */}
      <div className="relative w-full h-full rounded-full bg-black border border-white/10 flex items-center justify-center overflow-hidden">
        <svg
          width={dim * 0.55}
          height={dim * 0.55}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L22 7V17L12 22L2 17V7L12 2Z"
            stroke="url(#auraGrad)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M12 22V12"
            stroke="url(#auraGrad)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M22 7L12 12L2 7"
            stroke="url(#auraGrad)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="auraGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
              <stop stopColor="#e9d5ff" />
              <stop offset="1" stopColor="#60a5fa" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function LogoText({ size = 'sm' }: { size: 'sm' | 'md' }) {
  const isSm = size === 'sm';
  return (
    <div className="flex flex-col leading-none justify-center">
      <span
        className="font-black tracking-tight select-none"
        style={{
          fontSize: isSm ? '20px' : '26px',
          color: '#ffffff',
          letterSpacing: '-0.02em',
        }}
      >
        Aura
      </span>
    </div>
  );
}

export function Logo({ size = 'sm', href, className = '' }: LogoProps) {
  const inner = (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoMark size={size} />
      <LogoText size={size} />
    </div>
  );

  if (href) {
    return (
      <Link to={href} className="group inline-flex items-center">
        {inner}
      </Link>
    );
  }
  return inner;
}

export default Logo;

