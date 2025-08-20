import React, { useState } from 'react';
import Book from '../Book/Book';
import type { BookType } from '../../types/types';
import type { BookDataType } from '../../types/types';
import { useNavigate } from 'react-router-dom';
import styles from './Shelf.module.css';
import Modal from '../Modal/Modal.tsx';

interface ShelfProps {
  title: string;
  books: BookType[];
  bookData: Record<string, BookDataType>;
  shelfId: string;
  onRemoveShelf: () => void;
  onRemoveBook: (bookId: string) => void;
  isPublic?: boolean;
  onAddBook?: () => void;
}

const Shelf: React.FC<ShelfProps> = ({
  title,
  books,
  bookData,
  shelfId,
  onRemoveShelf,
  onRemoveBook,
  isPublic = false
}) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowModal(true);
  };

  const confirmRemove = () => {
    if (onRemoveShelf) {
      setLoadingDelete(true);
      onRemoveShelf();
    }
    setLoadingDelete(false);
    setShowModal(false);
  };

  const cancelRemove = () => {
    setShowModal(false);
  };

  return (
    <div className={styles.shelfContainer}>
      <div className={styles.shelfHeader}>
        <div>
          <h2 className={styles.shelfTitle}>{title}</h2>
          <span className={styles.bookCount}>({books.length} books)</span>
        </div>

        {!isPublic && (
          <div className={styles.shelfActions}>
            {!isPublic && (
              <button
                className={`${styles.actionButton} ${styles.addButton}`}
                onClick={() => navigate(`/create-book?shelfId=${shelfId}`)}>
                + Add Book
              </button>
            )}
            {books.length === 0 && !isPublic && (
              <button
                className={`${styles.actionButton} ${styles.removeButton}`}
                onClick={handleRemoveClick}>
                {loadingDelete ? 'Deleting...' : 'Delete shelf'}
              </button>
            )}
          </div>
        )}
      </div>

      <div className={styles.booksContainer}>
        {books.length > 0 ? (
          <div className={styles.booksRow}>
            {books.map((book) => (
              <Book
                isPublic={isPublic}
                key={book.id}
                book={bookData[book.id]}
                bookId={book.id}
                onRemove={() => onRemoveBook(book.id)}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyShelf}>No books on this shelf</div>
        )}
      </div>

      <Modal isOpen={showModal} title="Confirm Deletion" onClose={cancelRemove}>
        <div className={styles.modalContent}>
          <p>Are you sure you want to delete the shelf "{title}"?</p>
          <div className={styles.modalButtons}>
            <button className={styles.cancelButton} onClick={cancelRemove} disabled={loadingDelete}>
              Cancel
            </button>
            <button
              className={styles.confirmButton}
              onClick={confirmRemove}
              disabled={loadingDelete}>
              {loadingDelete ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Shelf;
