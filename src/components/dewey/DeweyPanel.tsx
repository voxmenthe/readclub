'use client';

import React from 'react';
import ChatHistory from './ChatHistory';
import ActionButtons from './ActionButtons';

export default function DeweyPanel() {
  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl border-l p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dewey</h2>
      <ActionButtons />
      <ChatHistory />
    </div>
  );
} 