'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { User, Loan } from '@/lib/types';
import Navbar from '@/components/layout/Navbar';
import { Shield, Users, BookOpen, Trash2, CheckCircle } from 'lucide-react';

interface UserWithLoans extends User {
  loans: Array<{
    id: number;
    bookId: number;
    borrowedAt: string;
  }>;
}

interface LoanWithDetails extends Loan {
  user: {
    id: number;
    email: string;
  };
}

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<UserWithLoans[]>([]);
  const [allLoans, setAllLoans] = useState<LoanWithDetails[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'loans'>('users');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      if (session.user.role !== 'ADMIN') {
        router.push('/');
      } else {
        fetchData();
      }
    }
  }, [status, session, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, loansRes] = await Promise.all([
        api.get<UserWithLoans[]>('/users'),
        api.get<LoanWithDetails[]>('/loans'),
      ]);
      setUsers(usersRes.data);
      setAllLoans(loansRes.data);
    } catch (error) {
      console.error('Błąd podczas pobierania danych:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Czy na pewno chcesz usunąć tego użytkownika?')) return;

    try {
      await api.delete(`/users/${userId}`);
      fetchData();
    } catch (error) {
      console.error('Błąd podczas usuwania użytkownika:', error);
      alert('Nie udało się usunąć użytkownika');
    }
  };

  const handleReturnLoan = async (loanId: number) => {
    if (!confirm('Oznaczyć to wypożyczenie jako zwrócone?')) return;

    try {
      await api.put(`/loans/${loanId}/return`);
      fetchData();
    } catch (error) {
      console.error('Błąd podczas zwracania wypożyczenia:', error);
      alert('Nie udało się zwrócić wypożyczenia');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'short',
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

  const activeLoans = allLoans.filter((loan) => !loan.returnDate);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Panel administratora</h1>
          </div>
          <p className="text-gray-600">Zarządzaj użytkownikami i monitoruj wszystkie wypożyczenia</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 pb-4 px-1 border-b-2 font-medium transition ${
                activeTab === 'users'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="w-4 h-4" />
              Użytkownicy ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('loans')}
              className={`flex items-center gap-2 pb-4 px-1 border-b-2 font-medium transition ${
                activeTab === 'loans'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Wszystkie wypożyczenia ({allLoans.length})
            </button>
          </div>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rola
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aktywne wypożyczenia
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {user.role === 'ADMIN' && <Shield className="w-3 h-3" />}
                        {user.role === 'ADMIN' ? 'Administrator' : 'Użytkownik'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.loans?.length || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      {user.id !== session?.user.id && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="inline-flex items-center gap-1 text-red-600 hover:text-red-900 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                          Usuń
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Loans Tab */}
        {activeTab === 'loans' && (
          <div className="space-y-4">
            {/* Active Loans */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Aktywne wypożyczenia ({activeLoans.length})
              </h3>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Użytkownik
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Książka
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {loan.user?.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="font-medium">{loan.book.title}</div>
                          <div className="text-gray-500">{loan.book.author}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(loan.borrowedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <button
                            onClick={() => handleReturnLoan(loan.id)}
                            className="inline-flex items-center gap-1 text-green-600 hover:text-green-900 transition"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Oznacz jako zwrócone
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* All Loans History */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-8">
                Kompletna historia ({allLoans.length})
              </h3>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Użytkownik
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Książka
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
                    {allLoans.map((loan) => (
                      <tr key={loan.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {loan.user?.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="font-medium">{loan.book.title}</div>
                          <div className="text-gray-500">{loan.book.author}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(loan.borrowedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {loan.returnDate ? (
                            <span className="text-green-600">
                              {formatDate(loan.returnDate)}
                            </span>
                          ) : (
                            <span className="text-orange-600 font-medium">Aktywne</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}