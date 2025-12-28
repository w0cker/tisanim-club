import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setShowSearch(false);
      setIsMenuOpen(false);
    }
  };

  const navItems = [
    { path: '/', label: 'בית', icon: 'bi-house-fill' },
    { path: '/products', label: 'חנות', icon: 'bi-cart-fill' },
    { path: '/courses', label: 'קורסים', icon: 'bi-book-fill' },
    { path: '/exchange', label: 'החלפה', icon: 'bi-arrow-left-right' },
    { path: '/regulations', label: 'תקנות', icon: 'bi-file-earmark-text-fill' },
    { path: '/safety', label: 'בטיחות', icon: 'bi-shield-fill-check' },
    { path: '/history', label: 'היסטוריה', icon: 'bi-clock-fill' },
    { path: '/contact', label: 'צור קשר', icon: 'bi-chat-right-text-fill' },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-lg sticky-top">
      <div className="container">
        {/* לוגו */}
        <Link className="navbar-brand fw-bold fs-3" to="/">
          <i className="bi bi-airplane-engines-fill me-2"></i>
          טיסנים
        </Link>

        {/* כפתור חיפוש למובייל */}
        <button 
          className="btn btn-outline-light d-lg-none me-2"
          onClick={() => setShowSearch(!showSearch)}
          type="button"
        >
          <i className="bi bi-search"></i>
        </button>

        {/* כפתור טוגל */}
        <button 
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* תפריט */}
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
          {/* חיפוש - למחשבים */}
          <form className="navbar-search d-none d-lg-flex me-3" onSubmit={handleSearch}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="חפש טיסנים, חלקים..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-light" type="submit">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </form>

          {/* כפתורי ניווט */}
          <div className="navbar-nav mx-auto flex-row flex-wrap justify-content-center">
            {navItems.map((item) => (
              <NavLink 
                key={item.path}
                className={({ isActive }) => 
                  `nav-link mx-1 my-1 btn btn-nav ${isActive ? 'btn-nav-active' : 'btn-nav-inactive'}`
                } 
                to={item.path}
                onClick={() => {
                  setIsMenuOpen(false);
                  setShowSearch(false);
                }}
              >
                <i className={`bi ${item.icon} me-1`}></i>
                <span className="nav-text">{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* כפתורי משתמש */}
          <div className="navbar-nav ms-lg-3">
            {isLoggedIn ? (
              <div className="d-flex align-items-center">
                <div className="dropdown">
                  <button 
                    className="btn btn-user dropdown-toggle d-flex align-items-center"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    <div className="user-avatar me-2">
                      <i className="bi bi-person-circle fs-4"></i>
                    </div>
                    <div className="d-none d-lg-block text-start">
                      <div className="small text-white-50">שלום</div>
                      <div className="fw-semibold">{user?.name?.split(' ')[0] || 'משתמש'}</div>
                    </div>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        <i className="bi bi-person me-2"></i>
                        פרופיל אישי
                      </Link>
                    </li>
              
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i>
                        התנתק
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link 
                  to="/login" 
                  className="btn btn-outline-light"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="bi bi-box-arrow-in-right me-1"></i>
                  <span> התחבר </span>
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-light text-primary fw-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="bi bi-person-plus me-1"></i>
                  <span>  הרשם  </span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* חיפוש למובייל */}
        {showSearch && (
          <div className="w-100 mt-2 d-lg-none">
            <form className="navbar-search" onSubmit={handleSearch}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="חפש טיסנים, חלקים..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button className="btn btn-light" type="submit">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;