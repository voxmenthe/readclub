'use client';

import React, { useState, useCallback } from 'react';
import ChatHistory from './ChatHistory';
import ActionButtons from './ActionButtons';
import QuestionInput from './QuestionInput';

interface DeweyPanelProps {
  selectedText?: string;
}

export default function DeweyPanel({ selectedText }: DeweyPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);

  const handleQuestionSubmit = useCallback((question: string) => {
    // Add the user's question to the chat history
    setMessages(prev => [...prev, { text: question, isUser: true }]);
    
    // TODO: Send to AI and handle response
    // For now, just add a placeholder response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "This is a placeholder response. AI integration coming soon!", 
        isUser: false 
      }]);
    }, 1000);
  }, []);

  return (
    <div className={`fixed right-0 top-0 h-full bg-white shadow-xl border-l transition-all duration-200 ease-in-out ${isExpanded ? 'w-96' : 'w-12'}`}>
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className={`text-2xl font-bold text-gray-900 ${!isExpanded && 'hidden'}`}>Dewey</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isExpanded ? '→' : '←'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="flex flex-col h-[calc(100%-80px)] p-6">
          {selectedText && (
            <div className="mb-6">
              <QuestionInput
                selectedText={selectedText}
                onSubmit={handleQuestionSubmit}
              />
            </div>
          )}
          <ActionButtons />
          <div className="flex-1 overflow-y-auto mt-6">
            <ChatHistory messages={messages} />
          </div>
        </div>
      )}
    </div>
  );
} 