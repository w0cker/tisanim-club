import React from 'react';
import { Link } from 'react-router-dom';
// import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer bg-dark text-white mt-auto">
      <div className="container py-5">
        <div className="row">
          <div className="col-md-4 mb-4">
            <h5 className="mb-3">
              <i className="bi bi-airplane-fill me-2"></i>
              מועדון טיסנים
            </h5>
            <p>
              הפלטפורמה המובילה לחובבי טיסנאות בישראל. 
              הצטרפו לקהילה שלנו וקחו חלק בתחביב המרתק.
            </p>
          </div>
          
          <div className="col-md-4 mb-4">
            <h5 className="mb-3">קישורים מהירים</h5>
            <ul className="list-unstyled">
              <li><Link to="/products" className="text-white text-decoration-none">חנות טיסנים</Link></li>
              <li><Link to="/courses" className="text-white text-decoration-none">קורסי טיס</Link></li>
              <li><Link to="/exchange" className="text-white text-decoration-none">החלפת ציוד</Link></li>
              <li><Link to="/regulations" className="text-white text-decoration-none">תקנות טיס</Link></li>
            </ul>
          </div>
          
          <div className="col-md-4 mb-4">
            <h5 className="mb-3">צור קשר</h5>
            <ul className="list-unstyled">
              <li><i className="bi bi-telephone me-2"></i> 08-1234567</li>
              <li><i className="bi bi-envelope me-2"></i> info@tisanim.co.il</li>
              <li><i className="bi bi-geo-alt me-2"></i> אשדוד</li>
            </ul>
            <div className="social-links mt-3">
              <a href="#" className="text-white me-3"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-white me-3"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-white me-3"><i className="bi bi-youtube"></i></a>
              <a href="#" className="text-white"><i className="bi bi-whatsapp"></i></a>
            </div>
          </div>
        </div>
        
        <div className="border-top pt-3 mt-3 text-center">
          <p className="mb-0">
            © {currentYear} מועדון טיסנים. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;