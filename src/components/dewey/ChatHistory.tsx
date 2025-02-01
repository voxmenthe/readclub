'use client';

import React from 'react';

export default function ChatHistory() {
  return (
    <div className="flex-1 overflow-y-auto mt-4 space-y-4">
      {/* Placeholder for empty state */}
      <div className="text-center text-gray-500 py-8">
        <p className="text-sm">Select text from the book to start a conversation with Dewey</p>
      </div>
      
      {/* Messages will be rendered here */}
      <div className="space-y-4">
        {/* Example of how messages will look */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-900">
            Selected text will appear here...
          </p>
        </div>
      </div>
    </div>
  );
} 