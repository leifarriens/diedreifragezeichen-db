// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth';

type User = {
  name: string;
  email: string;
  image: string | null;
  id: string;
  role: 'User' | 'Admin';
} & DefaultSession['user']; // resolves type error [...nextauth].ts:47

declare module 'next-auth' {
  interface Session {
    user: User;
  }
}

declare module 'next' {
  interface NextApiRequest {
    session: {
      user: User;
    };
  }
}

export {};
