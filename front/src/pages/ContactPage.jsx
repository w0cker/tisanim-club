import React, { useState } from 'react';
import { contactAPI } from '../services/api';
import '../styles/ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await contactAPI.sendMessage(formData);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: 'bi-telephone',
      title: 'טלפון',
      details: ['03-1234567', '050-1234567'],
      action: 'tel:031234567'
    },
    {
      icon: 'bi-envelope',
      title: 'אימייל',
      details: ['info@tisanim.co.il', 'support@tisanim.co.il'],
      action: 'mailto:info@tisanim.co.il'
    },
    {
      icon: 'bi-geo-alt',
      title: 'כתובת',
      details: ['רחוב התעופה 123', 'תל אביב, ישראל'],
      action: 'https://maps.google.com'
    },
    {
      icon: 'bi-clock',
      title: 'שעות פעילות',
      details: ['א-ה: 09:00-18:00', 'ו: 09:00-13:00'],
      action: null
    }
  ];

  return (
    <div className="contact-page py-4">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 mb-4">
            <div className="card">
              <div className="card-body">
                <h1 className="section-title mb-4">צור קשר</h1>
                
                {submitStatus === 'success' && (
                  <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    הודעתך נשלחה בהצלחה! נחזור אליך בהקדם.
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setSubmitStatus(null)}
                    ></button>
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    אירעה שגיאה בשליחת ההודעה. נסה שוב מאוחר יותר.
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setSubmitStatus(null)}
                    ></button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">שם מלא *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label className="form-label">אימייל *</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
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
                      />
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label className="form-label">נושא *</label>
                      <select
                        className="form-select"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">בחר נושא</option>
                        <option value="שאלה כללית">שאלה כללית</option>
                        <option value="תמיכה טכנית">תמיכה טכנית</option>
                        <option value="הרשמה לקורס">הרשמה לקורס</option>
                        <option value="הצעות שיתוף פעולה">הצעות שיתוף פעולה</option>
                        <option value="בעיה בהזמנה">בעיה בהזמנה</option>
                        <option value="אחר">אחר</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">הודעה *</label>
                    <textarea
                      className="form-control"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="5"
                      required
                    ></textarea>
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
                    className="btn btn-primary btn-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        שולח...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send me-2"></i>
                        שלח הודעה
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="contact-info-card mb-4">
              <h3 className="mb-4">פרטי התקשרות</h3>
              <div className="row">
                {contactInfo.map((info, index) => (
                  <div key={index} className="col-12 mb-4">
                    <div className="contact-info-item">
                      <div className="contact-icon">
                        <i className={`bi ${info.icon}`}></i>
                      </div>
                      <div className="contact-details">
                        <h5>{info.title}</h5>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="mb-1">
                            {info.action ? (
                              <a 
                                href={info.action} 
                                className="text-decoration-none"
                              >
                                {detail}
                              </a>
                            ) : (
                              detail
                            )}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="map-section">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title mb-3">מפה</h5>
                  <div className="map-placeholder bg-light rounded p-3 text-center">
                    <i className="bi bi-map display-4 text-muted mb-3"></i>
                    <p className="text-muted">כאן תופיע המפה</p>
                    <button className="btn btn-outline-primary">
                      <i className="bi bi-geo-alt me-2"></i>
                      פתח ב-Google Maps
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h3 className="mb-4">שאלות נפוצות</h3>
                <div className="accordion" id="contactFAQ">
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                        כמה זמן לוקח לקבל תשובה?
                      </button>
                    </h2>
                    <div id="faq1" className="accordion-collapse collapse show">
                      <div className="accordion-body">
                        אנו עונים להודעות תוך 24-48 שעות בימי חול.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                        האם אתם פתוחים בשבת?
                      </button>
                    </h2>
                    <div id="faq2" className="accordion-collapse collapse">
                      <div className="accordion-body">
                        המשרד סגור בשבתות ובחגים. הודעות שנשלחות בסוף שבוע יענו ביום ראשון.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                        האם יש אחריות על המוצרים?
                      </button>
                    </h2>
                    <div id="faq3" className="accordion-collapse collapse">
                      <div className="accordion-body">
                        כן, כל המוצרים שלנו מגיעים עם אחריות יצרן מלאה. פרטים מלאים בתעודת האחריות.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;