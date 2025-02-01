import Header from '@/components/layout/Header';
import BookList from '@/components/library/BookList';

// Dummy data for initial UI testing
const DUMMY_BOOKS = [
  { id: '1', title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'Classic' },
  { id: '2', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic' },
  { id: '3', title: '1984', author: 'George Orwell', genre: 'Science Fiction' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-12">Welcome to AI Reading Club</h1>
        {/* @TODO: Replace with real data from Supabase */}
        <BookList books={DUMMY_BOOKS} />
      </main>
    </div>
  );
}
