'use client';

import React from 'react';
import Header from './Header';

interface BookLayoutProps {
  children: React.ReactNode;
}

export default function BookLayout({ children }: BookLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="relative">
        {children}
      </main>
    </div>
  );
} 