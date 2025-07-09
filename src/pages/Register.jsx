import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import './Register.css';

const Register = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const validate = (name, value) => {
    switch (name) {
      case 'username':
        if (!value) return 'Username is required.';
        if (value.length < 3) return 'Username must be at least 3 characters.';
        return '';
      case 'email':
        if (!value) return 'Email is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email address.';
        return '';
      case 'password':
        if (!value) return 'Password is required.';
        if (value.length < 6) return 'Password must be at least 6 characters.';
        return '';
      case 'confirmPassword':
        if (!value) return 'Please confirm your password.';
        if (value !== formData.password) return 'Passwords do not match.';
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
      username: validate('username', formData.username),
      email: validate('email', formData.email),
      password: validate('password', formData.password),
      confirmPassword: validate('confirmPassword', formData.confirmPassword)
    };
    setFormErrors(errors);
    if (errors.username || errors.email || errors.password || errors.confirmPassword) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:6060/api/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      // Auto-login after successful registration
      const loginResponse = await axios.post('http://localhost:6060/api/auth/login', {
        email: formData.email,
        password: formData.password
      });
      
      onLogin(loginResponse.data.token, {
        username: loginResponse.data.username,
        email: loginResponse.data.email
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card card fade-in">
        <div className="register-header">
          <h1>Create Account</h1>
          <p>Join the attendance management system</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label className="form-label">
              <FaUser className="form-icon" />
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input${formErrors.username ? ' input-error' : ''}`}
              placeholder="Enter your username"
            />
            {formErrors.username && (
              <div className="field-error">{formErrors.username}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              <FaEnvelope className="form-icon" />
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
          </div>

          <div className="form-group">
            <label className="form-label">
              <FaLock className="form-icon" />
              Confirm Password
            </label>
            <div className="password-input-container">
              {formErrors.password && (
                <div className="field-error">{formErrors.password}</div>
              )}
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input password-input${formErrors.confirmPassword ? ' input-error' : ''}`}
                placeholder="Confirm your password"
              />
              {formErrors.confirmPassword && (
                <div className="field-error">{formErrors.confirmPassword}</div>
              )}
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className={`btn btn-primary register-btn ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="register-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register; 