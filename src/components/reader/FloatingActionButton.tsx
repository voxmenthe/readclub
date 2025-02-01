import React from 'react';

interface FloatingActionButtonProps {
  position: { x: number; y: number } | null;
  onAskDewey: () => void;
}

export default function FloatingActionButton({ position, onAskDewey }: FloatingActionButtonProps) {
  if (!position) return null;

  return (
    <div
      className="fixed z-50 bg-blue-600 text-white rounded-lg shadow-lg transform -translate-x-1/2 transition-all duration-200 ease-in-out"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
    >
      <button
        onClick={onAskDewey}
        className="px-4 py-2 hover:bg-blue-700 transition-colors flex items-center space-x-2 rounded-lg"
      >
        <span>Ask Dewey</span>
      </button>
    </div>
  );
} 