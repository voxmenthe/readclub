'use client';

import React from 'react';
import { Message } from '@/lib/ai/types';

interface ChatHistoryProps {
  messages: Message[];
}

export default function ChatHistory({ messages }: ChatHistoryProps) {
  if (messages.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p className="text-sm">Select text from the book to start a conversation with Dewey</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg ${
            message.role === 'user'
              ? 'bg-blue-50 ml-8'
              : 'bg-gray-50 mr-8'
          }`}
        >
          <div className="flex items-start gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              message.role === 'user'
                ? 'bg-blue-500'
                : 'bg-gray-500'
            }`}>
              <span className="text-white text-sm">
                {message.role === 'user' ? 'U' : 'D'}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{message.content}</p>
              {message.action && (
                <span className="mt-1 text-xs text-gray-500">
                  Action: {message.action}
                </span>
              )}
              <span className="block mt-1 text-xs text-gray-500">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 