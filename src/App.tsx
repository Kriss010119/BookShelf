import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/use-auth';
import { initAuth } from './context/auth-listener';
import { useDispatch } from 'react-redux';
import Home from './pages/Home/Home.tsx';
import Login from './pages/Login/Login.tsx';
import Profile from './pages/Profile/Profile';
import Register from './pages/Register/Register.tsx';
import Header from './components/Header/Header';
import Library from './pages/Library/Library.tsx';
import EditBook from './pages/EditBook/EditBook';
import styles from './App.module.css';
import Sidebar from './components/Sidebar/Sidebar.tsx';
import CreateBook from './pages/CreateBook/CreateBook.tsx';
import PublicLibrary from './pages/PublicLibrary/PublicLibrary.tsx';

function App() {
  const { isAuth } = useAuth();
  const { isLoading } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = initAuth(dispatch);
    return () => unsubscribe();
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.parent}>
      <div className={styles.header}>
        <Header />
      </div>
      <div className={styles.content}>
        <Routes>
          {isAuth ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/library" element={<Library />} />
              <Route path="/create-book" element={<CreateBook />} />
              <Route path="/edit-book/:bookId" element={<EditBook />} />
              <Route path="*" element={<Navigate to="/" replace />} />
              <Route path="/public-library/:userId" element={<PublicLibrary />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
              <Route path="/public-library/:userId" element={<PublicLibrary />} />
            </>
          )}
        </Routes>
      </div>
      <div className={styles.nav}>
        <Sidebar />
      </div>
    </div>
  );
}

export default App;
