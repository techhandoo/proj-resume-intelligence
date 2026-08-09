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
    <div className="min-h-screen bg-[#030304] bg-mesh-pattern flex selection:bg-blue-500/30 selection:text-blue-200 overflow-x-hidden">
      <Sidebar isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
      
      <div 
        className="flex-1 flex flex-col min-h-screen relative transition-all duration-300 ease-out"
        style={{
          marginLeft: isCollapsed ? '4rem' : '15rem',
          width: `calc(100vw - ${isCollapsed ? '4rem' : '15rem'})`,
        }}
      >
        <Navbar />
        <AnimatedLayout className="flex-1 flex flex-col w-full mx-auto max-w-7xl px-6 sm:px-10 lg:px-12 py-8">
          {children}
        </AnimatedLayout>
      </div>
    </div>
  );
}

