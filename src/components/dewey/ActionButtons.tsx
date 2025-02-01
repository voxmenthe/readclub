'use client';

import React from 'react';

interface ActionButtonsProps {
  onActionSelect?: (action: string) => void;
}

export default function ActionButtons({ onActionSelect }: ActionButtonsProps) {
  const actions = [
    { label: 'Explain', icon: '📚', action: 'explain' },
    { label: 'Quiz', icon: '❓', action: 'quiz' },
    { label: 'Discuss', icon: '💭', action: 'discuss' },
    { label: 'Recap', icon: '📝', action: 'recap' },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {actions.map(({ label, icon, action }) => (
        <button
          key={label}
          onClick={() => onActionSelect?.(action)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
        >
          <span>{icon}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}