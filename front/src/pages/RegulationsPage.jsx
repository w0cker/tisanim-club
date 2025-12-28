import React, { useState, useEffect } from 'react';
import { contentAPI } from '../services/api';
import '../styles/ContentPages.css';

const RegulationsPage = () => {
  const [regulations, setRegulations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegulations();
  }, []);

  const fetchRegulations = async () => {
    try {
      const response = await contentAPI.getByCategory('תקנות טיס');
      setRegulations(response.data.data || getDefaultRegulations());
    } catch (error) {
      console.error('Error fetching regulations:', error);
      setRegulations(getDefaultRegulations());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultRegulations = () => [
    {
      _id: '1',
      title: 'תקנות טיסה בסיסיות',
      content: '1. תמיד שמרו על קשר עין עם הטיסן.\n2. אל תטוסו ליד אנשים או רכוש.\n3. אל תטוסו בגובה של יותר מ-120 מטר.\n4. אל תטוסו ליד שדות תעופה.\n5. תמיד בדקו את מזג האוויר לפני הטיסה.',
      createdAt: new Date().toISOString(),
    },
    {
      _id: '2',
      title: 'אזורי טיסה מותרים',
      content: 'מותר לטוס בטיסנים באזורים הבאים:\n1. שדות טיסנים מאושרים\n2. אזורים פתוחים ללא אוכלוסייה\n3. חופים מאושרים לטיסה\n4. שטחים חקלאיים עם אישור\n\nאסור לטוס:\n1. בתוך ערים\n2. ליד שדות תעופה\n3. באזורים צבאיים\n4. בשמורות טבע',
      createdAt: new Date().toISOString(),
    },
    {
      _id: '3',
      title: 'רישיונות והסמכות',
      content: 'בישראל, טיסה בדרונים במשקל של מעל 250 גרם דורשת רישיון מטעם רשות התעופה האזרחית. עבור טיסנים קטנים יותר, אין צורך ברישיון אך יש לעמוד בכל התקנות. מומלץ להצטרף למועדון טיסנים מוכר כדי ללמוד את הכללים כראוי.',
      createdAt: new Date().toISOString(),
    },
    {
      _id: '4',
      title: 'תקנות טיסה בדרונים',
      content: '1. דרונים במשקל מעל 250 גרם חייבים ברישום.\n2. חובה לבטח דרונים מסחריים.\n3. אסור לטוס מעל קהל.\n4. יש לשמור מרחק משדות תעופה.\n5. טיסת לילה דורשת אישור מיוחד.',
      createdAt: new Date().toISOString(),
    }
  ];

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="loading-spinner"></div>
        <p>טוען תקנות...</p>
      </div>
    );
  }

  return (
    <div className="regulations-page py-4">
      <div className="container">
        <div className="row">
          <div className="col-lg-3">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">תפריט תקנות</h5>
                <div className="list-group list-group-flush">
                  {regulations.map(regulation => (
                    <a 
                      key={regulation._id}
                      href={`#regulation-${regulation._id}`}
                      className="list-group-item list-group-item-action"
                    >
                      {regulation.title}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h5 className="card-title">קישורים חשובים</h5>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <a href="https://www.caa.gov.il" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                      <i className="bi bi-link me-2"></i>
                      רשות התעופה האזרחית
                    </a>
                  </li>
                  <li className="mb-2">
                    <a href="https://www.gov.il/he/departments/ministry_of_transportation" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                      <i className="bi bi-link me-2"></i>
                      משרד התחבורה
                    </a>
                  </li>
                  <li>
                    <a href="https://www.newo.co.il" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                      <i className="bi bi-link me-2"></i>
                      איגוד הטיסנאות הישראלי
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-lg-9">
            <div className="card">
              <div className="card-body">
                <h1 className="section-title mb-4">תקנות טיס</h1>
                <p className="lead mb-4">
                  כאן תמצאו את כל התקנות והחוקים החשובים לטיסה בטיסנים.
                  הקפדה על התקנות מבטיחה טיסה בטוחה ומהנה לכל.
                </p>

                {regulations.map(regulation => (
                  <div 
                    key={regulation._id} 
                    id={`regulation-${regulation._id}`}
                    className="regulation-section mb-5"
                  >
                    <h3 className="mb-3">{regulation.title}</h3>
                    <div className="content-box p-4 bg-light rounded">
                      {/* הצג תוכן עם שורות חדשות */}
                      {regulation.content.split('\n').map((line, index) => (
                        <p key={index} className={index > 0 ? 'mt-2' : ''}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="alert alert-warning mt-4">
                  <h5 className="alert-heading">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    חשוב לדעת
                  </h5>
                  <p className="mb-0">
                    התקנות מתעדכנות מעת לעת. מומלץ להתעדכן באתר רשות התעופה האזרחית.
                    הפרת תקנות טיס עלולה לגרום לקנסות ואף לעונשי מאסר.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegulationsPage;