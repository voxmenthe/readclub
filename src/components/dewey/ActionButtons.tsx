'use client';

import React from 'react';

export default function ActionButtons() {
  return (
    <div className="flex flex-wrap gap-2">
      <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg font-medium hover:bg-blue-700 transition-colors">
        Explain
      </button>
      <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg font-medium hover:bg-blue-700 transition-colors">
        Discuss
      </button>
      <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg font-medium hover:bg-blue-700 transition-colors">
        Quiz
      </button>
      <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg font-medium hover:bg-blue-700 transition-colors">
        Recap
      </button>
      <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg font-medium hover:bg-blue-700 transition-colors">
        Look Up
      </button>
    </div>
  );
} 