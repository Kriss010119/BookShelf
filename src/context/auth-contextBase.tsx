import type { User } from 'firebase/auth';
import { createContext } from 'react';

export const AuthContext = createContext({
  user: {} as User | null,
  signOut: () => {}
});
