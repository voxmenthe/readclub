import React, { useEffect, useRef } from 'react';
import { useCallback } from 'react';

interface QuestionInputProps {
  selectedText: string;
  onSubmit: (question: string) => void;
}

export default function QuestionInput({ selectedText, onSubmit }: QuestionInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea as content changes
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, []);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (textarea && textarea.value.trim()) {
        onSubmit(textarea.value);
        textarea.value = '';
        adjustTextareaHeight();
      }
    }
  }, [onSubmit, adjustTextareaHeight]);

  // Auto-focus and populate with selected text
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea && selectedText) {
      textarea.value = selectedText + '\n\n'; // Add space for the question
      textarea.focus();
      // Place cursor after the selected text
      textarea.setSelectionRange(
        selectedText.length + 2,
        selectedText.length + 2
      );
      adjustTextareaHeight();
    }
  }, [selectedText, adjustTextareaHeight]);

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        className="w-full min-h-[100px] p-3 text-sm text-gray-900 bg-white border border-gray-200 
                   rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        placeholder="Selected text will appear here. Add your question below..."
        onKeyDown={handleKeyDown}
        onChange={adjustTextareaHeight}
      />
      <div className="mt-1 text-xs text-gray-500">
        Press Cmd/Ctrl + Enter to submit
      </div>
    </div>
  );
} 