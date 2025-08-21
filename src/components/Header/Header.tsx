import { Link } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  return (
    <div className={styles.header}>
      <Link to="/" className={styles.link}>
        <span className={styles.linkElements}>
          <img src="/logo.svg" alt="logo" />
          <h1>BookShelf</h1>
        </span>
      </Link>
    </div>
  );
};

export default Header;