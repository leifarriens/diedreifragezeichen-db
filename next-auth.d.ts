// eslint-disable-next-line @typescript-eslint/no-unused-vars
import 'next-auth';

import { DefaultUser } from 'next-auth';

import type { Role } from '@/models/user';

declare module 'next-auth' {
  interface User {
    role: Role;
  }

  interface Session {
    user: DefaultUser & {
      role?: Role;
    };
  }
}

export {};
