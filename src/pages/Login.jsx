import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import './Login.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: ''
  });

  const validate = (name, value) => {
    switch (name) {
      case 'email':
        if (!value) return 'Email is required.';
        // Simple email regex
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email address.';
        return '';
      case 'password':
        if (!value) return 'Password is required.';
        if (value.length < 6) return 'Password must be at least 6 characters.';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setFormErrors({
      ...formErrors,
      [name]: value ? '' : validate(name, value)
    });
    setError('');
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setFormErrors({
      ...formErrors,
      [name]: validate(name, value)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const errors = {
      email: validate('email', formData.email),
      password: validate('password', formData.password)
    };
    setFormErrors(errors);
    if (errors.email || errors.password) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:6060/api/auth/login', formData);
      onLogin(response.data.token, {
        username: response.data.username,
        email: response.data.email
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card card fade-in">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your attendance account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">
              <FaUser className="form-icon" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input${formErrors.email ? ' input-error' : ''}`}
              placeholder="Enter your email"
            />
            {formErrors.email && (
              <div className="field-error">{formErrors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              <FaLock className="form-icon" />
              Password
            </label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input password-input${formErrors.password ? ' input-error' : ''}`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {formErrors.password && (
              <div className="field-error">{formErrors.password}</div>
            )}
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className={`btn btn-primary login-btn ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="link">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 