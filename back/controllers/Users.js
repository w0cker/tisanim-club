const User = require('../models/User');

// Create User
const createUser = async (req, res) => {
  try {
    const { name, email, password, phone, city } = req.body;
    
    // בדיקת שדות חובה
    if (!name || !email || !password) {
      return res.status(400).send({
        message: 'Send required fields: name, email, password',
      });
    }
    
    // בדיקה אם המשתמש כבר קיים
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({
        message: 'User with this email already exists',
      });
    }

    // יצירת משתמש חדש
    const user = await User.create({ 
      name, 
      email, 
      password: password || '', 
      phone: phone || '',
      city: city || '',
      role: 'user',
      isActive: true
    });
    
    res.status(201).send({
      message: 'User created successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        password: user.password,
        phone: user.phone,
        city: user.city,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.log('Create user error:', error.message);
    
    // טיפול בשגיאות ספציפיות של mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).send({
        message: 'Validation error',
        errors: messages
      });
    }
    
    if (error.code === 11000) { // duplicate key error
      return res.status(400).send({
        message: 'Email already exists'
      });
    }
    
    res.status(500).send({ 
      message: 'Error creating user',
      error: error.message 
    });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}); // אל תכלול סיסמאות
    res.status(200).json({ 
      count: users.length, 
      data: users 
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ 
      message: 'Error fetching users',
      error: error.message 
    });
  } 
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    
    if (error.name === 'CastError') {
      return res.status(400).send({
        message: 'Invalid user ID'
      });
    }
    
    res.status(500).send({ 
      message: 'Error fetching user',
      error: error.message 
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { name, email, phone, city } = req.body;
    
    if (!name || !email) {
      return res.status(400).send({
        message: 'Send all required fields: name, email',
      });
    }

    // בדיקה אם email כבר בשימוש על ידי משתמש אחר
    if (email) {
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: req.params.id } 
      });
      if (existingUser) {
        return res.status(400).send({
          message: 'Email already in use by another user',
        });
      }
    }

    const userData = { 
      name, 
      email, 
      phone: phone || '',
      city: city || '',
      updatedAt: Date.now()
    };

    const result = await User.findByIdAndUpdate(
      req.params.id, 
      userData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!result) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    res.status(200).send({ 
      message: 'User updated successfully',
      data: result 
    });
  } catch (error) {
    console.log(error.message);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).send({
        message: 'Validation error',
        errors: messages
      });
    }
    
    res.status(500).send({ 
      message: 'Error updating user',
      error: error.message 
    });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }
    res.status(200).send({ 
      message: 'User deleted successfully' 
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ 
      message: 'Error deleting user',
      error: error.message 
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).send({
        message: 'Please provide email and password',
      });
    }

    // מצא את המשתמש
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).send({
        message: 'Invalid email or password',
      });
    }

    // בדוק את הסיסמה (באפליקציה אמיתית צריך hashing)
    if (user.password !== password) {
      return res.status(401).send({
        message: 'Invalid email or password',
      });
    }

    // החזר את פרטי המשתמש בלי הסיסמה
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      city: user.city,
      role: user.role,
      createdAt: user.createdAt
    };

    res.status(200).send({
      message: 'Login successful',
      user: userResponse,
      token: 'fake-jwt-token-' + user._id // באפליקציה אמיתית, צור JWT אמיתי
    });
  } catch (error) {
    console.log('Login error:', error.message);
    res.status(500).send({ 
      message: 'Error during login',
      error: error.message 
    });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser // הוספת פונקציית login
};