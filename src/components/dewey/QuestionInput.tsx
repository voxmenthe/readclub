'use client';

import React, { useState, useEffect, useRef } from 'react';

interface QuestionInputProps {
  selectedText: string;
  onSubmit: (question: string) => void;
  isLoading: boolean;
}

export default function QuestionInput({ selectedText, onSubmit, isLoading }: QuestionInputProps) {
  const [question, setQuestion] = useState('');
  const [lastSelectedText, setLastSelectedText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update question when new text is selected
  useEffect(() => {
    if (selectedText && selectedText !== lastSelectedText) {
      setQuestion(prev => {
        const newText = prev ? `${prev}\n${selectedText}` : selectedText;
        return newText;
      });
      setLastSelectedText(selectedText);
      
      // Scroll to bottom after state update
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
      }, 0);
    }
  }, [selectedText, lastSelectedText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && !isLoading) {
      onSubmit(question);
      setQuestion('');
      setLastSelectedText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (question.trim() && !isLoading) {
        onSubmit(question);
        setQuestion('');
        setLastSelectedText('');
      }
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          ref={textareaRef}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about the selected text..."
          className="w-full p-3 pr-24 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 min-h-[120px] resize-none"
          disabled={isLoading}
        />
        <div className="absolute right-2 top-2 flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {(navigator.platform.includes('Mac') ? '⌘' : 'Ctrl') + ' + Enter to submit'}
          </span>
          <button
            type="submit"
            disabled={!question.trim() || isLoading}
            className={`px-4 py-1.5 rounded-md text-white transition-colors ${
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
        </div>
      </form>
    </div>
  );
} 