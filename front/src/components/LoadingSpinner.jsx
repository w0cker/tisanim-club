import React from 'react';
import '../styles/LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner">
        <i className="bi bi-airplane-fill"></i>
      </div>
      <p className="loading-text">טוען...</p>
    </div>
  );
};

export default LoadingSpinner;