import { useSelector } from 'react-redux';
import type {RootState} from '../store/store';

export function useAuth() {
    const { email, token, id, isLoading } = useSelector((state: RootState) => state.user);

    return {
        isAuth: !!email,
        isLoading,
        email,
        token,
        id,
    };
}