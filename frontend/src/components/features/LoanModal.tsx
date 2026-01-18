'use client';

import { useState } from 'react';
import api from '@/lib/axios';
import { Book } from '@/lib/types';
import { X } from 'lucide-react';

interface LoanModalProps {
  book: Book;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LoanModal({ book, onClose, onSuccess }: LoanModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoan = async () => {
    setError('');
    setLoading(true);

    try {
      await api.post('/loans', { bookId: book.id });
      onSuccess();
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError('Ta książka jest już wypożyczona');
      } else if (err.response?.status === 404) {
        setError('Nie znaleziono książki');
      } else {
        setError('Nie udało się wypożyczyć książki');
      }
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          disabled={loading}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-900">Wypożycz książkę</h2>

        <div className="mb-6">
          <div className="bg-amber-50 rounded-lg p-4 mb-4 border border-amber-100">
            <h3 className="font-semibold text-gray-900 mb-2">{book.title}</h3>
            <p className="text-sm text-gray-600 mb-1">{book.author}</p>
            <p className="text-xs text-gray-500">ISBN: {book.isbn}</p>
          </div>

          <p className="text-gray-700 text-sm">
            Czy na pewno chcesz wypożyczyć tę książkę? Możesz ją zwrócić w każdej chwili ze strony swoich wypożyczeń.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
          >
            Anuluj
          </button>
          <button
            onClick={handleLoan}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 disabled:bg-amber-300 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Przetwarzanie...' : 'Potwierdź'}
          </button>
        </div>
      </div>
    </div>
  );
}