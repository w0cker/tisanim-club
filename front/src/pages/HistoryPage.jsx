import React, { useState, useEffect } from 'react';
import { contentAPI } from '../services/api';
import '../styles/ContentPages.css';

const HistoryPage = () => {
  const [historyContent, setHistoryContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistoryContent();
  }, []);

  const fetchHistoryContent = async () => {
    try {
      const response = await contentAPI.getByCategory('היסטוריה');
      setHistoryContent(response.data.data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
      setHistoryContent(getDefaultHistory());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultHistory = () => [
    {
      _id: '1',
      title: 'ראשית הטיסנאות',
      content: 'התפתחות הטיסנאות בעולם החל מימיו הראשונים...',
      createdAt: new Date().toISOString(),
    },
    {
      _id: '2',
      title: 'פריצות דרך טכנולוגיות',
      content: 'חידושים ופיתוחים ששינו את עולם הטיסנאות...',
      createdAt: new Date().toISOString(),
    },
    {
      _id: '3',
      title: 'טיסנאות בישראל',
      content: 'התפתחות התחביב בישראל והקהילה המקומית...',
      createdAt: new Date().toISOString(),
    }
  ];

  const timelineEvents = [
    { year: '1903', event: 'טיסת המטוס הממונע הראשון של האחים רייט' },
    { year: '1937', event: 'פיתוח טיסני הרדיו הראשונים' },
    { year: '1960', event: 'כניסת מטוסי הסילון הראשונים לתחביב' },
    { year: '1980', event: 'מהפכת המחשבים בטיסנאות' },
    { year: '2000', event: 'עידן הדרונים והטיסה האוטונומית' },
    { year: '2020', event: 'שילוב מצלמות VR וטיסה באמצעות מציאות מדומה' }
  ];

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="loading-spinner"></div>
        <p>טוען היסטוריה...</p>
      </div>
    );
  }

  return (
    <div className="history-page py-4">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="card mb-4">
              <div className="card-body">
                <h1 className="section-title mb-4">היסטוריה של תעופה וטיסנאות</h1>
                <p className="lead mb-4">
                  מסע מרתק דרך זמן, מהחלומות הראשונים של האדם לעוף ועד לטכנולוגיות המתקדמות של היום.
                </p>

                {/* Timeline */}
                <div className="timeline-section mb-5">
                  <h3 className="mb-4">ציר זמן היסטורי</h3>
                  <div className="timeline">
                    {timelineEvents.map((item, index) => (
                      <div key={index} className="timeline-item">
                        <div className="timeline-marker"></div>
                        <div className="timeline-content">
                          <div className="timeline-year">{item.year}</div>
                          <div className="timeline-event">{item.event}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* History Content */}
                {historyContent.map(history => (
                  <div key={history._id} className="history-section mb-5">
                    <h3 className="mb-3">{history.title}</h3>
                    <div className="content-box p-4 bg-light rounded mb-3">
                      <p>{history.content}</p>
                    </div>
                  </div>
                ))}

                {/* Gallery */}
                <div className="gallery-section mb-5">
                  <h3 className="mb-4">גלריה היסטורית</h3>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <div className="history-image-card">
                        <img 
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbl_kdf8hhuoPQRjirK8_iMduj8iOBKgQmyeEfP3uj&s" 
                          alt="טיסן היסטורי"
                          className="img-fluid rounded"
                        />
                        <div className="image-caption p-2">
                          <small>טיסן עץ קלאסי משנות ה-50</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="history-image-card">
                        <img 
                          src="data:image/jpeg;base64,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" 
                          alt="טיסה היסטורית"
                          className="img-fluid rounded"
                        />
                        <div className="image-caption p-2">
                          <small>תחרות טיסנים משנות ה-70</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="history-image-card">
                        <img 
                          src="data:image/jpeg;base64,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"
                          alt="טיסן מודרני"
                          className="img-fluid rounded"
                        />
                        <div className="image-caption p-2">
                          <small>טיסן סילון מודרני</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interesting Facts */}
                <div className="facts-section">
                  <h3 className="mb-4">עובדות מעניינות</h3>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <div className="card">
                        <div className="card-body">
                          <h5 className="card-title">הטיסן הגדול ביותר</h5>
                          <p className="card-text">
                            הטיסן הגדול ביותר שנבנה אי פעם היה באורך של 12 מטרים
                            ובמוטת כנפיים של 8 מטרים.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="card">
                        <div className="card-body">
                          <h5 className="card-title">מהירות שיא</h5>
                          <p className="card-text">
                            שיא המהירות לטיסן רדיו נשלט עומד על למעלה מ-700 קמ"ש,
                            והושג על ידי טיסן סילון מיוחד.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="card">
                        <div className="card-body">
                          <h5 className="card-title">טיסה ארוכה ביותר</h5>
                          <p className="card-text">
                            שיא הטיסה הרציפה הארוכה ביותר לטיסן עומד על 48 שעות,
                            והושג עם סוללות מתקדמות וטייס אוטומטי.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="card">
                        <div className="card-body">
                          <h5 className="card-title">גובה שיא</h5>
                          <p className="card-text">
                            טיסן הדרון הגבוה ביותר טס לגובה של 11,000 מטרים,
                            גבוה יותר מהר אוורסט!
                          </p>
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
    </div>
  );
};

export default HistoryPage;