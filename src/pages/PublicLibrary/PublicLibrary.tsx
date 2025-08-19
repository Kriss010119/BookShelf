import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { setPublicLibrary } from '../../store/slices/librarySlice';
import { getPublicUserProfile, getPublicLibrary } from '../../firebase/libraryService';
import Library from '../Library/Library';

const PublicLibrary = () => {
  const { userId } = useParams<{ userId: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useSelector((state: RootState) => state.library);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPublicLibrary = async () => {
      if (!userId) {
        return;
      }
      try {
        setLoading(true);
        const library = await getPublicLibrary(userId);
        const profile = await getPublicUserProfile(userId);
        dispatch(
            setPublicLibrary({
              library,
              ownerInfo: {
                ...profile,
                isPublic: true,
                id: userId
              }
            })
        );
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError('Error loading public library');
        console.error('Error loading public library:', error);
      }
    };

    loadPublicLibrary();
  }, [userId, dispatch]);

  if (loading) {
    return <div>Loading public library...</div>;
  }

  if (error) {
    return (
      <div>
        <div>{error}</div>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  return (
    <div>
      <Library isPublic={true} />
    </div>
  );
};

export default PublicLibrary;
