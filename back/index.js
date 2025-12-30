const express = require('express')
const app = express()
const connectDB = require('./db/connect');
require('dotenv').config()



// ייבוא המודולים
const usersRoute = require('./routes/usersRoute.js');
const productsRoute = require('./routes/productsRoute.js');
const contactUsRoute = require('./routes/contactUsRoute.js');
const cursTisan = require('./routes/cursTisanRoute.js');
const cursMasok = require('./routes/cursMasokRoute.js');
const cursDron = require('./routes/cursDronRoute.js');
const exchangeRoute = require('./routes/exchangeRoute.js');
const orderRoute = require('./routes/orderRoute.js');
const contentRoute = require('./routes/contentRoute.js');

const cors = require('cors');
const corsOptions = {
  // Replace with your exact frontend URL
  origin: 'https://tisanim-club-1.onrender.com', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Set to true if you are sending cookies or headers
};

app.use(cors(corsOptions));
// const cors = require('cors')

// הגדרת CORS מקיפה
// app.use(cors({
//   origin: ['http://localhost:3000', 'http://localhost:5000'],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

app.use(express.json());

// Middleware נוסף
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', usersRoute);
app.use('/api/products', productsRoute);
app.use('/api/contactUs', contactUsRoute);
app.use('/api/cursTisan', cursTisan);
app.use('/api/cursMasok', cursMasok);
app.use('/api/cursDron', cursDron);
app.use('/api/exchange', exchangeRoute);
app.use('/api/orders', orderRoute);
app.use('/api/content', contentRoute);

// API חיצוני לדוגמה (שילוב עם OpenWeather או שירות אחר)
app.get('/api/weather/:city', async (req, res) => {
  try {
    const city = req.params.city;
    // כאן תוכל לשלב עם API חיצוני אמיתי
    res.json({ 
      city: city,
      weather: 'מתאים לטיסה',
      windSpeed: '10 קמ"ש',
      temperature: '25°C'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route עבור צ'אט מקוון (דוגמה)
app.get('/api/chat/online-users', (req, res) => {
  res.json({ 
    users: [
      { id: 1, name: 'דוד כהן', status: 'מתחבר' },
      { id: 2, name: 'שרה לוי', status: 'מחובר' },
      { id: 3, name: 'משה ישראלי', status: 'מחובר' }
    ]
  });
});

// Route לבריאות המערכת
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'מערכת פועלת',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Route לדף הבית של ה-API
app.get('/api', (req, res) => {
  res.json({
    message: "ברוכים הבאים ל-API של מועדון הטיסנים",
    version: "1.0.0",
    endpoints: {
      users: "/api/users",
      products: "/api/products",
      contact: "/api/contactUs",
      courses: {
        airplane: "/api/cursTisan",
        helicopter: "/api/cursMasok",
        drone: "/api/cursDron"
      },
      exchange: "/api/exchange",
      orders: "/api/orders",
      content: "/api/content"
    }
  });
});

// בדיקה שהשרת עובד
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>מועדון טיסנים - API</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            direction: rtl;
            text-align: center;
            padding: 50px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: rgba(255,255,255,0.1);
            padding: 30px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
          }
          h1 {
            font-size: 48px;
            margin-bottom: 20px;
          }
          .links {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-top: 30px;
          }
          a {
            color: white;
            background: rgba(255,255,255,0.2);
            padding: 10px 20px;
            border-radius: 5px;
            text-decoration: none;
            transition: background 0.3s;
          }
          a:hover {
            background: rgba(255,255,255,0.3);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🚀 API מועדון טיסנים</h1>
          <p>השרת פועל בהצלחה! לחץ על הקישורים הבאים לבדיקת הנתיבים:</p>
          <div class="links">
            <a href="/api" target="_blank">דף API ראשי</a>
            <a href="/api/health" target="_blank">בריאות המערכת</a>
            <a href="/api/products" target="_blank">רשימת מוצרים</a>
            <a href="http://localhost:3000" target="_blank">פרונטנד (React)</a>
          </div>
        </div>
      </body>
    </html>
  `);
});
// Endpoint לקבלת קורסים לפי משתמש (לפי אימייל)
app.get('/api/courses/user/:email', async (req, res) => {
  try {
    const userEmail = req.params.email;
    
    // חפש קורסים לפי אימייל בכל הטבלאות
    const [tisanCourses, masokCourses, dronCourses] = await Promise.all([
      CursTisan.find({ email: userEmail }),
      CursMasok.find({ email: userEmail }),
      CursDron.find({ email: userEmail })
    ]);
    
    // הוסף שדה type לכל קורס כדי שנדע מאיזה טבלה הוא
    const coursesWithType = [
      ...tisanCourses.map(course => ({ ...course.toObject(), courseType: 'tisan' })),
      ...masokCourses.map(course => ({ ...course.toObject(), courseType: 'masok' })),
      ...dronCourses.map(course => ({ ...course.toObject(), courseType: 'dron' }))
    ];
    
    res.status(200).json({
      success: true,
      count: coursesWithType.length,
      data: coursesWithType
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`✅ שרת Express מאזין בפורט ${port}...`);
      console.log(`🌐 API זמין בכתובת: http://localhost:${port}`);
      console.log(`📚 API תיעוד: http://localhost:${port}/api`);
      console.log(`⚡ Frontend: http://localhost:3000`);
    });
  } catch (error) {
    console.error('❌ שגיאה בהתחברות למסד הנתונים:', error);
  }
};

start();
