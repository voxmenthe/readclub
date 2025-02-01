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
  const [isResizing, setIsResizing] = useState(false);

  // Calculate height of text without actually adding it
  const calculateTextHeight = (text: string) => {
    if (!textareaRef.current) return 0;
    const textarea = textareaRef.current;
    
    // Create a hidden div with same width and styling
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.visibility = 'hidden';
    div.style.width = `${textarea.clientWidth - 24}px`; // Subtract padding
    div.style.padding = '12px';
    div.style.font = window.getComputedStyle(textarea).font;
    div.style.lineHeight = window.getComputedStyle(textarea).lineHeight;
    div.style.whiteSpace = 'pre-wrap';
    div.textContent = text;
    
    document.body.appendChild(div);
    const height = div.clientHeight;
    document.body.removeChild(div);
    
    return height;
  };

  // Update question when new text is selected
  useEffect(() => {
    if (selectedText && selectedText !== lastSelectedText && textareaRef.current) {
      const textarea = textareaRef.current;
      const newText = question ? `${question}\n${selectedText}` : selectedText;
      const addedHeight = calculateTextHeight(selectedText);
      
      // Only expand if content would exceed current height
      const currentScrollHeight = textarea.scrollHeight;
      const currentHeight = textarea.clientHeight;
      
      if (currentScrollHeight + addedHeight > currentHeight) {
        const newHeight = Math.min(
          currentHeight + addedHeight,
          window.innerHeight - 200 // Max height with some padding
        );
        textarea.style.height = `${newHeight}px`;
      }

      setQuestion(newText);
      setLastSelectedText(selectedText);
      
      // Scroll to bottom after state update
      setTimeout(() => {
        textarea.scrollTop = textarea.scrollHeight;
      }, 0);
    }
  }, [selectedText, lastSelectedText, question]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && !isLoading) {
      onSubmit(question);
      setQuestion('');
      setLastSelectedText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = '120px'; // Reset to min height
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (question.trim() && !isLoading) {
        onSubmit(question);
        setQuestion('');
        setLastSelectedText('');
        if (textareaRef.current) {
          textareaRef.current.style.height = '120px'; // Reset to min height
        }
      }
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          {/* Top resize handle */}
          <div 
            className="absolute top-0 left-0 right-0 h-1 cursor-ns-resize hover:bg-blue-200 transition-colors"
            onMouseDown={(e) => {
              e.preventDefault();
              const startY = e.clientY;
              const startHeight = textareaRef.current?.clientHeight || 0;
              const startTop = textareaRef.current?.getBoundingClientRect().top || 0;
              
              setIsResizing(true);
              
              const handleMouseMove = (e: MouseEvent) => {
                if (!textareaRef.current) return;
                const deltaY = startY - e.clientY;
                const newHeight = Math.max(120, startHeight + deltaY);
                textareaRef.current.style.height = `${newHeight}px`;
              };
              
              const handleMouseUp = () => {
                setIsResizing(false);
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };
              
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          />
          
          <textarea
            ref={textareaRef}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about the selected text..."
            className="w-full p-3 pr-24 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 min-h-[120px] resize-none"
            disabled={isLoading}
            style={{ cursor: isResizing ? 'ns-resize' : 'text' }}
          />
          
          {/* Bottom resize handle */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-1 cursor-ns-resize hover:bg-blue-200 transition-colors"
            onMouseDown={(e) => {
              e.preventDefault();
              const startY = e.clientY;
              const startHeight = textareaRef.current?.clientHeight || 0;
              
              setIsResizing(true);
              
              const handleMouseMove = (e: MouseEvent) => {
                if (!textareaRef.current) return;
                const deltaY = e.clientY - startY;
                const newHeight = Math.max(120, startHeight + deltaY);
                textareaRef.current.style.height = `${newHeight}px`;
              };
              
              const handleMouseUp = () => {
                setIsResizing(false);
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };
              
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          />
        </div>

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