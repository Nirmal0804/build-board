import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    } else if (formData.name.trim().length > 50) {
      errors.name = 'Name cannot exceed 50 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
    setGeneralError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      setGeneralError(null);
      await register(formData.name.trim(), formData.email.trim(), formData.password);
      navigate('/');
    } catch (err) {
      setGeneralError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-card">
      <h1 className="auth-title">Join BuildBoard</h1>
      <p className="auth-subtitle">Create an account to share projects and ask questions</p>

      {generalError && (
        <ErrorMessage message={generalError} onDismiss={() => setGeneralError(null)} />
      )}

      <form onSubmit={handleSubmit} noValidate>
        <Input
          id="name"
          label="Your Name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Alex Rivera"
          error={fieldErrors.name}
          required
          autoComplete="name"
        />

        <Input
          id="email"
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="alex@example.com"
          error={fieldErrors.email}
          required
          autoComplete="email"
        />

        <Input
          id="password"
          label="Password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="At least 6 characters"
          error={fieldErrors.password}
          helperText="Must be at least 6 characters"
          required
          autoComplete="new-password"
        />

        <Input
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Repeat your password"
          error={fieldErrors.confirmPassword}
          required
          autoComplete="new-password"
        />

        <Button
          type="submit"
          variant="primary"
          disabled={submitting}
          style={{ width: '100%', marginTop: '0.5rem' }}
        >
          {submitting ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      <div className="auth-footer">
        Already have an account?{' '}
        <Link to="/login" className="auth-link">
          Log in instead
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
