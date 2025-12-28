import React, { useState } from 'react';
import { coursesAPI } from '../services/api';
import '../styles/CoursesPage.css';

const CoursesPage = () => {
  const [activeTab, setActiveTab] = useState('tisan');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    courseType: 'tisan',
    experience: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // הוסף מצב טעינה
  const [submitMessage, setSubmitMessage] = useState(''); // הוסף הודעת סטטוס

  const courses = {
    tisan: {
      title: 'קורס טיס במטוסים',
      description: 'קורס מקיף לטיסה במטוסים מונחים מרחוק. כולל תיאוריה ומעשי.',
      duration: '12 מפגשים',
      price: '1,200₪',
      features: [
        'לימוד עקרונות אווירודינמיקה',
        'תרגול בסימולטור',
        'טיסות מעשיות בשטח',
        'לימוד תחזוקה בסיסית',
        'תעודת סיום מוסמכת'
      ]
    },
    masok: {
      title: 'קורס טיס במסוקים',
      description: 'התמחות בטיסת מסוקים רדיו-נשלטים. טכניקות מתקדמות.',
      duration: '10 מפגשים',
      price: '1,500₪',
      features: [
        'טיסה נייחת (Hover)',
        'טיסה אחורית',
        'תרגילי רוטור',
        'תחזוקה מתקדמת',
        'סימולציות חירום'
      ]
    },
    dron: {
      title: 'קורס טיס בדרונים',
      description: 'קורס מקצועי לדרוני צילום ומרוצים. כולל תכנות אוטונומי.',
      duration: '8 מפגשים',
      price: '1,000₪',
      features: [
        'צילום אווירי מקצועי',
        'תכנות מסלולי טיסה',
        'התמודדות עם רוח',
        'תקנות ותקנות טיסה',
        'עריכת וידאו בסיסית'
      ]
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
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
        // קבל את המשתמש הנוכחי
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      // שלח את הנתונים לשרת
      await coursesAPI.registerToCourse(formData.courseType, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        Age: formData.age, // שים לב: Age עם A גדולה כמו בשדה של MongoDB
        courseType: formData.courseType,
        experience: formData.experience,
        CursProgres: 'בהרשמה' // הוסף סטטוס התחלתי
      });
      
      setSubmitMessage('success');
      alert('הרשמתך התקבלה! נחזור אליך בהקדם.');
      
      // אפס את הטופס
      setFormData({
        name: '',
        email: '',
        phone: '',
        age: '',
        courseType: activeTab,
        experience: '',
      });
      
    } catch (error) {
      console.error('Error registering for course:', error);
      setSubmitMessage('error');
      alert('שגיאה בשליחת ההרשמה. נסה שוב מאוחר יותר.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentCourse = courses[activeTab];

  return (
    <div className="courses-page py-4">
      <div className="container">
        <h1 className="section-title mb-4">קורסי טיס</h1>
          {submitMessage === 'success' && (
          <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
            <i className="bi bi-check-circle-fill me-2"></i>
            ההרשמה התקבלה בהצלחה! נחזור אליך בהקדם.
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setSubmitMessage('')}
            ></button>
          </div>
        )}
        
        {submitMessage === 'error' && (
          <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            שגיאה בשליחת ההרשמה. נסה שוב מאוחר יותר.
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setSubmitMessage('')}
            ></button>
          </div>
        )}
        
        {/* Course Selection Tabs */}
        <div className="row mb-4">
          <div className="col-12">
            <ul className="nav nav-tabs" id="courseTabs" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'tisan' ? 'active' : ''}`}
                  onClick={() => setActiveTab('tisan')}
                >
                  <i className="bi bi-airplane me-2"></i>
                  מטוסים
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'masok' ? 'active' : ''}`}
                  onClick={() => setActiveTab('masok')}
                >
                  <i className="bi bi-helicopter me-2"></i>
                  מסוקים
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'dron' ? 'active' : ''}`}
                  onClick={() => setActiveTab('dron')}
                >
                  <i className="bi bi-camera-video me-2"></i>
                  דרונים
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Course Details */}
        <div className="row mb-5">
          <div className="col-lg-8">
            <div className="course-details card">
              <div className="card-body">
                <h2 className="card-title text-primary">{currentCourse.title}</h2>
                <p className="lead">{currentCourse.description}</p>
                
                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-3">
                      <i className="bi bi-clock text-primary me-3 fs-4"></i>
                      <div>
                        <h5 className="mb-0">משך הקורס</h5>
                        <p className="mb-0">{currentCourse.duration}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-3">
                      <i className="bi bi-cash text-primary me-3 fs-4"></i>
                      <div>
                        <h5 className="mb-0">מחיר</h5>
                        <p className="mb-0">{currentCourse.price}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <h4 className="mb-3">מה נלמד בקורס:</h4>
                <ul className="list-unstyled">
                  {currentCourse.features.map((feature, index) => (
                    <li key={index} className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title mb-4">הרשמה לקורס</h4>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
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
                  
                  <div className="mb-3">
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
                  
                  <div className="mb-3">
                    <label className="form-label">טלפון *</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">גיל *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      required
                      min="12"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">סוג הקורס *</label>
                    <select
                      className="form-select"
                      name="courseType"
                      value={formData.courseType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="tisan">קורס מטוסים</option>
                      <option value="masok">קורס מסוקים</option>
                      <option value="dron">קורס דרונים</option>
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">ניסיון קודם</label>
                    <textarea
                      className="form-control"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="ספר לנו על ניסיון קודם בטיסה..."
                    ></textarea>
                  </div>
                  
                             <button 
                  type="submit" 
                  className="btn btn-primary w-100"
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
                      שלח הרשמה
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

        {/* FAQ */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title mb-4">שאלות נפוצות</h4>
                <div className="accordion" id="faqAccordion">
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                        האם צריך ניסיון קודם?
                      </button>
                    </h2>
                    <div id="faq1" className="accordion-collapse collapse show">
                      <div className="accordion-body">
                        לא, הקורסים מתאימים גם למתחילים. אנחנו מתחילים מהבסיס ומתקדמים בהדרגה.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                        האם הציוד מסופק?
                      </button>
                    </h2>
                    <div id="faq2" className="accordion-collapse collapse">
                      <div className="accordion-body">
                        כן, כל הציוד הדרוש לקורס מסופק על ידינו. בסיום הקורס נוכל לייעץ לרכישת ציוד אישי.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                        מה גיל המינימום להרשמה?
                      </button>
                    </h2>
                    <div id="faq3" className="accordion-collapse collapse">
                      <div className="accordion-body">
                        גיל המינימום הוא 12 שנים, עם אישור הורים.
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

export default CoursesPage;