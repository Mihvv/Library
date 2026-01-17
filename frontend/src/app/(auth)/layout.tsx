import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (session) {
    redirect('/books');
  }

  return <>{children}</>;
}