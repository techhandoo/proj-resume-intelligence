import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import AnimatedLayout from './AnimatedLayout';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#030712] flex">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen overflow-x-hidden">
        <AnimatedLayout className="flex-1 flex flex-col">
          {children}
        </AnimatedLayout>
      </div>
    </div>
  );
}
