'use client';

import React from 'react';

interface Message {
  text: string;
  isUser: boolean;
}

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
            message.isUser
              ? 'bg-blue-50 text-blue-900'
              : 'bg-gray-50 text-gray-900'
          }`}
        >
          <div className="text-xs font-medium mb-1">
            {message.isUser ? 'You' : 'Dewey'}
          </div>
          <div className="text-sm whitespace-pre-wrap">{message.text}</div>
        </div>
      ))}
    </div>
  );
} 