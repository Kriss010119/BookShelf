import styles from './Loading.module.css';

type Props = {
  loadingText: string;
};

export const Loading = (info: Props) => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingContent}>
        <div className={styles.bookIcon}>
          <img src={'/img/icon/book.svg'} alt="book icon" />
        </div>
        <p className={styles.loadingText}>{info.loadingText}</p>
      </div>
    </div>
  );
};
