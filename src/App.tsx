import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/use-auth';
import { initAuth } from './context/auth-listener';
import { useDispatch } from 'react-redux';
import Home from './pages/Home/Home.tsx';
import Login from './pages/Login/Login.tsx';
import Profile from './pages/Profile/Profile';
import Register from './pages/Register/Register';
import Header from './components/Header/Header';
import Library from './pages/Library/Library';
import EditBook from './pages/EditBook/EditBook';
import styles from './App.module.css';
import Sidebar from './components/Sidebar/Sidebar';
import CreateBook from './pages/CreateBook/CreateBook';
import PublicLibrary from './pages/PublicLibrary/PublicLibrary';
import { Loading } from './components/Loading/Loading.tsx';
import CreateBookManual from './components/CreateBookManual/CreateBookManual.tsx';
import BookPage from './pages/BookPage/BookPage.tsx';
import { WebVitals } from './components/WebVitals';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://96e07435093683eb4ebc7b7c4ac2105e@o4509884596420608.ingest.us.sentry.io/4509884664446976',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

function App() {
  const { isAuth } = useAuth();
  const { isLoading } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = initAuth(dispatch);
    return () => unsubscribe();
  }, [dispatch]);

  if (isLoading) {
    return <Loading loadingText={'Loading...'} />;
  }

  return (
    <div className={styles.parent}>
      <WebVitals />
      <div className={styles.header}>
        <Header />
      </div>
      <div className={styles.nav}>
        <Sidebar />
      </div>
      <div className={styles.content}>
        <button title='Try!' onClick={ () => { Sentry.captureException(new Error('First error')) }}/>

        <Routes>
          {isAuth ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/library" element={<Library />} />
              <Route path="/create-book/manual" element={<CreateBookManual />} />
              <Route path="/create-book" element={<CreateBook />} />
              <Route path="/edit-book/:bookId" element={<EditBook />} />
              <Route path="*" element={<Navigate to="/" replace />} />
              <Route path="/public-library/:userId" element={<PublicLibrary />} />
              <Route path="/book/:bookId" element={<BookPage />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
              <Route path="/public-library/:userId" element={<PublicLibrary />} />
              <Route path="/book/:bookId" element={<BookPage />} />
            </>
          )}
        </Routes>
      </div>
    </div>
  );
}

export default Sentry.wrap(App);