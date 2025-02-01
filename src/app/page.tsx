import Header from '@/components/layout/Header';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-12">Welcome to ReadClub</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <a 
            href="/books/1"
            className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Alice in Wonderland</h2>
            <p className="text-gray-600">Lewis Carroll</p>
          </a>
        </div>
      </main>
    </div>
  );
}
