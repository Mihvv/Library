'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Próba logowania:', email);
      
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      console.log('Wynik logowania:', result);

      if (result?.error) {
        console.error('Błąd logowania:', result.error);
        setError('Nieprawidłowe dane logowania');
      } else if (result?.ok) {
        console.log('Logowanie pomyślne, przekierowanie...');
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      console.error('Wyjątek podczas logowania:', err);
      setError('Wystąpił błąd podczas logowania');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Logowanie</h1>
        
        {registered && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            Rejestracja pomyślna! Możesz się teraz zalogować.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Hasło
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Logowanie...' : 'Zaloguj się'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Nie masz konta?{' '}
          <Link href="/register" className="text-blue-600 hover:underline">
            Zarejestruj się tutaj
          </Link>
        </p>
      </div>
    </div>
  );
}