import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      role: string;
      token: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    id: string;
    role: string;
    token: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: number;
    role: string;
    accessToken: string;
  }
}