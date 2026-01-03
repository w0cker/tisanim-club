import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import '../styles/HomePage.css';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await productsAPI.getAllProducts();
      setFeaturedProducts(response.data.data?.slice(0, 4) || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('לא ניתן לטעון מוצרים כרגע');
      // Fallback data
      setFeaturedProducts([
        {
          _id: '1',
          name: 'מטוס מתחילים',
          specification: 'מטוס מושלם למתחילים, יציב וקל להטסה',
          cost: '450₪',
          category: 'מטוסים'
        },
        {
          _id: '2',
          name: 'דרון FPV',
          specification: 'דרון למרוצים עם מצלמת FPV',
          cost: '850₪',
          category: 'דרונים'
        },
        {
          _id: '3',
          name: 'מסוק מתקדם',
          specification: 'מסוק 6 ערוצים עם גירוסקופ דיגיטלי',
          cost: '1200₪',
          category: 'מסוקים'
        },
        {
          _id: '4',
          name: 'ערכת תיקון',
          specification: 'ערכת תיקון בסיסית לטיסנים',
          cost: '120₪',
          category: 'חלקי חילוף'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section text-center py-5 bg-primary text-white">
        <div className="container">
          <h1 >ברוכים הבאים למועדון טיסנים</h1>
          <p className="lead mb-4">
            הפלטפורמה המובילה לחובבי טיסנאות בישראל
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/products" className="btn btn-light btn-lg">
              <i className="bi bi-shop me-2"></i>
               חנות טיסנים 
            </Link>
            <Link to="/courses" className="btn btn-outline-light btn-lg">
              <i className="bi bi-book me-2"></i>
               קורסי טיס  
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products py-5">
        <div className="container">
          <h2 className="section-title mb-4">טיסנים מומלצים</h2>
          {error && (
            <div className="alert alert-warning">
              {error}
            </div>
          )}
          {loading ? (
            <div className="text-center">
              <div className="loading-spinner"></div>
              <p className="mt-2">טוען מוצרים...</p>
            </div>
          ) : (
            <div className="row">
              {featuredProducts.map((product) => (
                <div key={product._id} className="col-md-3 mb-4">
                  <div className="card card-hover h-100">
                    <div className="card-body">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text text-muted">
                        {product.specification.substring(0, 80)}...
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="h5 text-primary">{product.cost}</span>
                        <Link 
                          to={`/products`}
                          className="btn btn-primary btn-sm"
                        >
                          פרטים נוספים
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="categories py-5 bg-light">
        <div className="container">
          <h2 className="section-title mb-4">קטגוריות</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="category-card text-center p-4 bg-white rounded shadow-sm">
                <i className="bi bi-airplane display-4 text-primary mb-3"></i>
                <h3>מטוסים</h3>
                <p className="text-muted">מטוסים מונחים מרחוק לכל הרמות</p>
                <Link to="/products" className="btn btn-outline-primary">
                  צפה במטוסים
                </Link>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="category-card text-center p-4 bg-white rounded shadow-sm">
                <i className="bi bi-helicopter display-4 text-primary mb-3"></i>
                <h3>מסוקים</h3>
                <p className="text-muted">מסוקים מתקדמים לטיסות מקצועיות</p>
                <Link to="/products" className="btn btn-outline-primary">
                  צפה במסוקים
                </Link>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="category-card text-center p-4 bg-white rounded shadow-sm">
                <i className="bi bi-camera-video display-4 text-primary mb-3"></i>
                <h3>דרונים</h3>
                <p className="text-muted">דרונים לצילום ומרוצים</p>
                <Link to="/products" className="btn btn-outline-primary">
                  צפה בדרונים
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="courses py-5">
        <div className="container">
          <h2 className="section-title mb-4">קורסים והדרכות</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card card-hover h-100">
                <div className="card-body">
                  <h5 className="card-title">קורס טיס במטוסים</h5>
                  <p className="card-text">
                    לימוד עקרונות הטיסה, תיאוריה ומעשי. מתאים למתחילים ולמתקדמים.
                  </p>
                  <Link to="/courses#tisan" className="btn btn-primary">
                    הרשמה לקורס
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card card-hover h-100">
                <div className="card-body">
                  <h5 className="card-title">קורס טיס במסוקים</h5>
                  <p className="card-text">
                    מיוחד לטיסת מסוקים רדיו-נשלטים וטכניקות טיסה מתקדמות.
                  </p>
                  <Link to="/courses#masok" className="btn btn-primary">
                    הרשמה לקורס
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card card-hover h-100">
                <div className="card-body">
                  <h5 className="card-title">קורס טיס בדרונים</h5>
                  <p className="card-text">
                    הדרכה על צילום אווירי, תכנות טיסה אוטונומית ותקנות טיסה.
                  </p>
                  <Link to="/courses#dron" className="btn btn-primary">
                    הרשמה לקורס
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
