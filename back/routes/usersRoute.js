const express = require('express');
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser // ייבוא הפונקציה החדשה
} = require('../controllers/Users');

const router = express.Router();

// נתיבים קיימים
router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

// נתיב login חדש
router.post('/login', loginUser);

module.exports = router;