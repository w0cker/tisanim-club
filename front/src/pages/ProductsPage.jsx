import React, { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';
import '../styles/ProductsPage.css';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('כל הקטגוריות');
  const [sortBy, setSortBy] = useState('newest');
  const [error, setError] = useState(null);

  const categories = ['כל הקטגוריות', 'מטוסים', 'מסוקים', 'דרונים', 'חלקי חילוף', 'קיטים'];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, selectedCategory, sortBy]);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAllProducts();
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('לא ניתן לטעון מוצרים כרגע');
      // Fallback data
      setProducts([
        {
          _id: '1',
          name: 'מטוס מתחילים',
          specification: 'מטוס מושלם למתחילים, יציב וקל להטסה',
          cost: '450₪',
          category: 'מטוסים',
          onStock: true,
          countItems: 5
        },
        {
          _id: '2',
          name: 'דרון FPV',
          specification: 'דרון למרוצים עם מצלמת FPV',
          cost: '850₪',
          category: 'דרונים',
          onStock: true,
          countItems: 3
        },
        {
          _id: '3',
          name: 'מסוק מתקדם',
          specification: 'מסוק 6 ערוצים עם גירוסקופ דיגיטלי',
          cost: '1200₪',
          category: 'מסוקים',
          onStock: false,
          countItems: 0
        },
        {
          _id: '4',
          name: 'ערכת תיקון',
          specification: 'ערכת תיקון בסיסית לטיסנים',
          cost: '120₪',
          category: 'חלקי חילוף',
          onStock: true,
          countItems: 10
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'כל הקטגוריות') {
      filtered = filtered.filter(product => 
        product.category === selectedCategory
      );
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.specification.toLowerCase().includes(term)
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return parseFloat(a.cost) - parseFloat(b.cost);
        case 'price-high':
          return parseFloat(b.cost) - parseFloat(a.cost);
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product) => {
    // כאן תהיה לוגיקה להוספה לעגלה
    alert(`נוסף לעגלה: ${product.name}`);
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="loading-spinner"></div>
        <p>טוען מוצרים...</p>
      </div>
    );
  }

  return (
    <div className="products-page py-4">
      <div className="container">
        <h1 className="section-title mb-4">חנות טיסנים</h1>
        
        {error && (
          <div className="alert alert-warning mb-4">
            {error}
          </div>
        )}
        
        {/* Filters */}
        <div className="row mb-4">
          <div className="col-md-8">
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="חפש טיסנים, חלקים או אביזרים..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-primary" type="button">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </div>
          <div className="col-md-4">
            <select 
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">חדשים ביותר</option>
              <option value="price-low">מחיר: מהנמוך לגבוה</option>
              <option value="price-high">מחיר: מהגבוה לנמוך</option>
            </select>
          </div>
        </div>

        {/* Categories */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="row">
          {filteredProducts.length === 0 ? (
            <div className="col-12 text-center py-5">
              <i className="bi bi-search display-1 text-muted mb-3"></i>
              <h3>לא נמצאו מוצרים</h3>
              <p className="text-muted">נסה לשנות את החיפוש או הקטגוריה</p>
            </div>
          ) : (
            filteredProducts.map(product => (
              <div key={product._id} className="col-md-4 col-lg-3 mb-4">
                <div className="card product-card card-hover h-100">
                  <div className="card-body">
                    <div className="product-badge">
                      {product.onStock ? (
                        <span className="badge bg-success">במלאי</span>
                      ) : (
                        <span className="badge bg-secondary">אזל המלאי</span>
                      )}
                    </div>
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text text-muted small">
                      {product.category}
                    </p>
                    <p className="card-text">
                      {product.specification.substring(0, 100)}...
                    </p>
                    <div className="product-price mb-3">
                      <span className="h4 text-primary">{product.cost}</span>
                      {product.countItems > 0 && (
                        <small className="text-muted d-block">
                          נותרו {product.countItems} במלאי
                        </small>
                      )}
                    </div>
                    <div className="d-grid gap-2">
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.onStock}
                      >
                        <i className="bi bi-cart-plus me-2"></i>
                        הוסף לעגלה
                      </button>
                      <button className="btn btn-outline-primary">
                        פרטים נוספים
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;