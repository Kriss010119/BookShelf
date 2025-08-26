import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Book from '../../components/Book/Book';
import type { BookType, BookDataType } from '../../types/types';
import styles from './ShelfPage.module.css';
import { removeBook } from '../../store/slices/librarySlice.ts';
import { removeBookFromFirebase } from '../../firebase/libraryService.ts';
import { useAuth } from '../../hooks/use-auth.ts';
import type { RootState } from '../../store/store.tsx';

type ShelfPageState = {
  title: string;
  books: Array<BookType & { bookData: BookDataType }>;
  isPublic: boolean;
}

const ShelfPage: React.FC = () => {
  const dispatch = useDispatch();
  const { shelfId } = useParams<{ shelfId: string }>();
  const location = useLocation();
  const { title, books, isPublic } = location.state as ShelfPageState;
  const { id: userId } = useAuth();
  const navigate = useNavigate();
  const link = useSelector((state: RootState) => state.library.libraryLink);

  const handleRemoveBook = async (bookId: string) => {
    if (shelfId) {
      dispatch(removeBook(bookId));
      if (userId) await removeBookFromFirebase(userId, bookId, shelfId);
    }
  };

  const onBackPageClick = () => {
    navigate(-1);
  };

  return (
    <div className={styles.shelfPage}>
      <button onClick={onBackPageClick} className={styles.backLink}>
        <img src={'/img/icon/back.svg'} className={styles.icon} alt={'Back'} />
        Back to {link === '/library' ? 'my Library' : `public Library`}
      </button>

      <div className={styles.header}>
        <h1 className={styles.pageTitle}>{title}</h1>
        <span className={styles.bookCount}>({books.length} books)</span>
      </div>

      <div className={styles.booksGrid}>
        {books.map((book) => (
          <Book
            key={book.id}
            book={book.bookData}
            bookId={book.id}
            isPublic={isPublic}
            onRemove={() => handleRemoveBook(book.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ShelfPage;