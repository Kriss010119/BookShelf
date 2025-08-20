import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { clearSelectedBook } from '../../store/slices/librarySlice';
import { useAuth } from '../../hooks/use-auth';
import { AuthContext } from '../../context/auth-contextBase';
import { Link } from 'react-router-dom';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { email } = useAuth();
  const { signOut } = useContext(AuthContext);
  const { avatarImage, username } = useSelector((state: RootState) => state.user);
  const { isAuth } = useAuth();
  const handleSignOut = () => {
    signOut();
    dispatch(clearSelectedBook());
  };

  const renderAvatar = () => {
    if (avatarImage) {
      return (
        <a href={'/profile'} className={styles.link}>
          <img src={`/img/profile/${avatarImage}`} alt="Profile" className={styles.avatar} />
        </a>
      );
    } else {
      return (
        <a href={'/profile'}>
          <div className={styles.avatar}>{email?.charAt(0).toUpperCase()}</div>
        </a>
      );
    }
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.nav}>
        <div className={styles.profileSection}>
          {renderAvatar()}
          <div className={styles.userInfo}>
            <p className={styles.username}>{username}</p>
            <p className={styles.email}>{email}</p>
          </div>
        </div>

        <nav className={styles.navSection}>
          <h4 className={styles.navTitle}>NAVIGATION</h4>
          {isAuth ? (
            <div className={styles.navLink}>
              <Link to="/" className={styles.navLink}>
                Home
              </Link>
              <Link to="/library" className={styles.navLink}>
                Library
              </Link>
              <Link to="/profile" className={styles.navLink}>
                Profile
              </Link>
            </div>
          ) : (
            <div className={styles.navLink}>
              <Link to="/" className={styles.navLink}>
                Home
              </Link>
              <Link to="/login" className={styles.navLink}>
                Login
              </Link>
              <Link to="/register" className={styles.navLink}>
                Registration
              </Link>
            </div>
          )}
        </nav>
      </div>

      <div>
        {isAuth && (
          <button onClick={handleSignOut} className={styles.signOutButton}>
            Sign Out
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
