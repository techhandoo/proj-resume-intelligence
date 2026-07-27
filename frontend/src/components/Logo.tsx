import { Link } from 'react-router-dom';

interface LogoProps {
  /** 'sm' = navbar size (~42px icon), 'md' = auth page size (~52px icon) */
  size?: 'sm' | 'md';
  /** If provided, wraps in a Link */
  href?: string;
  className?: string;
}

function LogoMark({ size = 'sm' }: { size: 'sm' | 'md' }) {
  const dim = size === 'sm' ? 44 : 54;
  return (
    <div
      className="flex-shrink-0 relative group-hover:scale-105 transition-transform duration-300"
      style={{ width: dim, height: dim }}
    >
      {/* Ambient background aura glow */}
      <div
        className="absolute -inset-1 rounded-2xl opacity-75 blur-md group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
        }}
      />

      {/* Main Glass Icon Shield */}
      <div
        className="relative w-full h-full rounded-2xl flex items-center justify-center p-0.5"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(59,130,246,0.2) 50%, rgba(139,92,246,0.3) 100%)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.37), inset 0 1px 1px rgba(255,255,255,0.4)',
        }}
      >
        <div
          className="w-full h-full rounded-[14px] flex items-center justify-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #0b1536 0%, #172554 50%, #1e1b4b 100%)',
          }}
        >
          {/* Subtle inner radial gradient accent */}
          <div
            className="absolute -top-4 -right-4 w-12 h-12 rounded-full opacity-60 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, #60a5fa 0%, transparent 70%)',
            }}
          />

          {/* High-Tech Custom SVG Emblem */}
          <svg
            width={dim * 0.62}
            height={dim * 0.62}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Monogram P / Document Gradient */}
              <linearGradient id="projDocGrad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
              {/* Sparkle Gold Gradient */}
              <linearGradient id="sparkGrad" x1="16" y1="2" x2="28" y2="14" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
              {/* Glow Filter */}
              <filter id="glowSpark" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Base Stylized Document Body */}
            <path
              d="M6 6C6 4.34315 7.34315 3 9 3H19L25 9V25C25 26.6569 23.6569 28 22 28H9C7.34315 28 6 26.6569 6 25V6Z"
              fill="url(#projDocGrad)"
              fillOpacity="0.22"
              stroke="url(#projDocGrad)"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />

            {/* Folded Corner */}
            <path
              d="M19 3V8C19 8.55228 19.4477 9 20 9H25"
              stroke="url(#projDocGrad)"
              strokeWidth="1.8"
              strokeLinecap="round"
            />

            {/* Stylized "P" Letter + AI Wave Lines */}
            <path
              d="M10 9H15.5C17.433 9 19 10.567 19 12.5C19 14.433 17.433 16 15.5 16H10V9Z"
              fill="url(#projDocGrad)"
            />
            <path
              d="M10 9V22"
              stroke="#ffffff"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M14 19H21"
              stroke="#60a5fa"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="1 3.5"
            />
            <path
              d="M14 22H19"
              stroke="#a78bfa"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Vibrant AI Sparkle / Star (Top Right) */}
            <g filter="url(#glowSpark)">
              <path
                d="M23 11C23 11 24.2 8.8 26.4 7.6C24.2 6.4 23 4.2 23 4.2C23 4.2 21.8 6.4 19.6 7.6C21.8 8.8 23 11 23 11Z"
                fill="url(#sparkGrad)"
              />
              <circle cx="27" cy="4" r="1" fill="#fef08a" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function LogoText({ size = 'sm' }: { size: 'sm' | 'md' }) {
  const isSm = size === 'sm';
  return (
    <div className="flex flex-col leading-none">
      <div className="flex items-center gap-1.5">
        <span
          className="font-black tracking-wide select-none"
          style={{
            fontSize: isSm ? '20px' : '25px',
            background: 'linear-gradient(90deg, #ffffff 0%, #93c5fd 45%, #c084fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '0.05em',
            filter: 'drop-shadow(0 2px 10px rgba(59, 130, 246, 0.35))',
          }}
        >
          PROJ
        </span>
        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-blue-500/15 border border-blue-400/30 text-blue-300 tracking-wider">
          AI
        </span>
      </div>
      <span
        className="font-extrabold uppercase mt-1 tracking-widest select-none"
        style={{
          fontSize: isSm ? '8.5px' : '9.5px',
          background: 'linear-gradient(90deg, #60a5fa 0%, #a78bfa 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '0.14em',
        }}
      >
        Resume Intelligence
      </span>
    </div>
  );
}

export function Logo({ size = 'sm', href, className = '' }: LogoProps) {
  const inner = (
    <div className={`flex items-center gap-3.5 ${className}`}>
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
