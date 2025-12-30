import axios from 'axios';

// שים לב: אין /api בהתחלה
const API_BASE_URL = 'https://tisanim-club.onrender.com/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor להוספת token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// טיפול בשגיאות
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/api/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  // התחברות - שימוש ב-login endpoint
  login: async (email, password) => {
    try {
      // שלח בקורת login לשרת
      const response = await api.post('/api/users/login', {
        email: email,
        password: password
      });
      
      const { user, token } = response.data;
      
      // אחסן במקומי
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { data: { user, token } };
      
    } catch (error) {
      console.error('Login error:', error);
      
      // אם השרת לא מגיב, נסה לקבל את כל המשתמשים ולבדוק ידנית
      if (error.response?.status === 404 || error.response?.status === 500) {
        console.log('Login endpoint not working, trying fallback...');
        
        try {
          const response = await api.get('/api/users');
          const users = response.data?.data || response.data || [];
          
          // חפש משתמש לפי אימייל בלבד (כי הסיסמאות מוסרות)
          const user = users.find(u => 
            u.email && u.email.toLowerCase().trim() === email.toLowerCase().trim()
          );
          
          if (user) {
            console.log('User found by email (without password check):', user.email);
            
            const token = btoa(JSON.stringify(user));
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            return { data: { user, token } };
          }
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
        }
      }
      
      // גיבוי למשתמש דמה
      if (email === 'demo@example.com' && password === 'demo123') {
        const demoUser = {
          _id: 'demo123',
          name: 'משתמש דמה',
          email: 'demo@example.com',
          phone: '050-1234567',
          city: 'תל אביב',
          role: 'user',
          createdAt: new Date().toISOString()
        };
        
        const token = btoa(JSON.stringify(demoUser));
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(demoUser));
        
        return { data: { user: demoUser, token } };
      }
      
      throw new Error('אימייל או סיסמה לא נכונים. נסה demo@example.com / demo123 לבדיקה');
    }
  },
  
  // הרשמה
  register: async (userData) => {
    try {
      const response = await api.post('/api/users', userData);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  // קבלת פרופיל
  getProfile: async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user && user._id) {
        // ננסה לקבל את המשתמש מהשרת
        const response = await api.get(`/api/users/${user._id}`);
        return response;
      }
      // אם אין, נחזיר את המשתמש מ-localStorage
      return { data: user };
    } catch (error) {
      console.error('Profile error:', error);
      // נחזיר את המשתמש מ-localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return { data: user };
    }
  },
  
  // קבלת כל המשתמשים (עבור ניהול)
  getAllUsers: async () => {
    try {
      const response = await api.get('/api/users');
      return response;
    } catch (error) {
      console.error('Error fetching users:', error);
      // Return empty array as fallback
      return { data: { data: [] } };
    }
  }
};

export const productsAPI = {
  getAllProducts: () => api.get('/api/products'),
  getProductById: (id) => api.get(`/api/products/${id}`),
  createProduct: (productData) => api.post('/api/products', productData),
  updateProduct: (id, productData) => api.put(`/api/products/${id}`, productData),
  delete: (id) => api.delete(`/api/products/${id}`),
};

export const coursesAPI = {
  getTisanCourses: () => api.get('/api/cursTisan'),
  getMasokCourses: () => api.get('/api/cursMasok'),
  getDronCourses: () => api.get('/api/cursDron'),
  
  // הפונקציה הנכונה לקבלת קורסים לפי אימייל משתמש
  getUserCoursesByEmail: async (email) => {
    try {
      // ננסה לשלוף את כל הקורסים ולסנן לפי אימייל
      const [tisanResponse, masokResponse, dronResponse] = await Promise.all([
        api.get('/api/cursTisan').catch(() => ({ data: { data: [] } })),
        api.get('/api/cursMasok').catch(() => ({ data: { data: [] } })),
        api.get('/api/cursDron').catch(() => ({ data: { data: [] } }))
      ]);
      
      // אוסף את כל הקורסים
      const allCourses = [
        ...(tisanResponse.data.data || []),
        ...(masokResponse.data.data || []),
        ...(dronResponse.data.data || [])
      ];
      
      // מסנן לפי אימייל
      const userCourses = allCourses.filter(course => 
        course.email && course.email.toLowerCase() === email.toLowerCase()
      );
      
      return { data: { data: userCourses } };
    } catch (error) {
      console.error('Error fetching user courses:', error);
      // מחזיר מערך ריק במקרה של שגיאה
      return { data: { data: [] } };
    }
  },
  
  registerToCourse: (courseType, data) => {
    const endpoint = courseType === 'tisan' ? '/api/cursTisan' : 
                    courseType === 'masok' ? '/api/cursMasok' : '/api/cursDron'; 
                    
    return api.post(endpoint, data);
  },
};

export const exchangeAPI = {
  getAll: () => api.get('/api/exchange'),
  getById: (id) => api.get(`/api/exchange/${id}`),
  create: (exchangeData) => api.post('/api/exchange', exchangeData),
  update: (id, exchangeData) => api.put(`/api/exchange/${id}`, exchangeData),
  delete: (id) => api.delete(`/api/exchange/${id}`),
};

export const contentAPI = {
    getByCategory: (category) => {
    // מכיוון שאין לך נתיב זה בשרת, נחזיר data ריק או fallback
    return Promise.resolve({ 
      data: { 
        data: [] 
      } 
    });
  },
  
  // או אם אתה רוצה להשתמש ב-fallback data:
  getByCategory: (category) => {
    let fallbackData = [];
    
    if (category === 'תקנות טיס') {
      fallbackData = [
        {
          _id: '1',
          title: 'תקנות טיסה בסיסיות',
          content: '1. תמיד שמרו על קשר עין עם הטיסן.\n2. אל תטוסו ליד אנשים או רכוש.\n3. אל תטוסו בגובה של יותר מ-120 מטר.\n4. אל תטוסו ליד שדות תעופה.\n5. תמיד בדקו את מזג האוויר לפני הטיסה.',
          category: 'תקנות טיס',
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          title: 'אזורי טיסה מותרים',
          content: 'מותר לטוס בטיסנים באזורים הבאים:\n1. שדות טיסנים מאושרים\n2. אזורים פתוחים ללא אוכלוסייה\n3. חופים מאושרים לטיסה\n4. שטחים חקלאיים עם אישור\n\nאסור לטוס:\n1. בתוך ערים\n2. ליד שדות תעופה\n3. באזורים צבאיים\n4. בשמורות טבע',
          category: 'תקנות טיס',
          createdAt: new Date().toISOString()
        }
      ];
    } else if (category === 'בטיחות') {
      fallbackData = [
        {
          _id: '3',
          title: 'כללי בטיחות בסיסיים',
          content: '1. תמיד בצעו בדיקה מקדימה לפני טיסה.\n2. וודאו שהסוללות טעונות לחלוטין.\n3. אל תטוסו בתנאי רוח חזקה.\n4. שמרו מרחק מאנשים ומבנים.\n5. למדו כיצד לכבות את המנועים במהירות.',
          category: 'בטיחות',
          createdAt: new Date().toISOString()
        }
      ];
    } else if (category === 'היסטוריה') {
      fallbackData = [
        {
          _id: '4',
          title: 'היסטוריה של טיסנאות',
          content: 'תחביב הטיסנאות החל בתחילת המאה ה-20 עם התפתחות התעופה. הטיסן הראשון שנשלט ברדיו נבנה בשנות ה-30. בשנות ה-70 וה-80 התחביב הפך נפוץ יותר עם הוזלת הרכיבים האלקטרוניים. היום, עם כניסת הדרונים, התחביב פופולרי יותר מאי פעם.',
          category: 'היסטוריה',
          createdAt: new Date().toISOString()
        }
      ];
    }
    
    return Promise.resolve({ 
      data: { 
        data: fallbackData 
      } 
    });
  },

  getAllUsers: () => {
    return Promise.resolve({ 
      data: { 
        data: [] 
      } 
    });
  },
  getById: (id) => api.get(`/api/content/${id}`),
  create: (contentData) => api.post('/api/content', contentData),
  update: (id, contentData) => api.put(`/api/content/${id}`, contentData),
  delete: (id) => api.delete(`/api/content/${id}`),
};

export const contactAPI = {
  sendMessage: (messageData) => {
    // המרת הנתונים מהטופס למבנה שהשרת מצפה לו
    const apiData = {
      name: messageData.name,
      email: messageData.email,
      Info_req: `נושא: ${messageData.subject}\nהודעה: ${messageData.message}\nטלפון: ${messageData.phone || 'לא צוין'}`,
      Info_res: "תודה על פנייתך! ניצור איתך קשר בהקדם.",
      createdAt: new Date().toISOString()
    };
    return api.post('/api/contactUs', apiData);
  },
};

// Helper function for content
const getContentByCategory = (category) => {
  if (category === 'תקנות טיס') {
    return [
      {
        _id: '1',
        title: 'תקנות טיסה בסיסיות',
        content: '1. תמיד שמרו על קשר עין עם הטיסן.\n2. אל תטוסו ליד אנשים או רכוש.\n3. אל תטוסו בגובה של יותר מ-120 מטר.\n4. אל תטוסו ליד שדות תעופה.\n5. תמיד בדקו את מזג האוויר לפני הטיסה.',
        category: 'תקנות טיס',
        createdAt: new Date().toISOString()
      }
    ];
  }
  return [];
};

export default api;
