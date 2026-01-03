import React, { useState } from 'react';
import { Link, useNavigate , NavLink} from 'react-router-dom';
import { authAPI } from '../services/api';
import '../styles/AuthPages.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Use the login API method instead of getAllUsers
      const response = await authAPI.login(formData.email, formData.password);
      
      // Get the user and token from response
      const { user, token } = response.data;
      
      // Store authentication data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      // Navigate to profile page
     navigate('/', { replace: true });
// הוסף timeout קטן ואז רענן
setTimeout(() => {
  window.location.reload();
}, 100);

    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'אימייל או סיסמה לא נכונים. נסה שוב.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card auth-card">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="auth-icon mb-3">
                    <i className="bi bi-airplane-fill text-primary display-4"></i>
                  </div>
                  <h2 className="auth-title">כניסה לחשבון</h2>
                  <p className="text-muted">התחבר כדי לגשת לחשבון שלך</p>
                </div>

                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setError('')}
                    ></button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">אימייל</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-envelope"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="הכנס אימייל"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">סיסמה</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-lock"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="הכנס סיסמה"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3 d-flex justify-content-between align-items-center">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="rememberMe">
                        זכור אותי
                      </label>
                    </div>
                    <Link to="/forgot-password" className="text-decoration-none">
                      שכחת סיסמה?
                    </Link>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg w-100 mb-3"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        מתחבר...
                      </>
                    ) : (
                      'התחבר'
                    )}
                  </button>

                  <div className="text-center mt-3">
                    <p className="mb-0">
                      אין לך חשבון?{' '}
                      <Link to="/register" className="text-decoration-none fw-bold">
                        הירשם עכשיו
                      </Link>
                    </p>
                  </div>
                </form>

                <div className="separator my-4">
                  <span className="text-muted">או התחבר עם</span>
                </div>

                <div className="social-login">
                  <button className="btn btn-outline-secondary w-100 mb-2">
                    <i className="bi bi-google me-2"></i>
                    המשך עם Google
                  </button>
                  <button className="btn btn-outline-secondary w-100">
                    <i className="bi bi-facebook me-2"></i>
                    המשך עם Facebook
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
