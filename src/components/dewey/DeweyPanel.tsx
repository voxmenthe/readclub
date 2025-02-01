'use client';

import React, { useState, useCallback } from 'react';
import ChatHistory from './ChatHistory';
import ActionButtons from './ActionButtons';
import QuestionInput from './QuestionInput';
import { Message } from '@/lib/ai/types';

interface DeweyPanelProps {
  selectedText?: string;
  bookTitle: string;
}

export default function DeweyPanel({ selectedText, bookTitle }: DeweyPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAction, setCurrentAction] = useState<string>('explain');

  const handleQuestionSubmit = useCallback(async (question: string) => {
    try {
      setIsLoading(true);
      
      const userMessage: Message = {
        role: 'user',
        content: question,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, userMessage]);

      const response = await fetch('/api/dewey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: currentAction,
          selectedText: selectedText,
          question: question,
          bookContext: {
            title: bookTitle,
            currentLocation: 0,
          },
          conversationHistory: messages
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        role: 'assistant',
        content: data.content.mainText,
        timestamp: new Date().toISOString(),
        action: data.type
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedText, bookTitle, messages, currentAction]);

  const handleActionSelect = useCallback((action: string) => {
    setCurrentAction(action);
  }, []);

  return (
    <div 
      className={`fixed right-0 top-0 h-full bg-white shadow-xl border-l transition-all duration-200 ease-in-out ${
        isExpanded ? 'w-[480px]' : 'w-12'
      }`}
    >
      <div className="flex items-center justify-between p-6 border-b bg-gray-50">
        <div className={`flex-1 ${!isExpanded && 'hidden'}`}>
          <h2 className="text-2xl font-bold text-gray-900">Dewey</h2>
          <p className="text-sm text-gray-600">{bookTitle}</p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label={isExpanded ? 'Collapse panel' : 'Expand panel'}
        >
          {isExpanded ? '→' : '←'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="flex flex-col h-[calc(100%-88px)]">
          <div className="p-4 border-b bg-white sticky top-0">
            <ActionButtons onActionSelect={handleActionSelect} />
          </div>
          
          {selectedText ? (
            <div className="p-4 border-b bg-white sticky top-[73px]">
              <QuestionInput
                selectedText={selectedText}
                onSubmit={handleQuestionSubmit}
                isLoading={isLoading}
              />
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p className="text-sm">Select text from the book to start a conversation</p>
            </div>
          )}
          
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <ChatHistory messages={messages} />
          </div>
        </div>
      )}
    </div>
  );
} 