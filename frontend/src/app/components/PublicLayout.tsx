'use client';

import PublicSidebar from './sidebar/PublicSidebar';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen bg-blue-700 text-white">
      <PublicSidebar />
      
      <main className="flex-grow md:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
