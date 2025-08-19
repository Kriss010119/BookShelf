import { updateUserProfile, userStateListener } from '../firebase/firebase-config';
import type { AppDispatch } from '../store/store';
import { setUser, removeUser, setLoading } from '../store/slices/userSlice';
import { getUserProfile } from '../firebase/firebase-config';
import { loadLibraryFromFirebase } from '../firebase/libraryService.ts';
import { setLibrary } from '../store/slices/librarySlice.ts';

export const initAuth = (dispatch: AppDispatch) => {
  dispatch(setLoading());

  return userStateListener(async (user) => {
    if (user) {
      try {
        let profile = await getUserProfile(user.uid);

        if (!profile) {
          await updateUserProfile(
            user.uid,
            {
              username: null,
              avatarType: 'letter',
              avatarImage: null,
              isPublic: false
            },
            null
          );
          await loadLibraryFromFirebase(user.uid);
          profile = await getUserProfile(user.uid);
        }
        const library = await loadLibraryFromFirebase(user.uid);
        dispatch(
          setUser({
            token: user.refreshToken,
            id: user.uid,
            email: user.email,
            username: profile?.username || null,
            avatarType: profile?.avatarType || 'letter',
            avatarImage: profile?.avatarImage || null,
            avatarColor: profile?.avatarColor || 'rgba(40,74,18,0.5)',
            isPublic: profile?.isPublic || false
          })
        );
        dispatch(setLibrary(library));
      } catch (error) {
        console.error('Failed to load user:', error);
        dispatch(removeUser());
      }
    } else {
      dispatch(removeUser());
    }
  });
};
