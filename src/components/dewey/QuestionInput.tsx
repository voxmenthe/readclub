'use client';

import React, { useState, useEffect } from 'react';

interface QuestionInputProps {
  selectedText: string;
  onSubmit: (question: string) => void;
  isLoading: boolean;
}

export default function QuestionInput({ selectedText, onSubmit, isLoading }: QuestionInputProps) {
  const [question, setQuestion] = useState('');
  const [lastSelectedText, setLastSelectedText] = useState('');

  // Update question when new text is selected
  useEffect(() => {
    if (selectedText && selectedText !== lastSelectedText) {
      setQuestion(prev => {
        const newText = prev ? `${prev}\n\n${selectedText}` : selectedText;
        return newText;
      });
      setLastSelectedText(selectedText);
    }
  }, [selectedText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && !isLoading) {
      onSubmit(question);
      setQuestion('');
      setLastSelectedText('');
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about the selected text..."
          className="w-full p-3 pr-24 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 min-h-[120px] resize-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!question.trim() || isLoading}
          className={`absolute right-2 top-2 px-4 py-1.5 rounded-md text-white transition-colors ${
            question.trim() && !isLoading
              ? 'bg-blue-500 hover:bg-blue-600'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            'Ask'
          )}
        </button>
      </form>
    </div>
  );
} 