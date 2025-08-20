import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { addBook, addShelf } from '../../store/slices/librarySlice';
import { addBookToFirebase, addShelfToFirebase } from '../../firebase/libraryService';
import { searchBook } from '../../hooks/searchBook';
import type { BookDataType, ShelfType } from '../../types/types';
import styles from './CreateBook.module.css';

const CreateBook: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { id: userId } = useSelector((state: RootState) => state.user);
  const { shelves } = useSelector((state: RootState) => state.library);
  const queryParams = new URLSearchParams(location.search);
  const shelfId = queryParams.get('shelfId') || '';
  const [selectedShelf, setSelectedShelf] = useState<ShelfType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BookDataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!shelfId) {
      setErrors({ shelf: 'Shelf ID is missing' });
      return;
    }
    const shelf = shelves.find((s) => s.id === shelfId);
    if (shelf) {
      setSelectedShelf(shelf);
    } else if (userId) {
      const newShelfId = shelfId || `shelf_${Date.now()}`;
      const newShelf: ShelfType = {
        id: newShelfId,
        title: 'New Shelf',
        bookIds: []
      };
      dispatch(addShelf(newShelf));
      addShelfToFirebase(userId, newShelf)
        .then(() => setSelectedShelf(newShelf))
        .catch((error) => {
          console.error('Failed to create shelf:', error);
          setErrors({ shelf: 'Failed to create shelf' });
        });
    }
  }, [shelfId, shelves, userId, dispatch]);

  const handleSearch = async () => {
    setSearchResults([]);
    if (!searchQuery.trim()) {
      setErrors({ search: 'Please enter a search query' });
      return;
    }
    setLoading(true);
    setErrors({});
    try {
      const result = await searchBook(searchQuery);
      if (result && result.results && result.results.length > 0) {
        const limitedResults = result.results.slice(0, 50);
        setSearchResults(limitedResults);
      } else {
        setSearchResults([]);
        setErrors({ search: 'No books found' });
      }
    } catch (error) {
      console.error('Search failed:', error);
      setErrors({ search: 'Failed to search books' });
    } finally {
      setSearchQuery('');
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleBookSelect = async (book: BookDataType) => {
    if (!selectedShelf) {
      setErrors({ shelf: 'Shelf is being created, please wait...' });
      return;
    }

    if (!book.title?.trim()) {
      setErrors({ title: 'Book title is required' });
      return;
    }

    if (!book.authors || book.authors.length === 0) {
      setErrors({ authors: 'Book author is required' });
      return;
    }

    const newBook = {
      id: `book_${Date.now()}`,
      data: {
        ...book,
        review: '',
        readLink: ''
      },
      shelfId: selectedShelf.id
    };

    try {
      dispatch(addBook(newBook));
      if (userId) {
        await addBookToFirebase(userId, newBook);
      }
      navigate('/library');
    } catch (error) {
      console.error('Failed to add book:', error);
      setErrors({ general: 'Failed to add book to library' });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Add New Book</h1>
      <div className={styles.searchContainer}>
        <div className={styles.searchInput}>
          <input
            type="text"
            className={styles.input}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setErrors((prev) => ({ ...prev, search: '' }));
            }}
            onKeyPress={handleKeyPress}
            placeholder="Search book by title, author or ISBN"
          />
          <button className={styles.searchButton} onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        {errors.search && <p className={styles.error}>{errors.search}</p>}
        {errors.shelf && <p className={styles.error}>{errors.shelf}</p>}
        {errors.general && <p className={styles.error}>{errors.general}</p>}

        {searchResults.length > 0 && (
          <div className={styles.searchResults}>
            <h3 className={styles.resultsTitle}>Found {searchResults.length} Books</h3>
            <p className={styles.resultsHint}>Click on any book to add it to your collection</p>
            <div className={styles.resultsGrid}>
              {searchResults.map((book, index) => (
                <div
                  className={styles.bookResult}
                  key={book.id || `${book.title}-${index}`}
                  onClick={() => handleBookSelect(book)}>
                  {book.formats && book.formats['image/jpeg'] ? (
                    <img
                      src={book.formats['image/jpeg']}
                      alt={book.title}
                      className={styles.bookCover}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : null}
                  <div
                    className={styles.bookInitial}
                    style={{ display: book.formats?.['image/jpeg'] ? 'none' : 'flex' }}>
                    {book.title?.charAt(0) || 'B'}
                  </div>
                  <div className={styles.bookInfoOverlay}>
                    <h4 className={styles.bookTitle}>{book.title}</h4>
                    <p className={styles.bookAuthors}>
                      by{' '}
                      {book.authors?.map((a: { name: string }) => a.name).join(', ') || 'Unknown'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {searchResults.length <= 0 && !loading && (
          <button
            className={styles.manualModeButton}
            onClick={() => navigate(`/create-book/manual?shelfId=${shelfId}`)}>
            Enter Book manually
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateBook;
