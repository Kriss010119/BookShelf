import styles from './Header.module.css';


const Header = () => {
    return (
        <div className={styles.header}>
            <img src="/logo.svg" alt="logo"/>
            <h1>BookShelf</h1>
        </div>
    )
}

export default Header;