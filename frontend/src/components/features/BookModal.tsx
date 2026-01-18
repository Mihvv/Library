'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { Book } from '@/lib/types';
import { X } from 'lucide-react';

interface BookModalProps {
  book: Book | null;
  isEdit: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function BookModal({ book, isEdit, onClose, onSave }: BookModalProps) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setIsbn(book.isbn);
    }
  }, [book]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEdit && book) {
        await api.put(`/books/${book.id}`, { title, author, isbn });
      } else {
        await api.post('/books', { title, author, isbn });
      }
      onSave();
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError('ISBN już istnieje');
      } else {
        setError('Nie udało się zapisać książki');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-900">
          {isEdit ? 'Edytuj książkę' : 'Dodaj nową książkę'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Tytuł
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Autor
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              ISBN
            </label>
            <input
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 disabled:bg-amber-300 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Zapisywanie...' : 'Zapisz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}