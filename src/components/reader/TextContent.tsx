'use client';

import React, { useState, useCallback } from 'react';
import FloatingActionButton from './FloatingActionButton';

interface TextContentProps {
  bookId: string;
  onTextSelect?: (text: string) => void;
}

// Dummy content for initial UI testing
const DUMMY_CONTENT = `
Chapter 1

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, "and what is the use of a book," thought Alice "without pictures or conversations?"

So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.

There was nothing so very remarkable in that; nor did Alice think it so very much out of the way to hear the Rabbit say to itself, "Oh dear! Oh dear! I shall be late!" (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually took a watch out of its waistcoat-pocket, and looked at it, and then hurried on, Alice started to her feet, for it flashed across her mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.
`;

export default function TextContent({ bookId, onTextSelect }: TextContentProps) {
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

  // @TODO: Replace with real data from Supabase
  const paragraphs = DUMMY_CONTENT.split('\n\n');

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