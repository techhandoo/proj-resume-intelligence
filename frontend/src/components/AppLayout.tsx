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
    <div className="min-h-screen bg-black flex selection:bg-zinc-800 overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
      
      <div 
        className="flex-1 flex flex-col min-h-screen relative"
        style={{
          marginLeft: isCollapsed ? '4rem' : '14rem',
          width: `calc(100vw - ${isCollapsed ? '4rem' : '14rem'})`,
          transition: 'margin-left 200ms ease, width 200ms ease'
        }}
      >
        <Navbar />
        <AnimatedLayout className="flex-1 flex flex-col w-full mx-auto max-w-7xl px-8 sm:px-12 lg:px-16 py-10">
          {children}
        </AnimatedLayout>
      </div>
    </div>
  );
}
