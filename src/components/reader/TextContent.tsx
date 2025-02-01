'use client';

import React, { useState, useCallback } from 'react';
import FloatingActionButton from './FloatingActionButton';

interface TextContentProps {
  bookId: string;
  content: string;
  onTextSelect?: (text: string) => void;
}

export default function TextContent({ bookId, content, onTextSelect }: TextContentProps) {
  const [selectedText, setSelectedText] = useState('');
  const [buttonPosition, setButtonPosition] = useState<{ x: number; y: number } | null>(null);

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setSelectedText('');
      setButtonPosition(null);
      return;
    }

    const text = selection.toString().trim();
    if (!text) {
      setSelectedText('');
      setButtonPosition(null);
      return;
    }

    setSelectedText(text);

    // Get the selection coordinates
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    // Position the button above the selection
    setButtonPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
  }, []);

  const handleAskDewey = useCallback(() => {
    if (onTextSelect && selectedText) {
      onTextSelect(selectedText);
      // Clear selection after sending to Dewey
      window.getSelection()?.removeAllRanges();
      setButtonPosition(null);
    }
  }, [selectedText, onTextSelect]);

  // Split content into paragraphs
  const paragraphs = content.split('\n\n');

  return (
    <div 
      className="prose prose-lg max-w-none bg-white p-8 rounded-lg shadow-sm"
      onMouseUp={handleTextSelection}
      onTouchEnd={handleTextSelection}
    >
      <FloatingActionButton
        position={buttonPosition}
        onAskDewey={handleAskDewey}
      />
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="mb-6 text-gray-900 text-lg leading-relaxed">
          {paragraph.trim()}
        </p>
      ))}
    </div>
  );
} 