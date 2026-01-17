'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { Loan } from '@/lib/types';
import Navbar from '@/components/layout/Navbar';
import { BookOpen, CheckCircle, Library, ArrowLeft } from 'lucide-react';

export default function LoansPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchLoans();
    }
  }, [status, router]);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const response = await api.get<Loan[]>('/loans/me');
      setLoans(response.data);
    } catch (error) {
      console.error('Błąd podczas pobierania wypożyczeń:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (loanId: number) => {
    if (!confirm('Czy na pewno chcesz zwrócić tę książkę?')) return;

    try {
      await api.put(`/loans/${loanId}/return`);
      fetchLoans();
    } catch (error) {
      console.error('Błąd podczas zwracania książki:', error);
      alert('Nie udało się zwrócić książki');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-600">Ładowanie...</div>
        </div>
      </div>
    );
  }

  const activeLoans = loans.filter((loan) => !loan.returnDate);
  const returnedLoans = loans.filter((loan) => loan.returnDate);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Moje wypożyczenia</h1>
          </div>
          <p className="text-gray-600">Przeglądaj i zarządzaj swoimi wypożyczonymi książkami</p>
        </div>

        {/* Active Loans */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Obecnie wypożyczone ({activeLoans.length})
          </h2>

          {activeLoans.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <Library className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Nie masz aktywnych wypożyczeń</p>
              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center gap-2 text-blue-600 hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Przeglądaj książki
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Książka
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Autor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data wypożyczenia
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Akcje
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activeLoans.map((loan) => (
                    <tr key={loan.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-gray-900">{loan.book.title}</div>
                            <div className="text-sm text-gray-500">ISBN: {loan.book.isbn}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{loan.book.author}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDate(loan.borrowedAt)}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleReturn(loan.id)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Zwróć
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Returned Loans History */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Historia ({returnedLoans.length})
          </h2>

          {returnedLoans.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-500">Brak historii wypożyczeń</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Książka
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Autor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Wypożyczone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Zwrócone
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {returnedLoans.map((loan) => (
                    <tr key={loan.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-gray-900">{loan.book.title}</div>
                            <div className="text-sm text-gray-500">ISBN: {loan.book.isbn}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{loan.book.author}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDate(loan.borrowedAt)}</td>
                      <td className="px-6 py-4 text-sm">
                        {loan.returnDate && (
                          <span className="text-green-600">{formatDate(loan.returnDate)}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}