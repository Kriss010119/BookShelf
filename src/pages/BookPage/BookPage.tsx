import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { Loading } from '../../components/Loading/Loading.tsx';
import { useNavigate } from 'react-router-dom';
import styles from './BookPage.module.css';

const BookPage = () => {
  const selectedBook = useSelector((state: RootState) => state.library.selectedBook);
  const link = useSelector((state: RootState) => state.library.libraryLink);
  useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedBook) {
      setLoading(false);
    }
  }, [selectedBook]);

  if (loading) {
    return <Loading loadingText={'Loading book information...'} />;
  }

  const onBackPageClick = () => {
    navigate(link);
  };

  if (!selectedBook) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h2>Book not found :( </h2>
          <button onClick={onBackPageClick} className={styles.backLink}>
            <img src={'/img/icon/back.svg'} className={styles.icon} alt={'Back'} />
            Back to {link === '/library' ? 'my Library' : `public Library`}
          </button>
        </div>
      </div>
    );
  }

  const { data } = selectedBook;
  const coverImage = data.formats?.['image/jpeg'];
  const isColorCover = coverImage?.startsWith('#');
  const isImageCover = coverImage?.startsWith('http');

  return (
    <div className={styles.container}>
      <button onClick={onBackPageClick} className={styles.backLink}>
        <img src={'/img/icon/back.svg'} className={styles.icon} alt={'Back'} />
        Back to {link === '/library' ? 'my Library' : `public Library`}
      </button>

      <div className={styles.book}>
        <div className={styles.bookCover}>
          {isImageCover ? (
            <img
              src={coverImage}
              alt={data.title}
              className={styles.coverImage}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : isColorCover ? (
            <div className={styles.colorCover} style={{ backgroundColor: coverImage }}>
              <div className={styles.colorCoverContent}>
                <h2>{data.title}</h2>
                <p>{data.authors.map((a: { name: string }) => a.name).join(', ')}</p>
              </div>
            </div>
          ) : (
            <div className={styles.textCover}>
              <h2>{data.title}</h2>
              <p>{data.authors.map((a: { name: string }) => a.name).join(', ')}</p>
            </div>
          )}
        </div>

        <div className={styles.bookInfo}>
          <div className={styles.info}>
            <div className={styles.mainInfo}>
              <h2 className={styles.title}>{data.title}</h2>
              <p className={styles.authors}>
                by {data.authors.map((a: { name: string }) => a.name).join(', ')}
              </p>
            </div>
            <div className={styles.link}>
              {data.readLink && (
                <a
                  href={data.readLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.readButton}>
                  <img src={'/img/icon/read.svg'} alt="Read icon" className={styles.icon} />
                  Read Book Online
                </a>
              )}
            </div>
          </div>
          <div className={styles.review}>
            {data.review ? (
              <>
                <h3>Personal Review</h3>
                <p className={styles.reviewText}>{data.review}</p>
              </>
            ) : (
              <p className={styles.noReview}>No review yet :( </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookPage;
