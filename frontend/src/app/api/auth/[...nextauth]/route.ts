import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error('Brak danych logowania');
          return null;
        }

        try {
          const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
          const loginUrl = `${apiUrl}/auth/login`;
          
          console.log('Wysyłanie żądania do:', loginUrl);
          console.log('Dane logowania:', { email: credentials.email, password: '***' });

          const response = await axios.post(
            loginUrl,
            {
              email: credentials.email,
              password: credentials.password,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
              timeout: 5000,
            }
          );

          console.log('Odpowiedź z backendu - status:', response.status);
          console.log('Odpowiedź z backendu - data:', response.data);

          if (response.data.token) {
            // Dekoduj token, aby uzyskać dane użytkownika
            const base64Url = response.data.token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
              atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
            );
            const tokenPayload = JSON.parse(jsonPayload);

            console.log('Zdekodowany token:', tokenPayload);

            return {
              id: String(tokenPayload.id),
              email: credentials.email,
              role: tokenPayload.role,
              token: response.data.token,
            };
          }
          
          console.error('Brak tokenu w odpowiedzi');
          return null;
        } catch (error: any) {
          console.error('Błąd podczas logowania:');
          console.error('Status:', error.response?.status);
          console.error('Data:', error.response?.data);
          console.error('Message:', error.message);
          console.error('Code:', error.code);
          
          if (error.code === 'ECONNREFUSED') {
            console.error('Nie można połączyć się z backendem! Sprawdź czy backend działa.');
          }
          
          if (error.response?.data) {
            console.error('Szczegóły błędu z backendu:', JSON.stringify(error.response.data, null, 2));
          }
          
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = Number(user.id);
        token.role = user.role as string;
        token.accessToken = user.token as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as number;
        session.user.role = token.role as string;
        session.user.token = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  debug: true,
});

export { handler as GET, handler as POST };