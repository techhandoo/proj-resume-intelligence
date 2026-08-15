import type { ReactNode } from 'react';
import type { TemplateMeta } from '../../lib/templates';

/**
 * Crisp, lightweight SVG mockup of a template's layout — no raster images, no
 * binary assets, always sharp at any DPI. Each layout variant renders a
 * miniature one-page resume using the template's accent color.
 */
export default function TemplatePreview({ template, className = '' }: { template: TemplateMeta; className?: string }) {
  const { accent, layout } = template;
  const W = 320;
  const H = 190;
  const ink = '#111827';
  const inkSoft = '#9CA3AF';
  const line = '#E5E7EB';

  const paper = (
    <g>
      <rect x={2} y={2} width={W - 4} height={H - 4} rx={6} fill="#FFFFFF" stroke="#E5E7EB" strokeWidth={1} />
      <rect x={2} y={2} width={W - 4} height={H - 4} rx={6} fill="url(#paperSheen)" />
    </g>
  );

  const contentBars = (n: number, y: number, width: number, h = 3, gap = 6) => (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <rect key={i} x={24} y={y + i * (h + gap)} width={width} height={h} rx={1.5} fill={inkSoft} opacity={i % 2 === 0 ? 1 : 0.5} />
      ))}
    </g>
  );

  const accentBars = (y: number, accentColor: string) => (
    <g>
      <rect x={24} y={y} width={70} height={4} rx={2} fill={accentColor} opacity={0.85} />
      <rect x={100} y={y + 1.5} width={W - 124} height={1} fill={line} />
    </g>
  );

  let body: ReactNode;

  if (layout === 'band') {
    body = (
      <g>
        <rect x={2} y={2} width={W - 4} height={40} rx={6} fill={accent} />
        <rect x={2} y={38} width={W - 4} height={4} fill={accent} />
        <rect x={20} y={14} width={140} height={8} rx={4} fill="#FFFFFF" opacity={0.95} />
        <rect x={20} y={27} width={90} height={5} rx={2.5} fill="#FFFFFF" opacity={0.6} />
        {accentBars(58, accent)}
        {contentBars(3, 72, 150)}
        {accentBars(102, accent)}
        {contentBars(3, 116, 150)}
        {accentBars(146, accent)}
        {contentBars(2, 160, 150)}
      </g>
    );
  } else if (layout === 'sidebar') {
    body = (
      <g>
        <rect x={2} y={2} width={64} height={H - 4} rx={6} fill={accent} />
        <rect x={12} y={16} width={40} height={7} rx={3.5} fill="#FFFFFF" opacity={0.95} />
        <rect x={12} y={28} width={28} height={4} rx={2} fill="#FFFFFF" opacity={0.6} />
        <rect x={12} y={50} width={30} height={4} rx={2} fill="#FFFFFF" opacity={0.85} />
        {Array.from({ length: 6 }, (_, i) => (
          <rect key={i} x={12} y={60 + i * 9} width={40 - (i % 2) * 10} height={3} rx={1.5} fill="#FFFFFF" opacity={0.45} />
        ))}
        <rect x={84} y={16} width={120} height={8} rx={4} fill={ink} />
        <rect x={84} y={30} width={80} height={5} rx={2.5} fill={inkSoft} />
        {accentBars(50, accent)}
        {contentBars(4, 64, 170)}
        {accentBars(110, accent)}
        {contentBars(4, 124, 170)}
      </g>
    );
  } else if (layout === 'minimal') {
    body = (
      <g>
        <rect x={24} y={16} width={130} height={8} rx={4} fill={ink} />
        <rect x={24} y={30} width={80} height={5} rx={2.5} fill={inkSoft} />
        <rect x={24} y={46} width={W - 48} height={1} fill={line} />
        {accentBars(60, accent)}
        {contentBars(3, 74, 180, 3, 8)}
        {accentBars(112, accent)}
        {contentBars(2, 126, 180, 3, 8)}
        {accentBars(146, accent)}
        {contentBars(2, 160, 180, 3, 8)}
      </g>
    );
  } else {
    // centered (formal / serif)
    body = (
      <g>
        <rect x={(W - 130) / 2} y={16} width={130} height={8} rx={4} fill={ink} />
        <rect x={(W - 80) / 2} y={30} width={80} height={5} rx={2.5} fill={inkSoft} />
        <rect x={40} y={46} width={W - 80} height={1.5} fill={accent} />
        {accentBars(62, accent)}
        {contentBars(3, 76, 150)}
        {accentBars(110, accent)}
        {contentBars(3, 124, 150)}
      </g>
    );
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} role="img" aria-label={`${template.name} template preview`}>
      <defs>
        <linearGradient id="paperSheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F9FAFB" />
        </linearGradient>
      </defs>
      {paper}
      {body}
    </svg>
  );
}
