'use client';

import React, { useState } from 'react';
import TextContent from './TextContent';
import ProgressBar from './ProgressBar';
import DeweyPanel from '../dewey/DeweyPanel';

interface ReaderViewProps {
  bookId: string;
}

export default function ReaderView({ bookId }: ReaderViewProps) {
  const [selectedText, setSelectedText] = useState<string>('');

  const handleTextSelect = (text: string) => {
    setSelectedText(text);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 container mx-auto px-6 py-8 pr-[28rem]">
        <TextContent bookId={bookId} onTextSelect={handleTextSelect} />
        <ProgressBar />
      </div>
      <DeweyPanel selectedText={selectedText} />
    </div>
  );
} 