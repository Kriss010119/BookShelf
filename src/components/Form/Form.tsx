import type { FormProps } from '../../types/types';
import styles from './Form.module.css';

export const Form = ({
  loading,
  title,
  email,
  password,
  error,
  linkText,
  linkPath,
  linkDescription,
  onSubmit,
  onEmailChange,
  onPasswordChange
}: FormProps) => {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <h2 className={styles.title}>{title}</h2>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={onEmailChange}
          className={styles.input}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={onPasswordChange}
          className={styles.input}
          required
        />
      </div>
      <button type="submit" className={styles.submitButton}>
        {!loading ? title : 'Loading...'}
      </button>
      {linkText && linkPath && linkDescription && (
        <p className={styles.linkContainer}>
          {linkDescription}
          <a href={linkPath} className={styles.link}>
            {linkText}
          </a>
        </p>
      )}
    </form>
  );
};
