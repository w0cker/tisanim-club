import React, { useState, useEffect } from 'react';
import { exchangeAPI } from '../services/api';
import '../styles/ExchangePage.css';

const ExchangePage = () => {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    productType: 'מטוס',
    condition: 'כמעט חדש',
    price: '',
    location: '',
    wantedItems: '',
  });

  useEffect(() => {
    fetchExchanges();
  }, []);

  const fetchExchanges = async () => {
    try {
      const response = await exchangeAPI.getAll();
      setExchanges(response.data.data);
    } catch (error) {
      console.error('Error fetching exchanges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await exchangeAPI.create(formData);
      alert('המודעה פורסמה בהצלחה!');
      setShowForm(false);
      fetchExchanges();
      setFormData({
        title: '',
        description: '',
        productType: 'מטוס',
        condition: 'כמעט חדש',
        price: '',
        location: '',
        wantedItems: '',
      });
    } catch (error) {
      alert('שגיאה בפרסום המודעה');
    }
  };

  const handleContact = (exchange) => {
    alert(`יצירת קשר עם ${exchange.owner?.name || 'המוכר'} בנוגע ל: ${exchange.title}`);
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="loading-spinner"></div>
        <p>טוען מודעות...</p>
      </div>
    );
  }

  return (
    <div className="exchange-page py-4">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="section-title mb-0">החלפה ומסירה</h1>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            <i className="bi bi-plus-circle me-2"></i>
            פרסם מודעה חדשה
          </button>
        </div>

        {/* Form for new exchange */}
        {showForm && (
          <div className="card mb-4">
            <div className="card-body">
              <h4 className="card-title mb-4">פרסום מודעה חדשה</h4>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">כותרת *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">סוג המוצר *</label>
                    <select
                      className="form-select"
                      name="productType"
                      value={formData.productType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="מטוס">מטוס</option>
                      <option value="מסוק">מסוק</option>
                      <option value="דרון">דרון</option>
                      <option value="חלקים">חלקים</option>
                      <option value="אביזרים">אביזרים</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">תיאור *</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    required
                  ></textarea>
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">מצב *</label>
                    <select
                      className="form-select"
                      name="condition"
                      value={formData.condition}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="חדש">חדש</option>
                      <option value="כמעט חדש">כמעט חדש</option>
                      <option value="משומש">משומש</option>
                      <option value="דורש תיקון">דורש תיקון</option>
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">מחיר (₪)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">מיקום *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">מחפש/ת להחליף ב...</label>
                  <textarea
                    className="form-control"
                    name="wantedItems"
                    value={formData.wantedItems}
                    onChange={handleInputChange}
                    rows="2"
                    placeholder="תיאור המוצרים שאתה מחפש להחליף..."
                  ></textarea>
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary">
                    פרסם מודעה
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowForm(false)}
                  >
                    ביטול
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Exchanges List */}
        <div className="row">
          {exchanges.length === 0 ? (
            <div className="col-12 text-center py-5">
              <i className="bi bi-inbox display-1 text-muted mb-3"></i>
              <h3>אין מודעות להצגה</h3>
              <p className="text-muted">פרסם את המודעה הראשונה!</p>
            </div>
          ) : (
            exchanges.map(exchange => (
              <div key={exchange._id} className="col-md-6 col-lg-4 mb-4">
                <div className="card exchange-card card-hover h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className={`badge ${getStatusBadgeClass(exchange.status)}`}>
                        {exchange.status}
                      </span>
                      <small className="text-muted">
                        {new Date(exchange.createdAt).toLocaleDateString('he-IL')}
                      </small>
                    </div>
                    
                    <h5 className="card-title">{exchange.title}</h5>
                    <p className="card-text text-muted">
                      <i className={`bi ${getProductIcon(exchange.productType)} me-2`}></i>
                      {exchange.productType}
                    </p>
                    
                    <p className="card-text">
                      {exchange.description.substring(0, 100)}...
                    </p>
                    
                    <div className="exchange-details mb-3">
                      <div className="row">
                        <div className="col-6">
                          <small className="text-muted d-block">מצב</small>
                          <strong>{exchange.condition}</strong>
                        </div>
                        <div className="col-6">
                          <small className="text-muted d-block">מיקום</small>
                          <strong>{exchange.location}</strong>
                        </div>
                      </div>
                    </div>
                    
                    {exchange.price && (
                      <div className="price-tag mb-3">
                        <span className="h5 text-primary">{exchange.price}₪</span>
                      </div>
                    )}
                    
                    {exchange.wantedItems && (
                      <div className="wanted-items mb-3">
                        <small className="text-muted d-block">מחפש להחליף ב:</small>
                        <p className="mb-0">{exchange.wantedItems}</p>
                      </div>
                    )}
                    
                    <button 
                      className="btn btn-outline-primary w-100"
                      onClick={() => handleContact(exchange)}
                    >
                      <i className="bi bi-chat-dots me-2"></i>
                      יצירת קשר
                    </button>
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

// Helper functions
const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'פעיל': return 'bg-success';
    case 'במשא ומתן': return 'bg-warning text-dark';
    case 'הוחלף': return 'bg-info';
    case 'בוטל': return 'bg-secondary';
    default: return 'bg-light text-dark';
  }
};

const getProductIcon = (type) => {
  switch (type) {
    case 'מטוס': return 'bi-airplane';
    case 'מסוק': return 'bi-helicopter';
    case 'דרון': return 'bi-camera-video';
    default: return 'bi-box';
  }
};

export default ExchangePage;