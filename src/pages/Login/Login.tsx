import { type ChangeEvent, type FormEvent, useState } from 'react';
import { SingInUser } from '../../firebase/firebase-config';
import { useNavigate } from 'react-router-dom';
import { Form } from '../../components/Form/Form';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/slices/userSlice';
import styles from '../Register/Register.module.css';

const defaultFormFields = {
  email: '',
  password: ''
};

function Login() {
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
      const userSingIn = await SingInUser(email, password);
      if (userSingIn) {
        const user = userSingIn.user;
        dispatch(
          setUser({
            email: user.email,
            token: user.refreshToken,
            id: user.uid
          })
        );
        setError(null);
        clearForm();
        navigate('/');
      }
    } catch {
      setError('User Log In failed');
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
        title="Login"
        email={email}
        password={password}
        error={error}
        linkText={'Register'}
        linkPath={'/register'}
        linkDescription={"Haven't got an account? "}
        onSubmit={handleSubmit}
        onEmailChange={handleChange}
        onPasswordChange={handleChange}
      />
    </div>
  );
}

export default Login;
