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
    <div className="min-h-screen bg-[#030712] flex">
      <Sidebar isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
      <div className={`flex-1 flex flex-col min-h-screen overflow-x-hidden transition-all duration-300 ease-in-out ${isCollapsed ? 'ml-16' : 'ml-60'}`}>
        {/* We place the Navbar here so it sits at the top of the main content area */}
        <Navbar />
        <AnimatedLayout className="flex-1 flex flex-col pt-2">
          {children}
        </AnimatedLayout>
      </div>
    </div>
  );
}
