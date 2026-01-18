'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { Book, PaginatedBooks } from '@/lib/types';
import Navbar from '@/components/layout/Navbar';
import BookModal from '@/components/features/BookModal';
import LoanModal from '@/components/features/LoanModal';
import axios from 'axios';
import { 
  BookOpen, 
  Plus, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Edit2,
  Trash2,
  Library
} from 'lucide-react';

// Kolory brązowe dla motywu biblioteki
const brandColors = {
  primary: 'amber-700',      // #b45309
  primaryHover: 'amber-800', // #92400e
  primaryLight: 'amber-50',  // #fffbeb
  primaryBorder: 'amber-200' // #fde68a
};

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState<'title' | 'author' | 'isbn'>('title');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, [page, search, status, sortBy, order, limit]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      
      const request = status === 'authenticated' 
        ? api.get<PaginatedBooks>('/books', {
            params: {
              page,
              limit,
              search: search || undefined,
              sortBy,
              order,
            },
          })
        : axios.get<PaginatedBooks>(`${process.env.NEXT_PUBLIC_API_URL}/books`, {
            params: {
              page,
              limit,
              search: search || undefined,
              sortBy,
              order,
            },
          });

      const response = await request;
      setBooks(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setTotal(response.data.pagination.total);
    } catch (error: any) {
      console.error('Błąd podczas pobierania książek:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleSortChange = (field: 'title' | 'author' | 'isbn') => {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setOrder('asc');
    }
    setPage(1);
  };

  const handleCreateBook = () => {
    setSelectedBook(null);
    setIsEditMode(false);
    setIsBookModalOpen(true);
  };

  const handleEditBook = (book: Book) => {
    setSelectedBook(book);
    setIsEditMode(true);
    setIsBookModalOpen(true);
  };

  const handleDeleteBook = async (bookId: number) => {
    if (!confirm('Czy na pewno chcesz usunąć tę książkę?')) return;

    try {
      await api.delete(`/books/${bookId}`);
      fetchBooks();
    } catch (error) {
      console.error('Błąd podczas usuwania książki:', error);
      alert('Nie udało się usunąć książki');
    }
  };

  const handleLoanBook = (book: Book) => {
    if (status !== 'authenticated') {
      router.push('/login');
      return;
    }
    
    // Sprawdź czy książka jest dostępna
    if (book.isAvailable === false) {
      alert('Ta książka jest już wypożyczona i niedostępna');
      return;
    }
    
    setSelectedBook(book);
    setIsLoanModalOpen(true);
  };

  const handleBookSaved = () => {
    setIsBookModalOpen(false);
    fetchBooks();
  };

  const handleLoanCreated = () => {
    setIsLoanModalOpen(false);
    fetchBooks();
  };

  if (loading && status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-600">Ładowanie...</div>
        </div>
      </div>
    );
  }

  const isAdmin = session?.user?.role === 'ADMIN';
  const isAuthenticated = status === 'authenticated';

  const SortButton = ({ field, label }: { field: 'title' | 'author' | 'isbn', label: string }) => (
    <button
      onClick={() => handleSortChange(field)}
      className={`text-xs font-medium uppercase tracking-wider ${
        sortBy === field ? 'text-amber-700' : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {label}
      {sortBy === field && (
        <span className="ml-1">{order === 'asc' ? '↑' : '↓'}</span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Library className="w-8 h-8 text-amber-700" />
            <h1 className="text-3xl font-bold text-gray-900">Biblioteka</h1>
          </div>
          <p className="text-gray-600">
            {isAuthenticated 
              ? 'Przeglądaj i wypożyczaj książki z naszej kolekcji'
              : 'Zaloguj się, aby wypożyczać książki z naszej kolekcji'}
          </p>
        </div>

        {/* Login prompt */}
        {!isAuthenticated && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-900 text-sm">
              <BookOpen className="inline w-4 h-4 mr-2" />
              Aby wypożyczać książki, musisz być zalogowany.{' '}
              <a href="/login" className="font-semibold underline hover:text-amber-950">
                Zaloguj się
              </a>{' '}
              lub{' '}
              <a href="/register" className="font-semibold underline hover:text-amber-950">
                zarejestruj się
              </a>
              .
            </p>
          </div>
        )}

        {/* Search and Controls */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Szukaj po tytule, autorze lub ISBN..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-4">
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value={10}>10 na stronę</option>
                <option value={20}>20 na stronę</option>
                <option value={50}>50 na stronę</option>
                <option value={100}>100 na stronę</option>
              </select>

              {isAdmin && (
                <button
                  onClick={handleCreateBook}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition whitespace-nowrap"
                >
                  <Plus className="w-5 h-5" />
                  Dodaj książkę
                </button>
              )}
            </div>
          </div>

          {/* Results info */}
          <div className="text-sm text-gray-600">
            Znaleziono {total} {total === 1 ? 'książkę' : total < 5 ? 'książki' : 'książek'}
          </div>
        </div>

        {/* Books Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Ładowanie książek...</div>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">Nie znaleziono książek</p>
            {search && (
              <button
                onClick={() => handleSearchChange('')}
                className="text-amber-700 hover:underline"
              >
                Wyczyść wyszukiwanie
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <SortButton field="title" label="Tytuł" />
                      </th>
                      <th className="px-6 py-3 text-left">
                        <SortButton field="author" label="Autor" />
                      </th>
                      <th className="px-6 py-3 text-left">
                        <SortButton field="isbn" label="ISBN" />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Akcje
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {books.map((book) => (
                      <tr key={book.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <BookOpen className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            <span className="font-medium text-gray-900">{book.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{book.author}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{book.isbn}</td>
                        <td className="px-6 py-4">
                          {book.isAvailable ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Dostępna
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Wypożyczona
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {isAuthenticated ? (
                              <button
                                onClick={() => handleLoanBook(book)}
                                disabled={!book.isAvailable}
                                className={`px-3 py-1.5 text-white text-sm rounded transition ${
                                  book.isAvailable
                                    ? 'bg-amber-700 hover:bg-amber-800'
                                    : 'bg-gray-300 cursor-not-allowed'
                                }`}
                                title={book.isAvailable ? 'Wypożycz' : 'Książka jest już wypożyczona'}
                              >
                                Wypożycz
                              </button>
                            ) : (
                              <button
                                onClick={() => handleLoanBook(book)}
                                className="px-3 py-1.5 bg-gray-400 text-white text-sm rounded hover:bg-gray-500 transition"
                                title="Zaloguj się, aby wypożyczyć"
                              >
                                Zaloguj się
                              </button>
                            )}

                            {isAdmin && (
                              <>
                                <button
                                  onClick={() => handleEditBook(book)}
                                  className="p-1.5 text-gray-600 hover:text-amber-700 hover:bg-amber-50 rounded transition"
                                  title="Edytuj"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteBook(book.id)}
                                  className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition"
                                  title="Usuń"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Strona {page} z {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Poprzednia
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Następna
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {isBookModalOpen && (
        <BookModal
          book={selectedBook}
          isEdit={isEditMode}
          onClose={() => setIsBookModalOpen(false)}
          onSave={handleBookSaved}
        />
      )}

      {isLoanModalOpen && selectedBook && (
        <LoanModal
          book={selectedBook}
          onClose={() => setIsLoanModalOpen(false)}
          onSuccess={handleLoanCreated}
        />
      )}
    </div>
  );
}