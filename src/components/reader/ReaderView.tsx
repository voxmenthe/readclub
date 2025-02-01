'use client';

import React, { useState, useCallback } from 'react';
import DeweyPanel from '../dewey/DeweyPanel';

interface ReaderViewProps {
  bookId: string;
  initialContent: string;
  title: string;
}

export default function ReaderView({ bookId, initialContent, title }: ReaderViewProps) {
  const [selectedText, setSelectedText] = useState<string>('');

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim());
    }
  }, []);

  return (
    <div className="relative flex min-h-screen bg-white">
      <div 
        className="flex-1 max-w-3xl mx-auto px-8 py-16"
        onMouseUp={handleTextSelection}
      >
        <div className="prose prose-lg max-w-none">
          <h1 className="text-3xl font-serif text-gray-900 mb-12">Chapter 1</h1>
          <div className="text-xl text-gray-800 leading-relaxed font-serif">
            {initialContent}
          </div>
        </div>
      </div>
      <DeweyPanel 
        selectedText={selectedText}
        bookTitle={title}
      />
    </div>
  );
} 