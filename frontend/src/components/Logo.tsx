import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
  showText?: boolean;
}

export function LogoMark({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dim = size === 'sm' ? 32 : size === 'md' ? 40 : 48;
  return (
    <div
      className="flex-shrink-0 relative group-hover:scale-105 transition-transform duration-300 ease-out"
      style={{ width: dim, height: dim }}
    >
      {/* Glow aura */}
      <div
        className="absolute -inset-1 rounded-xl opacity-60 blur-md group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.6) 0%, rgba(16, 185, 129, 0.6) 100%)',
        }}
      />
      
      {/* Outer shell */}
      <div className="relative w-full h-full rounded-xl bg-[#09090b] border border-white/15 flex items-center justify-center overflow-hidden shadow-inner">
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
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M12 22V12"
            stroke="url(#auraGrad)"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M22 7L12 12L2 7"
            stroke="url(#auraGrad)"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="auraGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
              <stop stopColor="#60a5fa" />
              <stop offset="1" stopColor="#34d399" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

export function LogoText({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) {
  const textSize = size === 'sm' ? 'text-base' : size === 'md' ? 'text-xl' : 'text-2xl';
  return (
    <div className="flex items-center gap-1.5 leading-none select-none">
      <span className={`font-bold tracking-tight text-white ${textSize}`}>
        Resumify
      </span>
      <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400">
        AI
      </span>
    </div>
  );
}

export default function Logo({ size = 'sm', href, className = '', showText = true }: LogoProps) {
  const inner = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      {showText && <LogoText size={size} />}
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


