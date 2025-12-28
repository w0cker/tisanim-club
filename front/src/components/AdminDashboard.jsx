import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  authAPI, 
  productsAPI, 
  coursesAPI, 
  exchangeAPI, 
  contentAPI,
  contactAPI 
} from '../services/api';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    courses: 0,
    exchanges: 0,
    contacts: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
    fetchStats();
  }, []);

  const checkAdminAccess = () => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    
    if (!storedUser || storedUser.role !== 'admin' || !token) {
      navigate('/login');
      return;
    }
    
    setUser(storedUser);
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      const [usersRes, productsRes, tisanRes, masokRes, dronRes, exchangeRes, contactsRes] = await Promise.all([
        authAPI.getAllUsers().catch(() => ({ data: { data: [] } })),
        productsAPI.getAllProducts().catch(() => ({ data: { data: [] } })),
        coursesAPI.getTisanCourses().catch(() => ({ data: { data: [] } })),
        coursesAPI.getMasokCourses().catch(() => ({ data: { data: [] } })),
        coursesAPI.getDronCourses().catch(() => ({ data: { data: [] } })),
        exchangeAPI.getAll().catch(() => ({ data: { data: [] } })),
        contactAPI.getAll().catch(() => ({ data: { data: [] } }))
      ]);

      setStats({
        users: usersRes.data.data?.length || 0,
        products: productsRes.data.data?.length || 0,
        courses: (tisanRes.data.data?.length || 0) + 
                (masokRes.data.data?.length || 0) + 
                (dronRes.data.data?.length || 0),
        exchanges: exchangeRes.data.data?.length || 0,
        contacts: contactsRes.data.data?.length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">טוען...</span>
        </div>
        <p className="mt-2">טוען לוח בקרה...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-2 bg-dark text-white min-vh-100 p-0">
            <div className="sidebar-sticky pt-3">
              <div className="sidebar-header text-center py-4 border-bottom">
                <h4 className="mb-0">
                  <i className="bi bi-speedometer2 me-2"></i>
                  לוח בקרה
                </h4>
                <small className="text-muted">מנהל מערכת</small>
              </div>
              
              <ul className="nav flex-column">
                <li className="nav-item">
                  <button
                    className={`nav-link btn btn-link text-start w-100 ${activeTab === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dashboard')}
                  >
                    <i className="bi bi-speedometer2 me-2"></i>
                    סטטיסטיקות
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link btn btn-link text-start w-100 ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                  >
                    <i className="bi bi-people me-2"></i>
                    משתמשים
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link btn btn-link text-start w-100 ${activeTab === 'products' ? 'active' : ''}`}
                    onClick={() => setActiveTab('products')}
                  >
                    <i className="bi bi-box-seam me-2"></i>
                    מוצרים
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link btn btn-link text-start w-100 ${activeTab === 'courses' ? 'active' : ''}`}
                    onClick={() => setActiveTab('courses')}
                  >
                    <i className="bi bi-book me-2"></i>
                    קורסים
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link btn btn-link text-start w-100 ${activeTab === 'exchanges' ? 'active' : ''}`}
                    onClick={() => setActiveTab('exchanges')}
                  >
                    <i className="bi bi-arrow-left-right me-2"></i>
                    החלפות
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link btn btn-link text-start w-100 ${activeTab === 'content' ? 'active' : ''}`}
                    onClick={() => setActiveTab('content')}
                  >
                    <i className="bi bi-file-text me-2"></i>
                    תוכן
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link btn btn-link text-start w-100 ${activeTab === 'contacts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('contacts')}
                  >
                    <i className="bi bi-envelope me-2"></i>
                    פניות צור קשר
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link btn btn-link text-start w-100 ${activeTab === 'settings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('settings')}
                  >
                    <i className="bi bi-gear me-2"></i>
                    הגדרות
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-10 p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="mb-0">
                {activeTab === 'dashboard' && 'סטטיסטיקות מערכת'}
                {activeTab === 'users' && 'ניהול משתמשים'}
                {activeTab === 'products' && 'ניהול מוצרים'}
                {activeTab === 'courses' && 'ניהול קורסים'}
                {activeTab === 'exchanges' && 'ניהול החלפות'}
                {activeTab === 'content' && 'ניהול תוכן'}
                {activeTab === 'contacts' && 'פניות צור קשר'}
                {activeTab === 'settings' && 'הגדרות מערכת'}
              </h2>
              <div className="d-flex align-items-center">
                <span className="me-3">שלום, {user?.name}</span>
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/');
                  }}
                >
                  <i className="bi bi-box-arrow-right me-1"></i>
                  יציאה
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'dashboard' && <DashboardTab stats={stats} />}
            {activeTab === 'users' && <UsersTab />}
            {activeTab === 'products' && <ProductsTab />}
            {activeTab === 'courses' && <CoursesTab />}
            {activeTab === 'exchanges' && <ExchangesTab />}
            {activeTab === 'content' && <ContentTab />}
            {activeTab === 'contacts' && <ContactsTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Component
const DashboardTab = ({ stats }) => (
  <div className="dashboard-tab">
    <div className="row mb-4">
      <div className="col-md-3 mb-3">
        <div className="card bg-primary text-white">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <h5 className="card-title">משתמשים</h5>
                <h2 className="mb-0">{stats.users}</h2>
              </div>
              <i className="bi bi-people display-4 opacity-50"></i>
            </div>
            <p className="card-text mt-2">מספר משתמשים רשומים</p>
          </div>
        </div>
      </div>
      <div className="col-md-3 mb-3">
        <div className="card bg-success text-white">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <h5 className="card-title">מוצרים</h5>
                <h2 className="mb-0">{stats.products}</h2>
              </div>
              <i className="bi bi-box-seam display-4 opacity-50"></i>
            </div>
            <p className="card-text mt-2">מספר מוצרים בחנות</p>
          </div>
        </div>
      </div>
      <div className="col-md-3 mb-3">
        <div className="card bg-warning text-white">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <h5 className="card-title">קורסים</h5>
                <h2 className="mb-0">{stats.courses}</h2>
              </div>
              <i className="bi bi-book display-4 opacity-50"></i>
            </div>
            <p className="card-text mt-2">מספר הרשמות לקורסים</p>
          </div>
        </div>
      </div>
      <div className="col-md-3 mb-3">
        <div className="card bg-info text-white">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <h5 className="card-title">החלפות</h5>
                <h2 className="mb-0">{stats.exchanges}</h2>
              </div>
              <i className="bi bi-arrow-left-right display-4 opacity-50"></i>
            </div>
            <p className="card-text mt-2">מספר מודעות החלפה</p>
          </div>
        </div>
      </div>
      <div className="col-md-3 mb-3">
        <div className="card bg-secondary text-white">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <h5 className="card-title">פניות</h5>
                <h2 className="mb-0">{stats.contacts}</h2>
              </div>
              <i className="bi bi-envelope display-4 opacity-50"></i>
            </div>
            <p className="card-text mt-2">מספר פניות מצור קשר</p>
          </div>
        </div>
      </div>
    </div>

    {/* Recent Activity */}
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title mb-4">פעילות אחרונה</h5>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>סוג פעילות</th>
                    <th>פרטים</th>
                    <th>תאריך</th>
                    <th>סטטוס</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>הרשמה חדשה</td>
                    <td>משתמש חדש נרשם למערכת</td>
                    <td>היום, 10:30</td>
                    <td><span className="badge bg-success">בוצע</span></td>
                  </tr>
                  <tr>
                    <td>הוספת מוצר</td>
                    <td>מטוס מתקדם נוסף לחנות</td>
                    <td>אתמול, 14:20</td>
                    <td><span className="badge bg-success">בוצע</span></td>
                  </tr>
                  <tr>
                    <td>הרשמה לקורס</td>
                    <td>הרשמה חדשה לקורס דרונים</td>
                    <td>לפני יומיים, 09:15</td>
                    <td><span className="badge bg-warning">בטיפול</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Users Management Component
const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await authAPI.getAllUsers();
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק משתמש זה?')) {
      try {
        // This would be an actual API call in production
        console.log('Deleting user:', userId);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setUsers(users.filter(user => user._id !== userId));
        alert('משתמש נמחק בהצלחה');
      } catch (error) {
        alert('שגיאה במחיקת המשתמש');
      }
    }
  };

  const handleSaveUser = async (updatedUser) => {
    try {
      // This would be an actual API call in production
      console.log('Saving user:', updatedUser);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUsers(users.map(user => 
        user._id === updatedUser._id ? updatedUser : user
      ));
      
      setShowEditModal(false);
      setSelectedUser(null);
      alert('משתמש עודכן בהצלחה');
    } catch (error) {
      alert('שגיאה בעדכון המשתמש');
    }
  };

  return (
    <div className="users-tab">
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="card-title mb-0">רשימת משתמשים</h5>
            <button className="btn btn-primary">
              <i className="bi bi-plus-circle me-2"></i>
              הוסף משתמש חדש
            </button>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">טוען...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>שם</th>
                    <th>אימייל</th>
                    <th>טלפון</th>
                    <th>עיר</th>
                    <th>תפקיד</th>
                    <th>תאריך הצטרפות</th>
                    <th>פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone || '-'}</td>
                      <td>{user.city || '-'}</td>
                      <td>
                        <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>
                          {user.role === 'admin' ? 'מנהל' : 'משתמש'}
                        </span>
                      </td>
                      <td>
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('he-IL') : '-'}
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button 
                            className="btn btn-outline-primary"
                            onClick={() => handleEditUser(user)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button 
                            className="btn btn-outline-danger"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onSave={handleSaveUser}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};

// Edit User Modal Component
const EditUserModal = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState({ ...user });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">עריכת משתמש</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">שם מלא</label>
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
                <label className="form-label">אימייל</label>
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
                <label className="form-label">טלפון</label>
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">עיר</label>
                <input
                  type="text"
                  className="form-control"
                  name="city"
                  value={formData.city || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">תפקיד</label>
                <select
                  className="form-select"
                  name="role"
                  value={formData.role || 'user'}
                  onChange={handleInputChange}
                >
                  <option value="user">משתמש</option>
                  <option value="admin">מנהל</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                ביטול
              </button>
              <button type="submit" className="btn btn-primary">
                שמור שינויים
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Products Management Component
const ProductsTab = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAllProducts();
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק מוצר זה?')) {
      try {
        await productsAPI.delete(productId);
        setProducts(products.filter(p => p._id !== productId));
        alert('מוצר נמחק בהצלחה');
      } catch (error) {
        alert('שגיאה במחיקת המוצר');
      }
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      // Process data to match Products model
      const processedData = {
        name: productData.name,
        specification: productData.specification,
        category: productData.category,
        cost: String(productData.cost), // Convert to string as per model
        onStock: productData.onStock,
        countItems: Number(productData.countItems) || 0
      };

      if (productData._id) {
        // Update existing product
        await productsAPI.updateProduct(productData._id, processedData);
        setProducts(products.map(p => 
          p._id === productData._id ? { ...p, ...processedData } : p
        ));
      } else {
        // Create new product
        const response = await productsAPI.createProduct(processedData);
        setProducts([...products, response.data.data]);
      }
      setShowAddModal(false);
      setEditProduct(null);
      alert('מוצר נשמר בהצלחה');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('שגיאה בשמירת המוצר');
    }
  };

  return (
    <div className="products-tab">
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="card-title mb-0">ניהול מוצרים</h5>
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              <i className="bi bi-plus-circle me-2"></i>
              הוסף מוצר חדש
            </button>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">טוען...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>שם מוצר</th>
                    <th>קטגוריה</th>
                    <th>מחיר</th>
                    <th>מלאי</th>
                    <th>סטטוס</th>
                    <th>תאריך הוספה</th>
                    <th>פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id}>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>{product.cost}</td>
                      <td>{product.countItems || 0}</td>
                      <td>
                        <span className={`badge ${product.onStock ? 'bg-success' : 'bg-danger'}`}>
                          {product.onStock ? 'במלאי' : 'אזל המלאי'}
                        </span>
                      </td>
                      <td>
                        {product.createdAt ? new Date(product.createdAt).toLocaleDateString('he-IL') : '-'}
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button 
                            className="btn btn-outline-primary"
                            onClick={() => {
                              setEditProduct(product);
                              setShowAddModal(true);
                            }}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button 
                            className="btn btn-outline-danger"
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {showAddModal && (
        <ProductModal
          product={editProduct}
          onSave={handleSaveProduct}
          onClose={() => {
            setShowAddModal(false);
            setEditProduct(null);
          }}
        />
      )}
    </div>
  );
};

// Product Modal Component
const ProductModal = ({ product, onSave, onClose }) => {
  const [formData, setFormData] = useState(product ? { ...product } : {
    name: '',
    specification: '',
    cost: '',
    category: 'מטוסים',
    countItems: 0,
    onStock: true
  });

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? e.target.checked : value 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{product ? 'עריכת מוצר' : 'הוספת מוצר חדש'}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">שם המוצר *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    maxLength="70"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">קטגוריה *</label>
                  <select
                    className="form-select"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="מטוסים">מטוסים</option>
                    <option value="מסוקים">מסוקים</option>
                    <option value="דרונים">דרונים</option>
                    <option value="חלקי חילוף">חלקי חילוף</option>
                    <option value="קיטים">קיטים</option>
                    <option value="אביזרים">אביזרים</option>
                    <option value="אחר">אחר</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">תיאור המוצר *</label>
                <textarea
                  className="form-control"
                  name="specification"
                  value={formData.specification}
                  onChange={handleInputChange}
                  rows="3"
                  required
                  maxLength="250"
                ></textarea>
                <small className="text-muted">{formData.specification.length}/250 תווים</small>
              </div>

              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">מחיר (₪) *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="cost"
                    value={formData.cost}
                    onChange={handleInputChange}
                    required
                    maxLength="10"
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">כמות במלאי</label>
                  <input
                    type="number"
                    className="form-control"
                    name="countItems"
                    value={formData.countItems}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">תמונה URL</label>
                  <input
                    type="url"
                    className="form-control"
                    name="image"
                    value={formData.image || ''}
                    onChange={handleInputChange}
                    placeholder="הכנס קישור לתמונה"
                  />
                </div>
              </div>

              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="onStock"
                  checked={formData.onStock}
                  onChange={handleInputChange}
                  id="onStock"
                />
                <label className="form-check-label" htmlFor="onStock">
                  מוצר במלאי
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                ביטול
              </button>
              <button type="submit" className="btn btn-primary">
                {product ? 'עדכן מוצר' : 'הוסף מוצר'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Courses Management Component
const CoursesTab = () => {
  const [courses, setCourses] = useState({
    tisan: [],
    masok: [],
    dron: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const [tisanRes, masokRes, dronRes] = await Promise.all([
        coursesAPI.getTisanCourses(),
        coursesAPI.getMasokCourses(),
        coursesAPI.getDronCourses()
      ]);

      setCourses({
        tisan: tisanRes.data.data || [],
        masok: masokRes.data.data || [],
        dron: dronRes.data.data || []
      });
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCourseTypeName = (type) => {
    switch (type) {
      case 'tisan': return 'מטוסים';
      case 'masok': return 'מסוקים';
      case 'dron': return 'דרונים';
      default: return type;
    }
  };

  const allCourses = [
    ...courses.tisan.map(c => ({ ...c, type: 'tisan' })),
    ...courses.masok.map(c => ({ ...c, type: 'masok' })),
    ...courses.dron.map(c => ({ ...c, type: 'dron' }))
  ];

  return (
    <div className="courses-tab">
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="card-title mb-0">ניהול הרשמות לקורסים</h5>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">טוען...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>שם המשתתף</th>
                    <th>אימייל</th>
                    <th>סוג קורס</th>
                    <th>גיל</th>
                    <th>סטטוס התקדמות</th>
                    <th>תאריך הרשמה</th>
                    <th>פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {allCourses.map(course => (
                    <tr key={`${course.type}-${course._id}`}>
                      <td>{course.name}</td>
                      <td>{course.email}</td>
                      <td>
                        <span className="badge bg-info">
                          {getCourseTypeName(course.type)}
                        </span>
                      </td>
                      <td>{course.Age || '-'}</td>
                      <td>
                        <span className={`badge ${
                          course.CursProgres === 'הושלם' ? 'bg-success' :
                          course.CursProgres === 'בתהליך' ? 'bg-warning' :
                          'bg-secondary'
                        }`}>
                          {course.CursProgres || 'בהרשמה'}
                        </span>
                      </td>
                      <td>
                        {course.createdAt ? new Date(course.createdAt).toLocaleDateString('he-IL') : '-'}
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button className="btn btn-outline-primary">
                            <i className="bi bi-eye"></i>
                          </button>
                          <button className="btn btn-outline-success">
                            <i className="bi bi-check-circle"></i>
                          </button>
                          <button className="btn btn-outline-danger">
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Exchanges Management Component
const ExchangesTab = () => {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExchanges();
  }, []);

  const fetchExchanges = async () => {
    try {
      const response = await exchangeAPI.getAll();
      setExchanges(response.data.data || []);
    } catch (error) {
      console.error('Error fetching exchanges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExchange = async (id) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק מודעה זו?')) {
      try {
        await exchangeAPI.delete(id);
        setExchanges(exchanges.filter(e => e._id !== id));
        alert('מודעה נמחקה בהצלחה');
      } catch (error) {
        alert('שגיאה במחיקת המודעה');
      }
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await exchangeAPI.update(id, { status: newStatus });
      setExchanges(exchanges.map(e => 
        e._id === id ? { ...e, status: newStatus } : e
      ));
      alert('סטטוס עודכן בהצלחה');
    } catch (error) {
      alert('שגיאה בעדכון הסטטוס');
    }
  };

  return (
    <div className="exchanges-tab">
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="card-title mb-0">ניהול מודעות החלפה</h5>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">טוען...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>כותרת</th>
                    <th>סוג מוצר</th>
                    <th>מצב</th>
                    <th>מחיר</th>
                    <th>מיקום</th>
                    <th>מחפש להחליף</th>
                    <th>סטטוס</th>
                    <th>תאריך פרסום</th>
                    <th>פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {exchanges.map(exchange => (
                    <tr key={exchange._id}>
                      <td>{exchange.title}</td>
                      <td>{exchange.productType}</td>
                      <td>{exchange.condition}</td>
                      <td>{exchange.price ? `₪${exchange.price}` : '-'}</td>
                      <td>{exchange.location}</td>
                      <td>
                        <small>{exchange.wantedItems ? exchange.wantedItems.substring(0, 30) + '...' : '-'}</small>
                      </td>
                      <td>
                        <select 
                          className="form-select form-select-sm"
                          value={exchange.status}
                          onChange={(e) => handleUpdateStatus(exchange._id, e.target.value)}
                          style={{ width: 'auto', display: 'inline-block' }}
                        >
                          <option value="פעיל">פעיל</option>
                          <option value="במשא ומתן">במשא ומתן</option>
                          <option value="הוחלף">הוחלף</option>
                          <option value="בוטל">בוטל</option>
                        </select>
                      </td>
                      <td>
                        {exchange.createdAt ? new Date(exchange.createdAt).toLocaleDateString('he-IL') : '-'}
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button className="btn btn-outline-primary">
                            <i className="bi bi-eye"></i>
                          </button>
                          <button className="btn btn-outline-warning">
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button 
                            className="btn btn-outline-danger"
                            onClick={() => handleDeleteExchange(exchange._id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Content Management Component
const ContentTab = () => {
  const [activeContentTab, setActiveContentTab] = useState('regulations');
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [currentContent, setCurrentContent] = useState(null);

  const contentTypes = [
    { id: 'regulations', label: 'תקנות טיס', icon: 'bi-file-text' },
    { id: 'safety', label: 'בטיחות', icon: 'bi-shield-check' },
    { id: 'history', label: 'היסטוריה', icon: 'bi-clock-history' },
    { id: 'guides', label: 'מדריכים', icon: 'bi-book' }
  ];

  const fetchContent = async (type) => {
    setLoading(true);
    try {
      const category = 
        type === 'regulations' ? 'תקנות טיס' :
        type === 'safety' ? 'בטיחות' :
        type === 'history' ? 'היסטוריה' : 'מדריכים';
      
      const response = await contentAPI.getByCategory(category);
      setContent(response.data.data || []);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent(activeContentTab);
  }, [activeContentTab]);

  const handleEditContent = (item) => {
    setCurrentContent(item);
    setShowEditor(true);
  };

  const handleSaveContent = async (updatedContent) => {
    try {
      if (updatedContent._id) {
        await contentAPI.update(updatedContent._id, updatedContent);
      } else {
        await contentAPI.create(updatedContent);
      }
      fetchContent(activeContentTab);
      setShowEditor(false);
      setCurrentContent(null);
      alert('תוכן נשמר בהצלחה');
    } catch (error) {
      alert('שגיאה בשמירת התוכן');
    }
  };

  const handleDeleteContent = async (id) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק תוכן זה?')) {
      try {
        await contentAPI.delete(id);
        fetchContent(activeContentTab);
        alert('תוכן נמחק בהצלחה');
      } catch (error) {
        alert('שגיאה במחיקת התוכן');
      }
    }
  };

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      await contentAPI.update(id, { isPublished: !currentStatus });
      fetchContent(activeContentTab);
      alert(`תוכן ${!currentStatus ? 'פורסם' : 'הוסתר'} בהצלחה`);
    } catch (error) {
      alert('שגיאה בעדכון סטטוס התוכן');
    }
  };

  return (
    <div className="content-tab">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-4">ניהול תוכן האתר</h5>

          {/* Content Type Tabs */}
          <ul className="nav nav-tabs mb-4">
            {contentTypes.map(type => (
              <li className="nav-item" key={type.id}>
                <button
                  className={`nav-link ${activeContentTab === type.id ? 'active' : ''}`}
                  onClick={() => setActiveContentTab(type.id)}
                >
                  <i className={`bi ${type.icon} me-2`}></i>
                  {type.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6>רשימת תוכן - {contentTypes.find(t => t.id === activeContentTab)?.label}</h6>
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => {
                setCurrentContent({
                  title: '',
                  content: '',
                  category: activeContentTab === 'regulations' ? 'תקנות טיס' :
                           activeContentTab === 'safety' ? 'בטיחות' :
                           activeContentTab === 'history' ? 'היסטוריה' : 'מדריכים',
                  author: 'מנהל המערכת',
                  tags: [],
                  isPublished: true
                });
                setShowEditor(true);
              }}
            >
              <i className="bi bi-plus-circle me-2"></i>
              הוסף תוכן חדש
            </button>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">טוען...</span>
              </div>
            </div>
          ) : (
            <div className="row">
              {content.map(item => (
                <div key={item._id} className="col-md-6 mb-3">
                  <div className="card card-hover h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="card-title mb-0">{item.title}</h6>
                        <span className={`badge ${item.isPublished ? 'bg-success' : 'bg-secondary'}`}>
                          {item.isPublished ? 'פורסם' : 'בטוחה'}
                        </span>
                      </div>
                      <p className="card-text small text-muted">
                        {item.content.substring(0, 100)}...
                      </p>
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <div>
                          <small className="text-muted">
                            מאת: {item.author || 'מנהל המערכת'}
                          </small>
                          <br />
                          <small className="text-muted">
                            תגיות: {item.tags?.join(', ') || 'ללא תגיות'}
                          </small>
                        </div>
                        <div className="btn-group btn-group-sm">
                          <button 
                            className="btn btn-outline-primary"
                            onClick={() => handleEditContent(item)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button 
                            className="btn btn-outline-secondary"
                            onClick={() => handleTogglePublish(item._id, item.isPublished)}
                          >
                            <i className={`bi ${item.isPublished ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                          </button>
                          <button 
                            className="btn btn-outline-danger"
                            onClick={() => handleDeleteContent(item._id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content Editor Modal */}
      {showEditor && currentContent && (
        <ContentEditor
          content={currentContent}
          onSave={handleSaveContent}
          onClose={() => {
            setShowEditor(false);
            setCurrentContent(null);
          }}
        />
      )}
    </div>
  );
};

// Content Editor Component
const ContentEditor = ({ content, onSave, onClose }) => {
  const [formData, setFormData] = useState({ ...content });
  const [tagsInput, setTagsInput] = useState(formData.tags?.join(', ') || '');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert tags input to array
    const processedData = {
      ...formData,
      tags: tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    };
    
    onSave(processedData);
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{content._id ? 'עריכת תוכן' : 'הוספת תוכן חדש'}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">כותרת *</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  maxLength="100"
                />
                <small className="text-muted">{formData.title.length}/100 תווים</small>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">קטגוריה *</label>
                  <select
                    className="form-select"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="תקנות טיס">תקנות טיס</option>
                    <option value="בטיחות">בטיחות</option>
                    <option value="היסטוריה">היסטוריה</option>
                    <option value="מדריכים">מדריכים</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">מחבר</label>
                  <input
                    type="text"
                    className="form-control"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">תגיות (מופרדות בפסיקים)</label>
                <input
                  type="text"
                  className="form-control"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="דרונים, בטיחות, תקנות..."
                />
                <small className="text-muted">לדוגמה: דרונים, בטיחות, תקנות</small>
              </div>

              <div className="mb-3">
                <label className="form-label">תוכן *</label>
                <textarea
                  className="form-control"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows="10"
                  required
                ></textarea>
                <small className="text-muted">ניתן להשתמש בשורות חדשות (Enter) לפורמט טוב יותר</small>
              </div>

              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleInputChange}
                  id="isPublished"
                />
                <label className="form-check-label" htmlFor="isPublished">
                  פרסם תוכן זה
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                ביטול
              </button>
              <button type="submit" className="btn btn-primary">
                {content._id ? 'עדכן תוכן' : 'הוסף תוכן'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Contacts Management Component
const ContactsTab = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await contactAPI.getAll();
      setContacts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = (contact) => {
    setSelectedContact(contact);
    setShowResponseModal(true);
  };

  const handleDeleteContact = async (contactId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק פנייה זו?')) {
      try {
        await contactAPI.delete(contactId);
        setContacts(contacts.filter(c => c._id !== contactId));
        alert('פנייה נמחקה בהצלחה');
      } catch (error) {
        alert('שגיאה במחיקת הפנייה');
      }
    }
  };

  const handleSendResponse = async (responseText) => {
    try {
      if (!selectedContact) return;
      
      const responseData = {
        Info_res: responseText,
        respondedAt: new Date().toISOString()
      };
      
      await contactAPI.update(selectedContact._id, responseData);
      
      // עדכון הרשימה המקומית
      setContacts(contacts.map(contact => 
        contact._id === selectedContact._id 
          ? { ...contact, Info_res: responseText }
          : contact
      ));
      
      setShowResponseModal(false);
      setSelectedContact(null);
      alert('תגובה נשלחה בהצלחה');
    } catch (error) {
      alert('שגיאה בשליחת התגובה');
    }
  };

  return (
    <div className="contacts-tab">
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="card-title mb-0">פניות צור קשר</h5>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">טוען...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>שם</th>
                    <th>אימייל</th>
                    <th>פנייה</th>
                    <th>תגובה</th>
                    <th>תאריך</th>
                    <th>סטטוס</th>
                    <th>פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map(contact => (
                    <tr key={contact._id}>
                      <td>{contact.name}</td>
                      <td>
                        <a href={`mailto:${contact.email}`}>
                          {contact.email}
                        </a>
                      </td>
                      <td>
                        <small>{contact.Info_req ? contact.Info_req.substring(0, 50) + '...' : '-'}</small>
                      </td>
                      <td>
                        {contact.Info_res ? (
                          <small className="text-success">{contact.Info_res.substring(0, 30)}...</small>
                        ) : (
                          <span className="badge bg-warning">ממתין לתגובה</span>
                        )}
                      </td>
                      <td>
                        {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString('he-IL') : '-'}
                      </td>
                      <td>
                        <span className={`badge ${contact.Info_res ? 'bg-success' : 'bg-warning'}`}>
                          {contact.Info_res ? 'טופל' : 'בטיפול'}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button 
                            className="btn btn-outline-primary"
                            onClick={() => handleRespond(contact)}
                            disabled={!!contact.Info_res}
                            title={contact.Info_res ? 'כבר טופל' : 'שלח תגובה'}
                          >
                            <i className="bi bi-reply"></i>
                          </button>
                          <button 
                            className="btn btn-outline-info"
                            onClick={() => {
                              navigator.clipboard.writeText(contact.email);
                              alert('האימייל הועתק ללוח');
                            }}
                            title="העתק אימייל"
                          >
                            <i className="bi bi-clipboard"></i>
                          </button>
                          <button 
                            className="btn btn-outline-danger"
                            onClick={() => handleDeleteContact(contact._id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Response Modal */}
      {showResponseModal && selectedContact && (
        <ContactResponseModal
          contact={selectedContact}
          onSend={handleSendResponse}
          onClose={() => {
            setShowResponseModal(false);
            setSelectedContact(null);
          }}
        />
      )}
    </div>
  );
};

// Contact Response Modal Component
const ContactResponseModal = ({ contact, onSend, onClose }) => {
  const [response, setResponse] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (response.trim() && response.length <= 250) {
      onSend(response);
    } else {
      alert('תגובה חייבת להיות בין 1-250 תווים');
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">שליחת תגובה</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">לשולח:</label>
                <p className="form-control-static fw-bold">{contact.name} ({contact.email})</p>
              </div>
              <div className="mb-3">
                <label className="form-label">פנייה מקורית:</label>
                <div className="border rounded p-2 bg-light">
                  {contact.Info_req}
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">תגובתך:</label>
                <textarea
                  className="form-control"
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  rows="5"
                  placeholder="הזן את תגובתך כאן..."
                  required
                  maxLength="250"
                ></textarea>
                <small className="text-muted">{response.length}/250 תווים</small>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                ביטול
              </button>
              <button type="submit" className="btn btn-primary">
                שלח תגובה
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Settings Component
const SettingsTab = () => {
  const [settings, setSettings] = useState({
    siteName: 'מועדון טיסנים',
    contactEmail: 'info@tisanim.co.il',
    contactPhone: '08-1234567',
    siteDescription: 'הפלטפורמה המובילה לחובבי טיסנאות בישראל',
    maintenanceMode: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSaveSettings = async () => {
    try {
      // This would be an actual API call in production
      console.log('Saving settings:', settings);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('הגדרות נשמרו בהצלחה');
    } catch (error) {
      alert('שגיאה בשמירת ההגדרות');
    }
  };

  const handleClearCache = () => {
    if (window.confirm('האם אתה בטוח שברצונך לנקות את המטמון?')) {
      localStorage.clear();
      sessionStorage.clear();
      alert('מטמון נוקה בהצלחה');
      window.location.reload();
    }
  };

  const handleExportData = async () => {
    try {
      // This would export all data in production
      const exportData = {
        exportedAt: new Date().toISOString(),
        settings
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `tisanim-backup-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      alert('הנתונים יוצאו בהצלחה');
    } catch (error) {
      alert('שגיאה ביצוא הנתונים');
    }
  };

  return (
    <div className="settings-tab">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-4">הגדרות מערכת</h5>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">שם האתר</label>
              <input
                type="text"
                className="form-control"
                name="siteName"
                value={settings.siteName}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">תיאור האתר</label>
              <input
                type="text"
                className="form-control"
                name="siteDescription"
                value={settings.siteDescription}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">אימייל ליצירת קשר</label>
              <input
                type="email"
                className="form-control"
                name="contactEmail"
                value={settings.contactEmail}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">טלפון ליצירת קשר</label>
              <input
                type="tel"
                className="form-control"
                name="contactPhone"
                value={settings.contactPhone}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-check mb-4">
            <input
              className="form-check-input"
              type="checkbox"
              name="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={handleInputChange}
              id="maintenanceMode"
            />
            <label className="form-check-label" htmlFor="maintenanceMode">
              מצב תחזוקה (האתר לא יהיה זמין למשתמשים רגילים)
            </label>
          </div>

          <div className="border-top pt-3">
            <h6 className="mb-3">פעולות ניהוליות</h6>
            <div className="d-flex gap-2">
              <button className="btn btn-primary" onClick={handleSaveSettings}>
                <i className="bi bi-save me-2"></i>
                שמור הגדרות
              </button>
              <button className="btn btn-warning" onClick={handleClearCache}>
                <i className="bi bi-eraser me-2"></i>
                נקה מטמון
              </button>
              <button className="btn btn-info" onClick={handleExportData}>
                <i className="bi bi-download me-2"></i>
                יצוא נתונים
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;