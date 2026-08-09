/**
 * Resumify dashboard mockup — inline SVG driven entirely by theme tokens,
 * so it swaps with light/dark mode (and crossfades via html.theme-anim).
 * Brand gradients (avatar, CTA) are theme-neutral by design.
 */
export function DashboardMockup({ className = '' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1248 765"
      width="1248"
      height="765"
      fontFamily="Outfit, Inter, system-ui, sans-serif"
      role="img"
      aria-label="Resumify AI dashboard showing ATS scores, skill matrices, and candidate pipeline"
      className={className}
    >
      {/* canvas */}
      <rect width="1248" height="765" fill="var(--background)" />

      {/* sidebar */}
      <rect x="0" y="0" width="236" height="765" fill="var(--surface)" />
      <rect x="235" y="0" width="1" height="765" fill="var(--border)" />

      {/* logo */}
      <rect x="22" y="22" width="34" height="34" rx="10" fill="var(--raised)" stroke="var(--border-strong)" />
      <path d="M28 34h22M28 34v14M28 34l11-8m11 8v14m0-14l-11 8m-11 6l11 8 11-8" stroke="var(--accent-strong)" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <text x="66" y="45" fontSize="16" fontWeight="700" fill="var(--text-primary)">Resumify</text>
      <rect x="132" y="31" width="24" height="15" rx="7.5" fill="var(--accent-soft)" stroke="color-mix(in oklab, var(--accent) 40%, transparent)" />
      <text x="144" y="42" fontSize="8.5" fontWeight="700" fill="var(--accent-strong)" textAnchor="middle">AI</text>

      {/* nav */}
      <text x="24" y="86" fontSize="9" fontWeight="700" fill="var(--text-subtle)" letterSpacing="1.5">NAVIGATION</text>
      <g>
        <rect x="16" y="98" width="204" height="34" rx="9" fill="var(--surface-2)" stroke="var(--border-strong)" />
        <rect x="26" y="110" width="10" height="10" rx="2.5" fill="var(--accent)" />
        <text x="44" y="119" fontSize="12.5" fontWeight="600" fill="var(--text-primary)">Overview</text>
        <text x="204" y="119" fontSize="9.5" fill="var(--text-subtle)" textAnchor="end">⌘1</text>
      </g>
      <g fontSize="12.5" fill="var(--text-muted)">
        <rect x="26" y="151" width="10" height="10" rx="2.5" fill="var(--text-subtle)" />
        <text x="44" y="160">Upload</text>
        <text x="204" y="160" fontSize="9.5" fill="var(--text-subtle)" textAnchor="end">⌘2</text>
        <rect x="26" y="190" width="10" height="10" rx="2.5" fill="var(--text-subtle)" />
        <text x="44" y="199">Cover Letter</text>
        <text x="204" y="199" fontSize="9.5" fill="var(--text-subtle)" textAnchor="end">⌘3</text>
        <rect x="26" y="229" width="10" height="10" rx="2.5" fill="var(--text-subtle)" />
        <text x="44" y="238">Templates</text>
        <text x="204" y="238" fontSize="9.5" fill="var(--text-subtle)" textAnchor="end">⌘4</text>
        <rect x="26" y="268" width="10" height="10" rx="2.5" fill="var(--text-subtle)" />
        <text x="44" y="277">Documentation</text>
        <text x="204" y="277" fontSize="9.5" fill="var(--text-subtle)" textAnchor="end">⌘5</text>
      </g>

      {/* user card */}
      <rect x="16" y="668" width="204" height="52" rx="10" fill="var(--surface-2)" stroke="var(--border)" />
      <rect x="26" y="678" width="30" height="30" rx="8" fill="url(#avatar)" />
      <text x="41" y="699" fontSize="12" fontWeight="700" fill="#fff" textAnchor="middle">A</text>
      <text x="64" y="692" fontSize="11" fontWeight="600" fill="var(--text-primary)">Aarav Sharma</text>
      <circle cx="66" cy="701" r="3" fill="var(--success)" />
      <text x="73" y="704" fontSize="9" fill="var(--success)">Workspace Active</text>

      {/* top bar */}
      <rect x="236" y="0" width="1012" height="56" fill="var(--background)" />
      <rect x="236" y="55" width="1012" height="1" fill="var(--border)" />
      <text x="264" y="35" fontSize="12.5" fontWeight="600" fill="var(--text-muted)">Resumify</text>
      <text x="324" y="35" fontSize="12.5" fill="var(--text-subtle)">›</text>
      <text x="342" y="35" fontSize="12.5" fontWeight="600" fill="var(--text-primary)">Overview</text>
      <circle cx="1196" cy="28" r="12" fill="var(--raised)" stroke="var(--border)" />
      <circle cx="1196" cy="28" r="4" fill="var(--accent)" />
      <rect x="1156" y="19" width="18" height="18" rx="9" fill="var(--raised)" stroke="var(--border)" />
      <circle cx="1165" cy="28" r="4" fill="var(--success)" />

      {/* page header */}
      <text x="264" y="104" fontSize="24" fontWeight="800" fill="var(--text-primary)" letterSpacing="-0.5">Overview</text>
      <rect x="360" y="88" width="118" height="22" rx="11" fill="var(--success-soft)" stroke="color-mix(in oklab, var(--success) 30%, transparent)" />
      <circle cx="376" cy="99" r="3.5" fill="var(--success)" />
      <text x="386" y="103" fontSize="10" fontWeight="600" fill="var(--success)">Live Workspace</text>
      <g>
        <rect x="1010" y="82" width="168" height="34" rx="8" fill="url(#ctaGrad)" stroke="color-mix(in oklab, var(--accent) 45%, white)" />
        <path d="M1032 99h26" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M1052 92l8 7-8 7" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text x="1066" y="103" fontSize="12" fontWeight="700" fill="#fff">New AI Analysis</text>
      </g>
      <text x="264" y="128" fontSize="11.5" fill="var(--text-muted)">Monitor candidate processing throughput, ATS analysis metrics, and activity feeds.</text>

      {/* KPI cards */}
      <g>
        <rect x="264" y="150" width="232" height="116" rx="14" fill="var(--surface)" stroke="var(--border)" />
        <text x="282" y="178" fontSize="9.5" fontWeight="700" fill="var(--text-muted)" letterSpacing="1.2">TOTAL RESUMES</text>
        <rect x="452" y="164" width="30" height="30" rx="8" fill="var(--accent-soft)" stroke="color-mix(in oklab, var(--accent) 30%, transparent)" />
        <rect x="460" y="172" width="14" height="14" rx="3" fill="none" stroke="var(--accent-strong)" strokeWidth="1.8" />
        <text x="282" y="224" fontSize="30" fontWeight="800" fill="var(--text-primary)">128</text>
        <rect x="282" y="238" width="196" height="5" rx="2.5" fill="var(--subtle)" />
        <rect x="282" y="238" width="157" height="5" rx="2.5" fill="var(--accent)" />
      </g>
      <g>
        <rect x="508" y="150" width="232" height="116" rx="14" fill="var(--surface)" stroke="var(--border)" />
        <text x="526" y="178" fontSize="9.5" fontWeight="700" fill="var(--text-muted)" letterSpacing="1.2">ANALYZED &amp; SCORED</text>
        <rect x="696" y="164" width="30" height="30" rx="8" fill="var(--success-soft)" stroke="color-mix(in oklab, var(--success) 30%, transparent)" />
        <circle cx="711" cy="179" r="6" fill="none" stroke="var(--success)" strokeWidth="2" />
        <path d="M707.5 179l2.5 2.5 4.5-4.5" stroke="var(--success)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <text x="526" y="224" fontSize="30" fontWeight="800" fill="var(--text-primary)">118</text>
        <text x="590" y="224" fontSize="11" fontWeight="700" fill="var(--success)">92% analyzed</text>
        <rect x="526" y="238" width="196" height="5" rx="2.5" fill="var(--subtle)" />
        <rect x="526" y="238" width="181" height="5" rx="2.5" fill="var(--success)" />
      </g>
      <g>
        <rect x="752" y="150" width="232" height="116" rx="14" fill="var(--surface)" stroke="var(--border)" />
        <text x="770" y="178" fontSize="9.5" fontWeight="700" fill="var(--text-muted)" letterSpacing="1.2">IN PIPELINE QUEUE</text>
        <rect x="940" y="164" width="30" height="30" rx="8" fill="var(--accent-soft)" stroke="color-mix(in oklab, var(--accent) 30%, transparent)" />
        <circle cx="955" cy="179" r="6" fill="none" stroke="var(--accent-strong)" strokeWidth="2" />
        <path d="M955 174v5l3.5 2" stroke="var(--accent-strong)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <text x="770" y="224" fontSize="30" fontWeight="800" fill="var(--text-primary)">8</text>
        <text x="834" y="224" fontSize="11" fill="var(--text-muted)">awaiting inference</text>
        <rect x="770" y="238" width="196" height="5" rx="2.5" fill="var(--subtle)" />
        <rect x="770" y="238" width="118" height="5" rx="2.5" fill="var(--accent)" />
      </g>
      <g>
        <rect x="996" y="150" width="232" height="116" rx="14" fill="var(--surface)" stroke="var(--border)" />
        <text x="1014" y="178" fontSize="9.5" fontWeight="700" fill="var(--text-muted)" letterSpacing="1.2">REQUIRES ATTENTION</text>
        <rect x="1184" y="164" width="30" height="30" rx="8" fill="var(--danger-soft)" stroke="color-mix(in oklab, var(--danger) 30%, transparent)" />
        <circle cx="1199" cy="179" r="6" fill="none" stroke="var(--danger)" strokeWidth="2" />
        <path d="M1199 176.5v3" stroke="var(--danger)" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="1199" cy="181.5" r="1.2" fill="var(--danger)" />
        <text x="1014" y="224" fontSize="30" fontWeight="800" fill="var(--text-primary)">2</text>
        <text x="1078" y="224" fontSize="11" fill="var(--text-muted)">failed parses</text>
        <rect x="1014" y="238" width="196" height="5" rx="2.5" fill="var(--subtle)" />
        <rect x="1014" y="238" width="196" height="5" rx="2.5" fill="var(--danger)" />
      </g>

      {/* table card */}
      <rect x="264" y="286" width="756" height="432" rx="14" fill="var(--surface)" stroke="var(--border)" />
      <rect x="264" y="286" width="756" height="52" rx="14" fill="var(--surface)" />
      <rect x="264" y="322" width="756" height="16" fill="var(--surface)" />
      <text x="284" y="318" fontSize="12" fontWeight="700" fill="var(--text-primary)">Recent Candidate Resumes</text>
      <rect x="420" y="300" width="54" height="20" rx="6" fill="var(--surface-2)" stroke="var(--border)" />
      <text x="447" y="314" fontSize="10" fill="var(--text-muted)" textAnchor="middle">128 items</text>
      <rect x="856" y="300" width="146" height="26" rx="7" fill="var(--raised)" stroke="var(--border)" />
      <circle cx="870" cy="313" r="5" fill="none" stroke="var(--text-subtle)" strokeWidth="1.5" />
      <text x="884" y="317" fontSize="10" fill="var(--text-subtle)">Search title or ID…</text>
      <rect x="1010" y="300" width="104" height="26" rx="7" fill="var(--raised)" stroke="var(--border)" />
      <text x="1062" y="317" fontSize="10" fill="var(--text-muted)" textAnchor="middle">All Statuses ▾</text>

      {/* table header */}
      <rect x="264" y="338" width="756" height="28" fill="var(--surface)" />
      <text x="284" y="357" fontSize="9" fontWeight="700" fill="var(--text-subtle)" letterSpacing="1">DOCUMENT &amp; DETAILS</text>
      <text x="560" y="357" fontSize="9" fontWeight="700" fill="var(--text-subtle)" letterSpacing="1">AI STATUS</text>
      <text x="720" y="357" fontSize="9" fontWeight="700" fill="var(--text-subtle)" letterSpacing="1">DATE UPLOADED</text>

      {/* rows */}
      <g fontSize="11.5">
        <line x1="264" y1="394" x2="1020" y2="394" stroke="var(--border)" />
        <rect x="284" y="372" width="32" height="32" rx="8" fill="var(--surface-2)" stroke="var(--border)" />
        <rect x="293" y="381" width="14" height="14" rx="3" fill="none" stroke="var(--text-muted)" strokeWidth="1.6" />
        <text x="326" y="391" fontWeight="600" fill="var(--text-primary)">Johnathan Vance — Senior Full Stack Engineer</text>
        <text x="326" y="406" fontSize="9" fill="var(--text-subtle)">ID: 9f3a2c81…</text>
        <rect x="560" y="380" width="86" height="20" rx="10" fill="var(--success-soft)" stroke="color-mix(in oklab, var(--success) 30%, transparent)" />
        <circle cx="574" cy="390" r="2.6" fill="var(--success)" />
        <text x="582" y="394" fontSize="9.5" fontWeight="600" fill="var(--success)">Analyzed</text>
        <text x="720" y="394" fill="var(--text-muted)">Aug 02, 2026</text>
        <rect x="918" y="378" width="86" height="22" rx="7" fill="var(--surface-2)" stroke="var(--border-strong)" />
        <text x="961" y="393" fontSize="10" fontWeight="600" fill="var(--text-muted)" textAnchor="middle">Inspect ›</text>

        <line x1="264" y1="452" x2="1020" y2="452" stroke="var(--border)" />
        <rect x="284" y="430" width="32" height="32" rx="8" fill="var(--surface-2)" stroke="var(--border)" />
        <rect x="293" y="439" width="14" height="14" rx="3" fill="none" stroke="var(--text-muted)" strokeWidth="1.6" />
        <text x="326" y="449" fontWeight="600" fill="var(--text-primary)">Priya Mehta — Product Design Lead</text>
        <text x="326" y="464" fontSize="9" fill="var(--text-subtle)">ID: 77b1e4d0…</text>
        <rect x="560" y="438" width="86" height="20" rx="10" fill="var(--success-soft)" stroke="color-mix(in oklab, var(--success) 30%, transparent)" />
        <circle cx="574" cy="448" r="2.6" fill="var(--success)" />
        <text x="582" y="452" fontSize="9.5" fontWeight="600" fill="var(--success)">Analyzed</text>
        <text x="720" y="452" fill="var(--text-muted)">Aug 01, 2026</text>
        <rect x="918" y="436" width="86" height="22" rx="7" fill="var(--surface-2)" stroke="var(--border-strong)" />
        <text x="961" y="451" fontSize="10" fontWeight="600" fill="var(--text-muted)" textAnchor="middle">Inspect ›</text>

        <line x1="264" y1="510" x2="1020" y2="510" stroke="var(--border)" />
        <rect x="284" y="488" width="32" height="32" rx="8" fill="var(--surface-2)" stroke="var(--border)" />
        <rect x="293" y="497" width="14" height="14" rx="3" fill="none" stroke="var(--text-muted)" strokeWidth="1.6" />
        <text x="326" y="507" fontWeight="600" fill="var(--text-primary)">Daniel Okafor — DevOps Engineer</text>
        <text x="326" y="522" fontSize="9" fill="var(--text-subtle)">ID: 12c9aa56…</text>
        <rect x="560" y="496" width="92" height="20" rx="10" fill="var(--accent-soft)" stroke="color-mix(in oklab, var(--accent) 30%, transparent)" />
        <circle cx="574" cy="506" r="2.6" fill="var(--accent-strong)" />
        <text x="582" y="510" fontSize="9.5" fontWeight="600" fill="var(--accent-strong)">Processing</text>
        <text x="720" y="510" fill="var(--text-muted)">Aug 01, 2026</text>
        <rect x="918" y="494" width="86" height="22" rx="7" fill="var(--surface-2)" stroke="var(--border-strong)" />
        <text x="961" y="509" fontSize="10" fontWeight="600" fill="var(--text-muted)" textAnchor="middle">Inspect ›</text>

        <line x1="264" y1="568" x2="1020" y2="568" stroke="var(--border)" />
        <rect x="284" y="546" width="32" height="32" rx="8" fill="var(--surface-2)" stroke="var(--border)" />
        <rect x="293" y="555" width="14" height="14" rx="3" fill="none" stroke="var(--text-muted)" strokeWidth="1.6" />
        <text x="326" y="565" fontWeight="600" fill="var(--text-primary)">Emily Chen — Data Scientist</text>
        <text x="326" y="580" fontSize="9" fill="var(--text-subtle)">ID: 40de8b27…</text>
        <rect x="560" y="554" width="72" height="20" rx="10" fill="var(--danger-soft)" stroke="color-mix(in oklab, var(--danger) 30%, transparent)" />
        <circle cx="574" cy="564" r="2.6" fill="var(--danger)" />
        <text x="582" y="568" fontSize="9.5" fontWeight="600" fill="var(--danger)">Failed</text>
        <text x="720" y="568" fill="var(--text-muted)">Jul 30, 2026</text>
        <rect x="918" y="552" width="86" height="22" rx="7" fill="var(--surface-2)" stroke="var(--border-strong)" />
        <text x="961" y="567" fontSize="10" fontWeight="600" fill="var(--text-muted)" textAnchor="middle">Inspect ›</text>
      </g>

      {/* table footer */}
      <rect x="264" y="676" width="756" height="42" rx="14" fill="var(--surface)" />
      <rect x="264" y="682" width="756" height="36" fill="var(--surface)" />
      <text x="284" y="701" fontSize="10.5" fill="var(--text-muted)">Showing 1–8 of 128 candidate documents</text>
      <rect x="914" y="688" width="72" height="22" rx="6" fill="var(--surface-2)" stroke="var(--border-strong)" />
      <text x="950" y="703" fontSize="10" fill="var(--text-muted)" textAnchor="middle">‹ Prev</text>
      <text x="998" y="703" fontSize="10" fill="var(--text-subtle)" textAnchor="middle">1 / 16</text>
      <rect x="1022" y="688" width="72" height="22" rx="6" fill="var(--surface-2)" stroke="var(--border-strong)" />
      <text x="1058" y="703" fontSize="10" fill="var(--text-muted)" textAnchor="middle">Next ›</text>

      {/* right column: gauge card */}
      <rect x="1032" y="286" width="196" height="196" rx="14" fill="var(--surface)" stroke="var(--border)" />
      <text x="1050" y="312" fontSize="9.5" fontWeight="700" fill="var(--text-muted)" letterSpacing="1.2">ATS COMPATIBILITY</text>
      <circle cx="1130" cy="368" r="46" fill="none" stroke="var(--subtle)" strokeWidth="9" />
      <circle cx="1130" cy="368" r="46" fill="none" stroke="var(--success)" strokeWidth="9" strokeLinecap="round"
              strokeDasharray="289" strokeDashoffset="18" />
      <text x="1130" y="380" fontSize="34" fontWeight="800" fill="var(--text-primary)" textAnchor="middle">94</text>
      <text x="1130" y="398" fontSize="10" fill="var(--text-subtle)" textAnchor="middle">/ 100</text>
      <text x="1130" y="436" fontSize="9.5" fontWeight="700" fill="var(--success)" textAnchor="middle">Superior Match</text>

      {/* right column: activity card */}
      <rect x="1032" y="494" width="196" height="224" rx="14" fill="var(--surface)" stroke="var(--border)" />
      <text x="1050" y="520" fontSize="9.5" fontWeight="700" fill="var(--text-muted)" letterSpacing="1.2">ACTIVITY FEED</text>
      <g fontSize="10.5" fill="var(--text-muted)">
        <circle cx="1058" cy="546" r="7" fill="var(--success-soft)" stroke="color-mix(in oklab, var(--success) 30%, transparent)" />
        <circle cx="1058" cy="546" r="2.5" fill="var(--success)" />
        <text x="1072" y="550">Analysis complete</text>
        <circle cx="1058" cy="584" r="7" fill="var(--success-soft)" stroke="color-mix(in oklab, var(--success) 30%, transparent)" />
        <circle cx="1058" cy="584" r="2.5" fill="var(--success)" />
        <text x="1072" y="588">Analysis complete</text>
        <circle cx="1058" cy="622" r="7" fill="var(--accent-soft)" stroke="color-mix(in oklab, var(--accent) 30%, transparent)" />
        <circle cx="1058" cy="622" r="2.5" fill="var(--accent-strong)" />
        <text x="1072" y="626">Groq evaluating…</text>
        <circle cx="1058" cy="660" r="7" fill="var(--danger-soft)" stroke="color-mix(in oklab, var(--danger) 30%, transparent)" />
        <circle cx="1058" cy="660" r="2.5" fill="var(--danger)" />
        <text x="1072" y="664">Parse failed</text>
      </g>

      <defs>
        <linearGradient id="avatar" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3f6fe0" />
          <stop offset="1" stopColor="#34d399" />
        </linearGradient>
        <linearGradient id="ctaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5b8cff" />
          <stop offset="1" stopColor="#3f6fe0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
