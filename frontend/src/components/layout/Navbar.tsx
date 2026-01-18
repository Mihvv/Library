'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Library, BookOpen, Shield, LogOut, LogIn, UserPlus } from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-amber-700 transition">
            <Library className="w-6 h-6" />
            Biblioteka
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link
                  href="/loans"
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition"
                >
                  <BookOpen className="w-4 h-4" />
                  Moje wypożyczenia
                </Link>

                {session.user.role === 'ADMIN' && (
                  <Link
                    href="/users"
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition"
                  >
                    <Shield className="w-4 h-4" />
                    Panel administratora
                  </Link>
                )}

                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                  <div className="text-sm">
                    <div className="text-gray-900 font-medium">
                      {session.user.email}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {session.user.role === 'ADMIN' ? 'Administrator' : 'Użytkownik'}
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Wyloguj
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition"
                >
                  <LogIn className="w-4 h-4" />
                  Zaloguj się
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Zarejestruj się</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}