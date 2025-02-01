import React from 'react';
import Header from './Header';

interface BookLayoutProps {
  children: React.ReactNode;
}

export default function BookLayout({ children }: BookLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="flex">
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
} 