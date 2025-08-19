import { type ChangeEvent, type FormEvent, useState } from 'react';
import { registerUser, updateUserProfile } from '../../firebase/firebase-config';
import { useNavigate } from 'react-router-dom';
import { Form } from '../../components/Form/Form';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/slices/userSlice';
import styles from './Register.module.css';

const defaultFormFields = {
  email: '',
  password: ''
};

function Register() {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [error, setError] = useState<string | null>(null);
  const { email, password } = formFields;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const clearForm = () => {
    setFormFields(defaultFormFields);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      const userCreated = await registerUser(email, password);
      if (userCreated) {
        const user = userCreated.user;

        await updateUserProfile(
          user.uid,
          {
            username: "",
            avatarType: 'letter',
            avatarImage: "",
            isPublic: false
          },
          null
        );

        dispatch(
          setUser({
            email: user.email,
            token: user.refreshToken,
            id: user.uid,
            username: null,
            avatarType: 'letter',
            avatarImage: null,
            avatarColor: 'rgba(40,74,18,0.5)',
            isPublic: false
          })
        );

        setError(null);
        clearForm();
        navigate('/');
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
        setLoading(false);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <div className={styles.authContainer}>
      <Form
        loading={loading}
        title="Register"
        email={email}
        password={password}
        error={error}
        linkText={'Log in'}
        linkPath={'/login'}
        linkDescription={'Already have an account? '}
        onSubmit={handleSubmit}
        onEmailChange={handleChange}
        onPasswordChange={handleChange}
      />
    </div>
  );
}

export default Register;
