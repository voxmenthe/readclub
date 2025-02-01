'use client';

import React from 'react';

interface TextContentProps {
  bookId: string;
}

// Dummy content for initial UI testing
const DUMMY_CONTENT = `
Chapter 1

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
`;

export default function TextContent({ bookId }: TextContentProps) {
  // @TODO: Replace with real data from Supabase
  const paragraphs = DUMMY_CONTENT.split('\n\n');

  return (
    <div className="prose prose-lg max-w-none bg-white p-8 rounded-lg shadow-sm">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="mb-6 text-gray-900 text-lg leading-relaxed">
          {paragraph.trim()}
        </p>
      ))}
    </div>
  );
} 