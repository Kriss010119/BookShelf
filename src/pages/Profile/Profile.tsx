import { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { updateProfile } from '../../store/slices/userSlice';
import { updateUserProfile, checkUsernameExists } from '../../firebase/firebase-config';
import AvatarSelector from '../../components/AvatarSelector/AvatarSelector';
import { AuthContext } from '../../context/auth-contextBase.tsx';
import styles from './Profile.module.css';

function Profile() {
  const dispatch = useDispatch();
  const { signOut } = useContext(AuthContext);
  const {
    id: userId,
    email,
    username,
    avatarType,
    avatarImage,
    avatarColor,
    isPublic
  } = useSelector((state: RootState) => state.user);
  const [editMode, setEditMode] = useState(false);
  const [newUsername, setNewUsername] = useState(username || '');
  const [avatarData, setAvatarData] = useState({
    type: avatarType,
    image: avatarImage
  });
  const [profileVisibility, setProfileVisibility] = useState(isPublic);
  const [usernameError, setUsernameError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (username) {
      setNewUsername(username);
    }
    setAvatarData({
      type: avatarType,
      image: avatarImage
    });
    setProfileVisibility(isPublic);
  }, [username, avatarType, avatarImage, avatarColor, isPublic]);

  const handleSaveProfile = async () => {
    if (!userId) return;

    setIsSaving(true);
    setUsernameError('');

    try {
      if (newUsername !== username) {
        const usernameExists = await checkUsernameExists(newUsername);
        if (usernameExists) {
          setUsernameError('This username is already taken');
          return;
        }
      }

      const profileData = {
        username: newUsername,
        avatarType: avatarData.type || 'letter',
        avatarImage: avatarData.image || 'default-avatar.jpg',
        isPublic: profileVisibility
      };

      await updateUserProfile(userId, profileData, username || '');

      dispatch(updateProfile(profileData));
      setEditMode(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarSelect = (type: 'image' | 'color' | 'letter', value: string | null) => {
    setAvatarData((prev) => {
      return { ...prev, type, image: value };
    });
  };

  const renderAvatar = () => {
    return (
      <img src={`/img/profile/${avatarData.image}`} alt="Profile" className={styles.avatarImage} />
    );
  };

  return (
    <div className={styles.profileContainer}>
      <h2 className={styles.profileTitle}>Your Profile</h2>
      <div className={styles.avatarContainer}>{renderAvatar()}</div>

      {editMode ? (
        <div className={styles.editForm}>
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.formLabel}>
              Username
            </label>
            <input
              type="text"
              name="username"
              value={newUsername}
              onChange={(e) => {
                setNewUsername(e.target.value);
                setUsernameError('');
              }}
              className={styles.formInput}
            />
            {usernameError && <p className={styles.errorText}>{usernameError}</p>}
          </div>
          <AvatarSelector avatarImage={avatarData.image} onSelect={handleAvatarSelect} />
          <div className={styles.formGroup}>
            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                id="profileVisibility"
                checked={profileVisibility}
                onChange={(e) => setProfileVisibility(e.target.checked)}
              />
              <label htmlFor="profileVisibility" className={styles.checkboxLabel}>
                Public Profile
              </label>
            </div>
            <p className={styles.visibilityDescription}>
              {profileVisibility
                ? 'Others can find you by your username'
                : 'Your profile is private'}
            </p>
          </div>
          <div className={styles.buttonGroup}>
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className={`${styles.actionButton} ${styles.primaryButton}`}>
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
            <button
              onClick={() => setEditMode(false)}
              className={`${styles.actionButton} ${styles.secondaryButton}`}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.profileInfo}>
          <h3 className={styles.profileWelcome}>Welcome, {username || email}</h3>
          <p className={styles.profileDetail}>
            <strong>Username:</strong> {username || 'Not set'}
          </p>
          <p className={styles.profileDetail}>
            <strong>Profile Visibility:</strong> {isPublic ? 'Public' : 'Private'}
          </p>

          <div className={styles.buttonGroup}>
            <button
              onClick={() => setEditMode(true)}
              className={`${styles.actionButton} ${styles.primaryButton}`}>
              Edit Profile
            </button>
            <button
              onClick={signOut}
              className={`${styles.actionButton} ${styles.secondaryButton}`}>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
