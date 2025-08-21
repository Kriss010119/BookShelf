import type { BookDataType } from '../../types/types';
import { useDispatch } from 'react-redux';
import { selectBook } from '../../store/slices/librarySlice';
import styles from './Book.module.css';
import React, { useState } from 'react';
import Modal from '../Modal/Modal.tsx';
import { Link, useNavigate } from 'react-router-dom';

type BookProps = {
  isPublic: boolean;
  book: BookDataType;
  bookId: string;
  onRemove?: () => void;
};

const Book = ({ book, bookId, onRemove, isPublic = false }: BookProps) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleBookClick = () => {
    dispatch(selectBook(bookId));
    navigate(`/book/${bookId}`, { state: { from: window.location.pathname } });
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowModal(true);
  };

  const confirmRemove = () => {
    if (onRemove) {
      setLoadingDelete(true);
      onRemove();
    }
    setLoadingDelete(false);
    setShowModal(false);
  };

  const cancelRemove = () => {
    setShowModal(false);
  };

  const coverImage = book.formats['image/jpeg'];
  const isColorCover = coverImage?.startsWith('#');
  const isImageCover = coverImage?.startsWith('http');

  return (
    <>
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
          <button className={styles.removeButton} onClick={handleRemoveClick}>
            <img className={styles.svg} src="/img/icon/delete.svg" alt="Delete" />
          </button>
        )}
        {!isPublic && (
          <Link to={`/edit-book/${bookId}`} className={styles.editLink}>
            <img className={styles.svg} src="/img/icon/edit.svg" alt="Edit" />
          </Link>
        )}
        {!isPublic && book.readLink && (
          <a
            href={book.readLink}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.readLink}>
            <img className={styles.svg} src="/img/icon/read.svg" alt="Read link" />
          </a>
        )}
      </div>
      <Modal isOpen={showModal} title="Deletion confirmation" onClose={cancelRemove}>
        <div className={styles.modalContent}>
          <p>Do you want to delete book "{book.title}"?</p>
          <div className={styles.modalButtons}>
            <button className={styles.cancelButton} onClick={cancelRemove}>
              Cancel
            </button>
            <button className={styles.confirmButton} onClick={confirmRemove}>
              {loadingDelete ? 'Deleting' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Book;
