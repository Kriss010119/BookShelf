import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { updateBook } from '../../store/slices/librarySlice';
import { updateBookInFirebase } from '../../firebase/libraryService';
import type { BookDataType } from '../../types/types';
import styles from '../CreateBook/CreateBook.module.css';

const EditBook = () => {
  const navigate = useNavigate();
  const { bookId } = useParams<{ bookId: string }>();
  const dispatch = useDispatch();
  const { books } = useSelector((state: RootState) => state.library);
  const { shelves } = useSelector((state: RootState) => state.library);
  const { id: userId } = useSelector((state: RootState) => state.user);
  const currentBook = books.find((book) => book.id === bookId);
  const [bookData, setBookData] = useState<BookDataType | null>(null);
  const [coverOption, setCoverOption] = useState<'url' | 'color' | 'none'>('url');
  const [customCover, setCustomCover] = useState('');
  const [selectedColor, setSelectedColor] = useState('rgba(104,0,255,0.73)');
  const [review, setReview] = useState('');
  const [readLink, setReadLink] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (currentBook) {
      setBookData(currentBook.data);
      setReview(currentBook.data.review || '');
      setReadLink(currentBook.data.readLink || '');
      if (currentBook.data.formats?.['image/jpeg']?.startsWith('#')) {
        setCoverOption('color');
        setSelectedColor(currentBook.data.formats['image/jpeg']);
      } else if (currentBook.data.formats?.['image/jpeg']) {
        setCoverOption('url');
        setCustomCover(currentBook.data.formats['image/jpeg']);
      } else {
        setCoverOption('none');
      }
    }
  }, [currentBook]);

  const handleSaveBook = () => {
    const newErrors: Record<string, string> = {};
    if (!bookData?.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!bookData?.authors || bookData.authors.length === 0) {
      newErrors.authors = 'At least one author is required';
    }
    if (coverOption === 'url' && customCover && !isValidUrl(customCover)) {
      newErrors.coverUrl = 'Invalid URL format';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    if (!bookData || !bookId) {
      return;
    }
    const finalBookData: BookDataType = {
      ...bookData,
      formats: {
        ...bookData.formats,
        'image/jpeg':
          coverOption === 'url' ? customCover : coverOption === 'color' ? selectedColor : undefined
      },
      review,
      readLink
    };

    const updatedBook = {
      id: bookId,
      data: finalBookData,
      shelfId: currentBook?.shelfId || ''
    };

    dispatch(updateBook(updatedBook));
    if (userId) updateBookInFirebase(userId, updatedBook);
    navigate('/library');
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookData((prev) => ({
      ...(prev as BookDataType),
      title: e.target.value
    }));
    setErrors((prev) => ({ ...prev, title: '' }));
  };

  const handleAuthorsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const authors = e.target.value
      .split(',')
      .map((name) => ({ name: name.trim() }))
      .filter((author) => author.name);

    setBookData((prev) => ({
      ...(prev as BookDataType),
      authors
    }));
    setErrors((prev) => ({ ...prev, authors: '' }));
  };

  if (!currentBook || !bookData) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Edit Book</h1>
        <p>Loading book data...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Edit Book</h1>

      <div>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Book Information</h2>

          <div className={styles.formGroup}>
            <label className={styles.label}>Title *</label>
            <input
              type="text"
              className={styles.input}
              value={bookData?.title || ''}
              onChange={handleTitleChange}
            />
            {errors.title && <p className={styles.error}>{errors.title}</p>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Authors (comma separated) *</label>
            <input
              type="text"
              className={styles.input}
              value={bookData?.authors?.map((a) => a.name).join(', ') || ''}
              onChange={handleAuthorsChange}
              placeholder="e.g., J.K. Rowling, Stephen King"
            />
            {errors.authors && <p className={styles.error}>{errors.authors}</p>}
          </div>
        </div>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Your Review & Emotions</h2>

          <div className={styles.formGroup}>
            <label className={styles.label}>Your Personal Review</label>
            <textarea
              className={styles.textarea}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your thoughts, feelings, and impressions about this book..."
            />
            <p className={styles.hint}>What did you like or dislike? How did it make you feel?</p>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Reading Link</label>
            <input
              type="text"
              className={styles.input}
              value={readLink}
              onChange={(e) => setReadLink(e.target.value)}
              placeholder="https://example.com/read-book"
            />
            {errors.readLink && <p className={styles.error}>{errors.readLink}</p>}
            <p className={styles.hint}>Where can you read this book online? (optional)</p>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.formGroup}>
            <h3 className={styles.sectionTitle}>Cover Options</h3>

            <div className={styles.coverButtons}>
              <button
                className={`${styles.coverButton} ${coverOption === 'url' ? styles.coverButtonActive : ''}`}
                onClick={() => setCoverOption('url')}>
                Image URL
              </button>
              <button
                className={`${styles.coverButton} ${coverOption === 'color' ? styles.coverButtonActive : ''}`}
                onClick={() => setCoverOption('color')}>
                Color
              </button>
              <button
                className={`${styles.coverButton} ${coverOption === 'none' ? styles.coverButtonActive : ''}`}
                onClick={() => setCoverOption('none')}>
                None
              </button>
            </div>

            {coverOption === 'url' && (
              <div>
                <label className={styles.label}>Cover Image URL</label>
                <input
                  type="text"
                  className={styles.input}
                  value={customCover}
                  onChange={(e) => {
                    setCustomCover(e.target.value);
                    setErrors((prev) => ({ ...prev, coverUrl: '' }));
                  }}
                  placeholder="https://example.com/cover.jpg"
                />
                {errors.coverUrl && <p className={styles.error}>{errors.coverUrl}</p>}
                {customCover && isValidUrl(customCover) && (
                  <div className={styles.coverPreview}>
                    <img
                      src={customCover}
                      alt="Preview"
                      className={styles.coverImage}
                      onError={(e) => {
                        e.currentTarget.src = '';
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {coverOption === 'color' && (
              <div>
                <label className={styles.label}>Select Cover Color</label>
                <div className={styles.coverPreview}>
                  <input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                  />
                  <div className={styles.colorPreview} style={{ backgroundColor: selectedColor }} />
                </div>
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Current Shelf</label>
            <div className={styles.shelfInfo}>
              {currentBook.shelfId ? (
                <div>
                  <strong>{shelves.find((s) => s.id === currentBook.shelfId)?.title}</strong>
                </div>
              ) : (
                <p>No shelf assigned</p>
              )}
            </div>
          </div>

          <div className={styles.actionButtons}>
            <button
              className={`${styles.button} ${styles.secondaryButton}`}
              onClick={() => navigate('/library')}>
              Cancel
            </button>
            <button className={`${styles.button} ${styles.primaryButton}`} onClick={handleSaveBook}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBook;
