import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, coursesAPI, exchangeAPI } from '../services/api';
import '../styles/UserProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [courses, setCourses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [exchanges, setExchanges] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (user) {
      switch (activeTab) {
        case 'courses':
          fetchUserCourses();
          break;
        case 'orders':
          fetchUserOrders();
          break;
        case 'exchange':
          fetchUserExchanges();
          break;
      }
    }
  }, [user, activeTab]);

  const fetchUserProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      const userData = response.data;
      if (!userData || !userData.email) {
        throw new Error('No user data');
      }
      setUser(userData);
      setEditForm(userData);
    } catch (error) {
      console.error('Error fetching profile:', error);
      // אם לא מחובר, הפנה להתחברות
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCourses = async () => {
    try {
      if (user?.email) {
        const response = await coursesAPI.getUserCoursesByEmail(user.email);
        // console.log('User courses response:', response.data.data);
        setCourses(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching user courses:', error);
      // נתוני דמה עבור בדיקה
      setCourses(getDemoCourses());
    }
  };

  const fetchUserOrders = async () => {
    // נתוני דמה להזמנות
    try {
      // כאן יהיה קריאת API אמיתית כאשר יש endpoint להזמנות
      const demoOrders = getDemoOrders();
      setOrders(demoOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    }
  };

  const fetchUserExchanges = async () => {
    try {
      // ננסה לקבל את כל ההחלפות ולסנן לפי המייל של המשתמש
      const response = await exchangeAPI.getAll();
      const allExchanges = response.data.data || [];
      
      // בחיים האמיתיים, כל פריט החלפה יהיה משויך ל-userId
      // כרגע נשתמש ב-demo data
      const demoExchanges = getDemoExchanges();
      setExchanges(demoExchanges);
    } catch (error) {
      console.error('Error fetching exchanges:', error);
      setExchanges(getDemoExchanges());
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      // בעולם אמיתי, כאן תהיה קריאת API לעדכון הפרופיל
      console.log('Updating profile:', editForm);
      setUser(editForm);
      setEditMode(false);
      alert('הפרופיל עודכן בהצלחה!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('שגיאה בעדכון הפרופיל');
    }
  };

  // פונקציות עזר לנתוני דמה
  const getDemoCourses = () => [
    {
      _id: '1',
      name: 'קורס טיס במטוסים',
      Age: '12 מפגשים',
      courseType: 'tisan',
      CursProgres: 'בתהליך',
      email: user?.email || '',
      createdAt: new Date().toISOString()
    },
    {
      _id: '2',
      name: 'קורס טיס בדרונים',
      Age: '8 מפגשים',
      courseType: 'dron',
      CursProgres: 'הושלם',
      email: user?.email || '',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: '3',
      name: 'קורס טיס במסוקים',
      Age: '10 מפגשים',
      courseType: 'masok',
      CursProgres: 'בהרשמה',
      email: user?.email || '',
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const getDemoOrders = () => [
    {
      _id: '1',
      orderNumber: 'ORD-001',
      date: new Date().toISOString(),
      total: '450₪',
      status: 'נשלח',
      items: [
        { name: 'מטוס מתחילים', quantity: 1, price: '450₪' }
      ]
    },
    {
      _id: '2',
      orderNumber: 'ORD-002',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      total: '120₪',
      status: 'ממתין למשלוח',
      items: [
        { name: 'ערכת תיקון', quantity: 1, price: '120₪' },
        { name: 'מדחף חילוף', quantity: 2, price: '40₪' }
      ]
    }
  ];

  const getDemoExchanges = () => [
    {
      _id: '1',
      title: 'מטוס מתחילים למסירה',
      productType: 'מטוס',
      condition: 'כמעט חדש',
      price: '300₪',
      status: 'פעיל',
      owner: user?.email || '',
      createdAt: new Date().toISOString()
    },
    {
      _id: '2',
      title: 'דרון FPV להחלפה',
      productType: 'דרון',
      condition: 'משומש',
      wantedItems: 'מסוק מתחילים',
      status: 'במשא ומתן',
      owner: user?.email || '',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">טוען...</span>
        </div>
        <p className="mt-2">טוען פרופיל...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning">
          <h4>לא נמצא משתמש</h4>
          <p>אנא התחבר שוב למערכת</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/login')}
          >
            התחברות
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile py-4">
      <div className="container">
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3 mb-4">
            <div className="card profile-sidebar">
              <div className="card-body text-center">
                <div className="profile-avatar mb-3">
                  <div className="avatar-placeholder">
                    <i className="bi bi-person-circle display-4 text-primary"></i>
                  </div>
                </div>
                <h5 className="card-title">{user.name}</h5>
                <p className="text-muted">{user.email}</p>
                <div className="d-grid gap-2 mt-3">
                  <button 
                    className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('profile')}
                  >
                    <i className="bi bi-person me-2"></i>
                    פרופיל אישי
                  </button>
                  <button 
                    className={`btn ${activeTab === 'courses' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('courses')}
                  >
                    <i className="bi bi-book me-2"></i>
                    הקורסים שלי
                  </button>
                  <button 
                    className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('orders')}
                  >
                    <i className="bi bi-bag me-2"></i>
                    ההזמנות שלי
                  </button>
                  <button 
                    className={`btn ${activeTab === 'exchange' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('exchange')}
                  >
                    <i className="bi bi-arrow-left-right me-2"></i>
                    החלפות שלי
                  </button>
                  <button 
                    className="btn btn-outline-danger"
                    onClick={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('user');
                      navigate('/login');
                    }}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    התנתק
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            {activeTab === 'profile' && (
              <ProfileTab 
                user={user}
                editMode={editMode}
                editForm={editForm}
                setEditMode={setEditMode}
                setEditForm={setEditForm}
                handleInputChange={handleInputChange}
                handleSaveProfile={handleSaveProfile}
              />
            )}

            {activeTab === 'courses' && (
              <CoursesTab 
                courses={courses}
                user={user}
              />
            )}

            {activeTab === 'orders' && (
              <OrdersTab 
                orders={orders}
              />
            )}

            {activeTab === 'exchange' && (
              <ExchangeTab 
                exchanges={exchanges}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// קומפוננטת פרופיל
const ProfileTab = ({ 
  user, 
  editMode, 
  editForm, 
  setEditMode, 
  setEditForm, 
  handleInputChange, 
  handleSaveProfile 
}) => (
  <div className="card">
    <div className="card-body">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">פרופיל אישי</h4>
        {!editMode ? (
          <button 
            className="btn btn-outline-primary"
            onClick={() => setEditMode(true)}
          >
            <i className="bi bi-pencil me-2"></i>
            ערוך פרופיל
          </button>
        ) : (
          <div className="d-flex gap-2">
            <button 
              className="btn btn-primary"
              onClick={handleSaveProfile}
            >
              <i className="bi bi-check me-2"></i>
              שמור שינויים
            </button>
            <button 
              className="btn btn-outline-secondary"
              onClick={() => {
                setEditMode(false);
                setEditForm(user);
              }}
            >
              <i className="bi bi-x me-2"></i>
              ביטול
            </button>
          </div>
        )}
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">שם מלא</label>
          {editMode ? (
            <input
              type="text"
              className="form-control"
              name="name"
              value={editForm.name || ''}
              onChange={handleInputChange}
            />
          ) : (
            <p className="form-control-plaintext">{user.name}</p>
          )}
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">אימייל</label>
          {editMode ? (
            <input
              type="email"
              className="form-control"
              name="email"
              value={editForm.email || ''}
              onChange={handleInputChange}
              disabled
            />
          ) : (
            <p className="form-control-plaintext">{user.email}</p>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">טלפון</label>
          {editMode ? (
            <input
              type="tel"
              className="form-control"
              name="phone"
              value={editForm.phone || ''}
              onChange={handleInputChange}
              placeholder="הכנס מספר טלפון"
            />
          ) : (
            <p className="form-control-plaintext">{user.phone || 'לא עודכן'}</p>
          )}
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">עיר</label>
          {editMode ? (
            <input
              type="text"
              className="form-control"
              name="city"
              value={editForm.city || ''}
              onChange={handleInputChange}
              placeholder="הכנס עיר מגורים"
            />
          ) : (
            <p className="form-control-plaintext">{user.city || 'לא עודכן'}</p>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">תאריך הצטרפות</label>
          <p className="form-control-plaintext">
            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('he-IL') : 'לא ידוע'}
          </p>
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">סטטוס</label>
          <p className="form-control-plaintext">
            <span className="badge bg-success">משתמש פעיל</span>
          </p>
        </div>
      </div>
    </div>
  </div>
);

// קומפוננטת קורסים
const CoursesTab = ({ courses, user }) => (
  <div className="card">
    <div className="card-body">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">הקורסים שלי</h4>
        <a href="/courses" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>
          הרשם לקורס נוסף
        </a>
      </div>
      
      {courses.length === 0 ? (
        <div className="text-center py-4">
          <i className="bi bi-book display-4 text-muted mb-3"></i>
          <h5>אין קורסים רשומים</h5>
          <p className="text-muted mb-4">עדיין לא נרשמת לאף קורס</p>
          <a href="/courses" className="btn btn-primary">
            <i className="bi bi-plus-circle me-2"></i>
            הרשם לקורס
          </a>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>שם הקורס</th>
                <th>משך הקורס</th>
                <th>תאריך הרשמה</th>
                <th>מצב</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course._id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-book me-2 text-primary"></i>
                      <div>
                        <strong>{course.name || `קורס ${course.courseType || 'טיסה'}`}</strong>
                        <div className="text-muted small">
                          {course.courseType === 'tisan' ? 'מטוסים' : 
                           course.courseType === 'masok' ? 'מסוקים' : 'דרונים'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{course.Age || 'לא צוין'}</td>
                  <td>
                    {course.createdAt ? new Date(course.createdAt).toLocaleDateString('he-IL') : 'לא ידוע'}
                  </td>
                  <td>
                    <span className={`badge ${
                      course.CursProgres === 'הושלם' ? 'bg-success' :
                      course.CursProgres === 'בתהליך' ? 'bg-warning' :
                      course.CursProgres === 'בהרשמה' ? 'bg-info' :
                      'bg-secondary'
                    }`}>
                      {course.CursProgres || 'בהרשמה'}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button className="btn btn-outline-primary" title="צפה בפרטים">
                        <i className="bi bi-eye"></i>
                      </button>
                      <button className="btn btn-outline-secondary" title="הורד תעודה">
                        <i className="bi bi-download"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-4">
        <div className="alert alert-info">
          <h6 className="alert-heading">
            <i className="bi bi-info-circle me-2"></i>
            מידע חשוב על הקורסים:
          </h6>
          <ul className="mb-0">
            <li>לחץ על "צפה בפרטים" לצפייה במערכי השיעורים</li>
            <li>לאחר סיום הקורס תוכל להוריד תעודת סיום</li>
            <li>בעיות טכניות? צור קשר עם המדריך שלך</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

// קומפוננטת הזמנות
const OrdersTab = ({ orders }) => (
  <div className="card">
    <div className="card-body">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">ההזמנות שלי</h4>
        <a href="/products" className="btn btn-primary">
          <i className="bi bi-shop me-2"></i>
          המשך לקנות
        </a>
      </div>
      
      {orders.length === 0 ? (
        <div className="text-center py-4">
          <i className="bi bi-bag display-4 text-muted mb-3"></i>
          <h5>אין הזמנות</h5>
          <p className="text-muted mb-4">עדיין לא ביצעת הזמנות בחנות</p>
          <a href="/products" className="btn btn-primary">
            <i className="bi bi-shop me-2"></i>
            המשך לקנות
          </a>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>מספר הזמנה</th>
                  <th>תאריך</th>
                  <th>סכום</th>
                  <th>סטטוס</th>
                  <th>פריטים</th>
                  <th>פעולות</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td>
                      <strong>{order.orderNumber}</strong>
                    </td>
                    <td>
                      {order.date ? new Date(order.date).toLocaleDateString('he-IL') : 'לא ידוע'}
                    </td>
                    <td>
                      <span className="fw-bold text-primary">{order.total}</span>
                    </td>
                    <td>
                      <span className={`badge ${
                        order.status === 'נשלח' ? 'bg-success' :
                        order.status === 'ממתין למשלוח' ? 'bg-warning' :
                        order.status === 'מבוטל' ? 'bg-danger' :
                        'bg-secondary'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <small>
                        {order.items?.map((item, idx) => (
                          <div key={idx}>
                            {item.name} (x{item.quantity}) - {item.price}
                          </div>
                        ))}
                      </small>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-primary" title="צפה בהזמנה">
                          <i className="bi bi-eye"></i>
                        </button>
                        <button className="btn btn-outline-success" title="הדפס חשבונית">
                          <i className="bi bi-printer"></i>
                        </button>
                        {order.status === 'ממתין למשלוח' && (
                          <button className="btn btn-outline-danger" title="בטל הזמנה">
                            <i className="bi bi-x-circle"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4">
            <div className="alert alert-warning">
              <h6 className="alert-heading">
                <i className="bi bi-clock-history me-2"></i>
                הערות חשובות:
              </h6>
              <ul className="mb-0">
                <li>זמן אספקה ממוצע: 3-5 ימי עסקים</li>
                <li>ניתן לבטל הזמנה עד 24 שעות ממועד ההזמנה</li>
                <li>לשאלות על משלוח - פנה לשירות הלקוחות</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  </div>
);

// קומפוננטת החלפות
const ExchangeTab = ({ exchanges }) => (
  <div className="card">
    <div className="card-body">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">החלפות שלי</h4>
        <a href="/exchange" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>
          פרסם מודעה חדשה
        </a>
      </div>
      
      {exchanges.length === 0 ? (
        <div className="text-center py-4">
          <i className="bi bi-arrow-left-right display-4 text-muted mb-3"></i>
          <h5>אין מודעות החלפה</h5>
          <p className="text-muted mb-4">עדיין לא פרסמת מודעות להחלפה</p>
          <a href="/exchange" className="btn btn-primary">
            <i className="bi bi-plus-circle me-2"></i>
            פרסם מודעה
          </a>
        </div>
      ) : (
        <>
          <div className="row">
            {exchanges.map(exchange => (
              <div key={exchange._id} className="col-md-6 mb-3">
                <div className="card card-hover h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className={`badge ${
                        exchange.status === 'פעיל' ? 'bg-success' :
                        exchange.status === 'במשא ומתן' ? 'bg-warning' :
                        exchange.status === 'הוחלף' ? 'bg-info' :
                        exchange.status === 'בוטל' ? 'bg-danger' :
                        'bg-secondary'
                      }`}>
                        {exchange.status}
                      </span>
                      <small className="text-muted">
                        {exchange.createdAt ? new Date(exchange.createdAt).toLocaleDateString('he-IL') : 'לא ידוע'}
                      </small>
                    </div>
                    
                    <h5 className="card-title">{exchange.title}</h5>
                    <p className="card-text text-muted">
                      <i className={`bi ${
                        exchange.productType === 'מטוס' ? 'bi-airplane' :
                        exchange.productType === 'מסוק' ? 'bi-helicopter' :
                        exchange.productType === 'דרון' ? 'bi-camera-video' :
                        'bi-box'
                      } me-2`}></i>
                      {exchange.productType}
                    </p>
                    
                    <div className="mb-3">
                      <small className="text-muted d-block">מצב:</small>
                      <strong>{exchange.condition}</strong>
                    </div>
                    
                    {exchange.price && (
                      <div className="mb-3">
                        <small className="text-muted d-block">מחיר:</small>
                        <span className="h5 text-primary">{exchange.price}</span>
                      </div>
                    )}
                    
                    {exchange.wantedItems && (
                      <div className="mb-3">
                        <small className="text-muted d-block">מחפש להחליף ב:</small>
                        <p className="mb-0">{exchange.wantedItems}</p>
                      </div>
                    )}
                    
                    <div className="d-grid gap-2">
                      <button className="btn btn-outline-primary">
                        <i className="bi bi-pencil me-2"></i>
                        ערוך
                      </button>
                      <button className="btn btn-outline-danger">
                        <i className="bi bi-trash me-2"></i>
                        הסר
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <div className="alert alert-info">
              <h6 className="alert-heading">
                <i className="bi bi-lightbulb me-2"></i>
                טיפים להחלפה בטוחה:
              </h6>
              <ul className="mb-0">
                <li>נפגש במקום ציבורי ובשעות היום</li>
                <li>בדוק את הפריט היטב לפני ההחלפה</li>
                <li>השתמש באפשרות "במשא ומתן" כדי לדון בתנאים</li>
                <li>דווח על בעיות לשירות הלקוחות</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  </div>
);

export default UserProfile;