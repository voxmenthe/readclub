'use client';

import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            AI Reading Club
          </Link>
          <div className="space-x-4">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Library
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
} 