import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import {
  addShelf,
  removeShelf,
  removeBook,
  setLibrary,
  selectLibraryPath
} from '../../store/slices/librarySlice';
import { useAuth } from '../../hooks/use-auth';
import {
  loadLibraryFromFirebase,
  addShelfToFirebase,
  removeShelfFromFirebase,
  removeBookFromFirebase
} from '../../firebase/libraryService';
import type { ShelfType } from '../../types/types';
import type { BookDataType } from '../../types/types';
import Modal from '../../components/Modal/Modal';
import Shelf from '../../components/Shelf/Shelf';
import { useNavigate } from 'react-router-dom';
import styles from './Library.module.css';
import { Loading } from '../../components/Loading/Loading.tsx';

const initialOwnerInfo = {
  username: '',
  avatarType: '',
  avatarImage: '',
  isPublic: false,
  id: ''
};

const Library = ({ isPublic = false, publicUserId = '' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuth, id: userId } = useAuth();
  const libraryState = useSelector((state: RootState) => state.library);
  const { shelves, books } = isPublic
    ? libraryState.publicLibrary || { shelves: [], books: [] }
    : libraryState;
  const ownerInfo = libraryState.ownerInfo || initialOwnerInfo;
  const [showAddShelfModal, setShowAddShelfModal] = useState(false);
  const [shelfTitle, setShelfTitle] = useState('');
  const [libraryLoading, setLibraryLoading] = useState(true);
  const myImg = ownerInfo?.avatarImage || '';
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    if (!isPublic && isAuth && userId) {
      const loadLibrary = async () => {
        try {
          const library = await loadLibraryFromFirebase(userId);
          if (library.shelves.length === 0) {
            const defaultShelf = createDefaultShelf();
            library.shelves.push(defaultShelf);
            await addShelfToFirebase(userId, defaultShelf);
          }
          dispatch(setLibrary(library));
        } catch (error) {
          console.error('Failed to load library', error);
        } finally {
          setLibraryLoading(false);
        }
      };
      loadLibrary();
    } else {
      setLibraryLoading(false);
    }
    if (isPublic) {
      dispatch(selectLibraryPath({ link: `/public-library/${publicUserId}` }));
    } else {
      dispatch(selectLibraryPath({ link: '/library' }));
    }
  }, [isPublic, publicUserId, dispatch]);

  const createDefaultShelf = (): ShelfType => {
    return {
      id: `shelf_${Date.now()}`,
      title: 'My Bookshelf',
      bookIds: []
    };
  };

  if (libraryLoading) {
    return <Loading loadingText={'Loading library...'} />;
  }

  const handleAddShelf = async () => {
    if (!shelfTitle.trim()) {
      return;
    }
    setCreateLoading(true);
    const newShelf: ShelfType = {
      id: `shelf_${Date.now()}`,
      title: shelfTitle,
      bookIds: []
    };
    dispatch(addShelf(newShelf));
    if (userId) {
      await addShelfToFirebase(userId, newShelf);
    }
    setShowAddShelfModal(false);
    setShelfTitle('');
    setCreateLoading(false);
  };

  const handleRemoveShelf = async (shelfId: string) => {
    dispatch(removeShelf(shelfId));
    if (userId) await removeShelfFromFirebase(userId, shelfId);
  };

  const handleRemoveBook = async (bookId: string, shelfId: string) => {
    dispatch(removeBook(bookId));
    if (userId) await removeBookFromFirebase(userId, bookId, shelfId);
  };

  const bookDataMap = books
    ? books.reduce(
        (acc, book) => {
          acc[book.id] = book.data;
          return acc;
        },
        {} as Record<string, BookDataType>
      )
    : {};

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddShelf();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.imgAndTitle}>
          {isPublic && (
            <img src={`/img/profile/${myImg}`} alt="Profile" className={styles.avatarImage} />
          )}
          <h1 className={styles.title}>
            {isPublic && ownerInfo ? `${ownerInfo.username}'s Library` : 'My Library'}
          </h1>
        </div>
        {!isPublic && (
          <button className={styles.addShelfBtn} onClick={() => setShowAddShelfModal(true)}>
            + Create New Shelf
          </button>
        )}
      </div>
      {!isPublic && (
        <Modal
          isOpen={showAddShelfModal}
          onClose={() => setShowAddShelfModal(false)}
          title="Create New Shelf">
          <div className={styles.modalContent}>
            <input
              type="text"
              value={shelfTitle}
              onKeyDown={handleKeyPress}
              onChange={(e) => setShelfTitle(e.target.value)}
              placeholder="Enter shelf name"
              className={styles.modalInput}
            />
            <div className={styles.modalActions}>
              <button
                onClick={() => setShowAddShelfModal(false)}
                className={`${styles.modalButton} ${styles.modalButtonSecondary}`}>
                Cancel
              </button>
              <button
                onClick={handleAddShelf}
                className={`${styles.modalButton} ${styles.modalButtonPrimary}`}>
                {createLoading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </Modal>
      )}
      <div className={styles.shelvesContainer}>
        {shelves.map((shelf) => (
          <Shelf
            isPublic={isPublic}
            key={shelf.id}
            title={shelf.title}
            books={books.filter((b) => b.shelfId === shelf.id)}
            bookData={bookDataMap}
            shelfId={shelf.id}
            onAddBook={() => {
              if (shelf.id) {
                navigate(`/create-book?shelfId=${shelf.id}`);
              } else {
                console.error('Shelf ID is missing');
              }
            }}
            onRemoveShelf={() => handleRemoveShelf(shelf.id)}
            onRemoveBook={(bookId) => handleRemoveBook(bookId, shelf.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Library;
