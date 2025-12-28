const express = require('express');
const {
  createOrder,
  getAllOrders,
  getOrdersByUser,
  getOrderById,
  updateOrderStatus,
  updateOrder,
  deleteOrder,
  getOrderStats,
  processPayment,
  createOrderFromCart
} = require('../controllers/Order');

const authenticateToken = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin'); // You'll need to create this

const router = express.Router();

// User routes (require authentication)
router.post('/', authenticateToken, createOrder);
router.post('/from-cart', authenticateToken, createOrderFromCart);
router.get('/my-orders', authenticateToken, getOrdersByUser);
router.get('/:id', authenticateToken, getOrderById);
router.put('/:id', authenticateToken, updateOrder);
router.delete('/:id', authenticateToken, deleteOrder);
router.post('/:id/payment', authenticateToken, processPayment);

// Admin routes (require admin authentication)
router.get('/', authenticateToken, adminMiddleware, getAllOrders);
router.put('/:id/status', authenticateToken, adminMiddleware, updateOrderStatus);
router.get('/stats/overview', authenticateToken, adminMiddleware, getOrderStats);

module.exports = router;