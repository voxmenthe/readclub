'use client';

import React from 'react';
import TextContent from './TextContent';
import ProgressBar from './ProgressBar';

interface ReaderViewProps {
  bookId: string;
}

export default function ReaderView({ bookId }: ReaderViewProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 container mx-auto px-6 py-8 pr-[28rem]">
        <TextContent bookId={bookId} />
        <ProgressBar />
      </div>
    </div>
  );
} 