import BookLayout from '@/components/layout/BookLayout';
import ReaderView from '@/components/reader/ReaderView';

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

export default function BookPage({ params }: BookPageProps) {
  return (
    <BookLayout>
      {/* @TODO: Replace with real data from Supabase */}
      <ReaderView bookId={params.bookId} />
    </BookLayout>
  );
} 