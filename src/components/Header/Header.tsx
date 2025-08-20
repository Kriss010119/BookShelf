import styles from './Header.module.css';

const Header = () => {
  return (
    <div className={styles.header}>
      <a href={'/'} className={styles.link}>
        <span className={styles.linkElements}>
          <img src="/logo.svg" alt="logo" />
          <h1>BookShelf</h1>
        </span>
      </a>
    </div>
  );
};

export default Header;
