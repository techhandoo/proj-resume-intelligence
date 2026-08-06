import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import AnimatedLayout from './AnimatedLayout';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="min-h-screen bg-[#05050a] flex selection:bg-blue-500/30 overflow-hidden relative">
      {/* ── Midnight Mesh Background Orbs ── */}
      <div className="absolute top-0 left-1/4 w-[50vw] h-[50vw] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[40vw] h-[40vw] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none translate-y-1/3" />

      <Sidebar isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
      
      {/* ── Bounded Main Container ── */}
      <div 
        className="flex-1 flex flex-col min-h-screen relative z-10"
        style={{
          marginLeft: isCollapsed ? '4rem' : '15rem',
          width: `calc(100vw - ${isCollapsed ? '4rem' : '15rem'})`,
          transition: 'margin-left 300ms var(--ease-drawer), width 300ms var(--ease-drawer)'
        }}
      >
        <Navbar />
        <AnimatedLayout className="flex-1 flex flex-col pt-2 w-full max-w-full overflow-x-hidden">
          {children}
        </AnimatedLayout>
      </div>
    </div>
  );
}
