import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { clearSelectedBook, removeBook } from '../../store/slices/librarySlice';
import { removeBookFromFirebase } from '../../firebase/libraryService';
import { useAuth } from '../../hooks/use-auth';
import { AuthContext } from '../../context/auth-context';
import { Link } from 'react-router-dom';
import styles from './Sidebar.module.css';

const Sidebar = () => {
    const dispatch = useDispatch();
    const { email, id: userId } = useAuth();
    const { signOut } = useContext(AuthContext);
    const { selectedBook } = useSelector((state: RootState) => state.library);
    const { avatarImage, username } = useSelector((state: RootState) => state.user);
    const { isAuth } = useAuth();
    const handleSignOut = () => {
        signOut();
        dispatch(clearSelectedBook());
    }

    const handleRemoveBook = () => {
        if(selectedBook && userId) {
            dispatch(removeBook(selectedBook.id));
            removeBookFromFirebase(userId, selectedBook.id, selectedBook.shelfId);
            dispatch(clearSelectedBook());
        }
    }

    const reviewFunk = (text: string, maxLength = 100) => {
        if (!text) {
            return '';
        }
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + '...';
    }

    const renderAvatar = () => {
        if (avatarImage) {
            return <img src={`/img/profile/${avatarImage}`} alt="Profile" className={styles.avatar} />;
        } else {
            return (
                <div className={styles.avatar}>
                    {email?.charAt(0).toUpperCase()}
                </div>
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
                            <Link to="/" className={styles.navLink}>Home</Link>
                            <Link to="/library" className={styles.navLink}>Library</Link>
                            <Link to="/profile" className={styles.navLink}>Profile</Link>
                        </div>
                    ) : (
                        <div className={styles.navLink}>
                            <Link to="/" className={styles.navLink}>Home</Link>
                            <Link to="/login" className={styles.navLink}>Login</Link>
                            <Link to="/register" className={styles.navLink}>Registration</Link>
                        </div>
                    )}
                </nav>

                {selectedBook && (
                    <>
                    <div className={styles.smallScreen}>
                        <h4 className={styles.bookTitle}>{selectedBook.data.title}</h4>
                        <div className={styles.bookActions}>
                            <Link to={`/edit-book/${selectedBook.id}`} className={styles.editLink}>Edit</Link>
                            <button onClick={handleRemoveBook} className={styles.removeButton}>Remove</button>
                        </div>
                    </div>
                    <div className={styles.selectedBookSection}>
                        <h4 className={styles.selectedBookTitle}>Selected Book</h4>
                        <div>
                            <h4 className={styles.bookTitle}>{selectedBook.data.title}</h4>
                            <p className={styles.bookAuthors}>by {selectedBook.data.authors.map((a: any) => a.name).join(', ')}</p>
                            <div>
                                <h5 className={styles.reviewTitle}>Your Review:</h5>
                                {selectedBook.data.review ? (
                                    <p className={styles.reviewText}>{reviewFunk(selectedBook.data.review)}</p>
                                ) : (
                                    <p className={styles.reviewText}>You haven't written anything yet :(</p>
                                )}
                            </div>
                            {selectedBook.data.readLink && (
                                <a
                                    href={selectedBook.data.readLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.readLink}
                                >
                                    Read Online
                                </a>
                            )}

                            <div className={styles.bookActions}>
                                <Link to={`/edit-book/${selectedBook.id}`} className={styles.editLink}>Edit</Link>
                                <button onClick={handleRemoveBook} className={styles.removeButton}>Remove</button>
                            </div>
                        </div>
                    </div>
                    </>
                )}
            </div>

            <div>
                <button onClick={handleSignOut} className={styles.signOutButton}>
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default Sidebar;