import React from 'react';
import BookLayout from '@/components/layout/BookLayout';
import ReaderView from '@/components/reader/ReaderView';
import { Metadata } from 'next';
import { Suspense } from 'react';

// Dummy book content for initial UI testing
const DUMMY_CONTENT = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
`;

interface BookPageProps {
  params: {
    bookId: string;
  };
}

// This is a Server Component
async function getBookData(bookId: string) {
  // In a real app, this would fetch from an API or database
  return {
    id: bookId,
    title: 'Alice in Wonderland',
    content: `Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, "and what is the use of a book," thought Alice "without pictures or conversations?"

So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.`
  };
}

export async function generateMetadata(props: BookPageProps): Promise<Metadata> {
  const resolvedParams = await props.params;
  const book = await getBookData(resolvedParams.bookId);
  return {
    title: `${book.title} | ReadClub`,
  };
}

export default async function BookPage(props: BookPageProps) {
  const resolvedParams = await props.params;
  const book = await getBookData(resolvedParams.bookId);
  
  return (
    <BookLayout>
      <ReaderView 
        bookId={book.id}
        initialContent={book.content}
        title={book.title}
      />
    </BookLayout>
  );
} 