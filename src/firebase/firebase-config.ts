import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  type NextOrObserver,
  type User
} from 'firebase/auth';
import { getFirebaseConfig } from './firebase';
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';

const app = initializeApp(getFirebaseConfig());

export const db = getFirestore(app);
export const auth = getAuth(app);

export const registerUser = async (email: string, password: string) => {
  if (!email && !password) {
    return;
  }
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const SingInUser = async (email: string, password: string) => {
  if (!email || !password) {
    return;
  }
  return await signInWithEmailAndPassword(auth, email, password);
};

export const SignOutUser = async () => await signOut(auth);

export const userStateListener = (callback: NextOrObserver<User>) => {
  return onAuthStateChanged(auth, callback);
};

export const getUserProfile = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw new Error('Permission denied or network error');
  }
};

export const updateUserProfile = async (
  userId: string,
  profileData: { username: string; avatarType: string; avatarImage: string; isPublic: boolean },
  oldUsername?: string | null
) => {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, profileData, { merge: true });
  if (profileData.username) {
    const usernameRef = doc(db, 'usernames', profileData.username);
    await setDoc(usernameRef, { userId });
  }
  if (oldUsername && oldUsername !== profileData.username) {
    const oldUsernameRef = doc(db, 'usernames', oldUsername);
    await deleteDoc(oldUsernameRef);
  }
};

export const checkUsernameExists = async (username: string) => {
  if (!username) return false;
  try {
    const usernamesRef = doc(db, 'usernames', username);
    const docSnap = await getDoc(usernamesRef);
    return docSnap.exists();
  } catch (error) {
    console.error('Error checking username:', error);
    return true;
  }
};
