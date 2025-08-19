import type { User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { SignOutUser, userStateListener } from '../firebase/firebase-config';
import { type ReactNode, useEffect, useState } from 'react';
import { AuthContext } from './auth-contextBase';

type Props = {
  children?: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    return userStateListener((user) => {
      setUser(user);
    });
  }, []);

  const signOut = () => {
    SignOutUser().then(() => {
      setUser(null);
      navigate('/');
    });
  };

  const value = { user, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
