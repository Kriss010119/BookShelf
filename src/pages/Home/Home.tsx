import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/firebase-config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import styles from './Home.module.css';
import type { ProfileType } from '../../types/types';

type UserType = {
  avatarImage: string;
  avatarType: string;
  isPublic: boolean;
  username: string;
  id: string;
};

const Home = () => {
  const [searchUsername, setSearchUsername] = useState('');
  const [foundUsers, setFoundUsers] = useState<ProfileType[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearchAllUsers = async () => {
    setLoadingAll(true);
    setError('');
    setFoundUsers([]);
    try {
      const userRef = collection(db, 'users');
      const q = query(userRef, where('isPublic', '==', true));
      const querySnapshot = await getDocs(q);
      const users: UserType[] = [];
      querySnapshot.forEach((doc) => {
        users.push({
          avatarImage: '',
          avatarType: '',
          isPublic: false,
          username: '',
          id: doc.id,
          ...doc.data()
        });
      });
      if (users.length === 0) {
        setError('No public users found with this username');
      } else {
        setFoundUsers(users);
      }
    } catch (err) {
      console.error('Error searching users:', err);
      setError('Failed to search users. Please try again later.');
    } finally {
      setLoadingAll(false);
    }
  };

  const handleSearchUser = async () => {
    if (!searchUsername.trim()) {
      setError('Please enter a username');
      return;
    }
    setLoading(true);
    setError('');
    setFoundUsers([]);

    try {
      const userRef = collection(db, 'users');
      const q = query(
        userRef,
        where('username', '==', searchUsername),
        where('isPublic', '==', true)
      );
      const querySnapshot = await getDocs(q);
      const users: UserType[] = [];
      querySnapshot.forEach((doc) => {
        users.push({
          avatarImage: '',
          avatarType: '',
          isPublic: false,
          username: '',
          id: doc.id,
          ...doc.data()
        });
      });

      if (users.length === 0) {
        setError('No public users found with this username');
      } else {
        setFoundUsers(users);
      }
    } catch (err) {
      console.error('Error searching users:', err);
      setError('Failed to search users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewLibrary = (userId: string) => {
    navigate(`/public-library/${userId}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchUser();
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to BookShelf</h1>
      <p className={styles.subtitle}>
        Your new beautiful app for saving your library and reading books
      </p>

      <div className={styles.searchSection}>
        <h2 className={styles.sectionTitle}>Find user</h2>
        <input
          type="text"
          value={searchUsername}
          onChange={(e) => setSearchUsername(e.target.value)}
          placeholder="Search by exact public username"
          onKeyPress={handleKeyPress}
          className={styles.searchInput}
        />
        <button onClick={handleSearchUser} disabled={loading} className={styles.searchButton}>
          {loading ? 'Searching...' : 'Search'}
        </button>
        <button
          onClick={handleSearchAllUsers}
          disabled={loadingAll}
          className={styles.searchButton}>
          {loadingAll ? 'Searching...' : 'All Public Users'}
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </div>

      {foundUsers.length > 0 && (
        <div className={styles.usersList}>
          <h3 className={styles.sectionTitle}>Found public users:</h3>
          <div>
            {foundUsers.map((user, index) => (
              <div className={styles.userCard} key={index}>
                <div className={styles.userInf}>
                  <img
                    src={`/img/profile/${user.avatarImage}`}
                    alt="Profile"
                    className={styles.avatarImage}
                    onClick={() => handleViewLibrary(user.id)}
                  />
                  <p className={styles.userName}>{user.username}</p>
                </div>
                <button onClick={() => handleViewLibrary(user.id)} className={styles.viewButton}>
                  View Library
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
