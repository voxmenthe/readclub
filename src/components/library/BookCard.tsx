'use client';

import React from 'react';
import Link from 'next/link';

interface BookCardProps {
  id?: string; // Made optional for dummy data
  title: string;
  author: string;
  genre?: string;
}

export default function BookCard({ id = '1', title, author, genre }: BookCardProps) {
  return (
    <Link href={`/books/${id}`} className="block">
      <div className="p-6 border-2 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer bg-white">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-700 font-medium mb-1">{author}</p>
        {genre && <p className="text-gray-600 text-sm">{genre}</p>}
      </div>
    </Link>
  );
} 