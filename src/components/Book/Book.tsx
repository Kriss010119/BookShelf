import type { BookDataType } from '../../types/types.ts';
import { useDispatch } from 'react-redux';
import { selectBook } from '../../store/slices/librarySlice';
import styles from './Book.module.css';

type BookProps = {
  isPublic: boolean;
  book: BookDataType;
  bookId: string;
  onRemove?: () => void;
};

const Book = ({ book, bookId, onRemove, isPublic = false }: BookProps) => {
  const dispatch = useDispatch();

  const handleBookClick = () => {
    dispatch(selectBook(bookId));
  };

  const coverImage = book.formats['image/jpeg'];
  const isColorCover = coverImage?.startsWith('#');
  const isImageCover = coverImage?.startsWith('http');

  return (
    <div className={styles.bookContainer} onClick={handleBookClick}>
      <div className={styles.bookCover}>
        {isImageCover ? (
          <img src={coverImage} alt={book.title} className={styles.bookImage} />
        ) : isColorCover ? (
          <div className={styles.bookColorCover} style={{ backgroundColor: coverImage }}>
            <span>{book.title}</span>
            <span>{book.authors.map((a: { name: string }) => a.name).join(', ')}</span>
          </div>
        ) : (
          <div className={styles.bookTextCover}>
            <h3>{book.title}</h3>
            <p>{book.authors.map((a: { name: string }) => a.name).join(', ')}</p>
          </div>
        )}
      </div>

      <div className={styles.bookInfo}>
        <h3 className={styles.bookTitle}>{book.title}</h3>
        <p className={styles.bookAuthors}>
          {book.authors.map((a: { name: string }) => a.name).join(', ')}
        </p>
      </div>

      {!isPublic && onRemove && (
        <button
          className={styles.removeButton}
          onClick={(e) => {
            e.stopPropagation();
            if (onRemove) {
              onRemove();
            }
          }}>
          &times;
        </button>
      )}
    </div>
  );
};

export default Book;
