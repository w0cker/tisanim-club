import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import '../styles/AuthPages.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    city: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // נקה שגיאה כשהמשתמש מתחיל להקליד
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'שם מלא הוא שדה חובה';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'שם חייב להכיל לפחות 2 תווים';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'אימייל הוא שדה חובה';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'אימייל לא תקין';
    }

    if (!formData.password) {
      newErrors.password = 'סיסמה היא שדה חובה';
    } else if (formData.password.length < 6) {
      newErrors.password = 'סיסמה חייבת להכיל לפחות 6 תווים';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'הסיסמאות לא תואמות';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      // הסר את confirmPassword לפני שליחה לשרת
      const { confirmPassword, ...registrationData } = formData;
      
      // שליחת בקשה לשרת
      const response = await authAPI.register(registrationData);
      
      // הצג הודעת הצלחה
      setSuccessMessage('הרשמה בוצעה בהצלחה! אתה מועבר לדף ההתחברות...');
      
      // המתן 2 שניות ואז נווט לדף ההתחברות
      setTimeout(() => {
        navigate('/api/login');
      }, 2000);
      
    } catch (error) {
      console.error('Registration error:', error);
      
      // טיפול בשגיאות ספציפיות
      if (error.response?.data?.message === 'User with this email already exists' || 
          error.response?.data?.message === 'Email already exists') {
        setErrors({
          email: 'כתובת אימייל זו כבר רשומה במערכת'
        });
      } else if (error.response?.data?.message === 'Validation error' && 
                 error.response?.data?.errors) {
        // טיפול בשגיאות ולידציה מהשרת
        const serverErrors = {};
        error.response.data.errors.forEach(err => {
          if (err.includes('email')) {
            serverErrors.email = err;
          } else if (err.includes('password')) {
            serverErrors.password = err;
          } else if (err.includes('name')) {
            serverErrors.name = err;
          }
        });
        setErrors(serverErrors);
      } else {
        setErrors({
          submit: error.response?.data?.message || 
                 error.message || 
                 'שגיאה בהרשמה. נסה שוב מאוחר יותר.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card auth-card">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="auth-icon mb-3">
                    <i className="bi bi-person-plus display-4 text-primary"></i>
                  </div>
                  <h2 className="auth-title">הרשמה חדשה</h2>
                  <p className="text-muted">צור חשבון חדש במועדון הטיסנים</p>
                </div>

                {successMessage && (
                  <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    {successMessage}
                  </div>
                )}

                {errors.submit && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {errors.submit}
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setErrors(prev => ({ ...prev, submit: '' }))}
                    ></button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">שם מלא *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="הכנס שם מלא"
                      />
                      {errors.name && (
                        <div className="invalid-feedback">{errors.name}</div>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">אימייל *</label>
                      <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="הכנס אימייל"
                      />
                      {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">סיסמה *</label>
                      <input
                        type="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="הכנס סיסמה (מינימום 6 תווים)"
                      />
                      {errors.password && (
                        <div className="invalid-feedback">{errors.password}</div>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">אימות סיסמה *</label>
                      <input
                        type="password"
                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="הכנס סיסמה שנית"
                      />
                      {errors.confirmPassword && (
                        <div className="invalid-feedback">{errors.confirmPassword}</div>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">טלפון</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="הכנס מספר טלפון"
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">עיר</label>
                      <input
                        type="text"
                        className="form-control"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="הכנס עיר מגורים"
                      />
                    </div>
                  </div>

                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="terms"
                      required
                    />
                    <label className="form-check-label" htmlFor="terms">
                      אני מסכים ל{' '}
                      <Link to="/terms" className="text-decoration-none">
                        תנאי השימוש
                      </Link>
                      {' '}ול{' '}
                      <Link to="/privacy" className="text-decoration-none">
                        מדיניות הפרטיות
                      </Link>
                    </label>
                  </div>

                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="newsletter"
                    />
                    <label className="form-check-label" htmlFor="newsletter">
                      אני מעוניין לקבל עדכונים ומבצעים למייל
                    </label>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg w-100 mb-3"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        נרשם...
                      </>
                    ) : (
                      'הירשם עכשיו'
                    )}
                  </button>

                  <div className="text-center mt-3">
                    <p className="mb-0">
                      כבר יש לך חשבון?{' '}
                      <Link to="/login" className="text-decoration-none fw-bold">
                        התחבר כאן
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;