const Order = require('../models/Order');

// Create Order
const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).send({
        message: 'Order must contain at least one item',
      });
    }
    
    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).send({
        message: 'Valid total amount is required',
      });
    }

    const order = await Order.create({
      user: req.userId, // Assuming user ID comes from authentication middleware
      items,
      totalAmount,
      shippingAddress: shippingAddress || {},
      paymentStatus: 'ממתין לתשלום',
      orderStatus: 'ממתין'
    });
    
    res.status(201).send(order);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

// Get all orders (admin only)
const getAllOrders = async (req, res) => {
  try {
    const { status, paymentStatus, startDate, endDate } = req.query;
    let query = {};
    
    if (status) query.orderStatus = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    
    // Filter by date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.product', 'name specification cost')
      .sort({ createdAt: -1 });
    
    res.status(200).json({ count: orders.length, data: orders });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

// Get orders by user
const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.userId || req.params.userId;
    
    const orders = await Order.find({ user: userId })
      .populate('items.product', 'name specification cost images')
      .sort({ createdAt: -1 });
    
    res.status(200).json({ count: orders.length, data: orders });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name specification cost category images');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is authorized to view this order
    if (req.userId && order.user._id.toString() !== req.userId && !req.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    
    res.status(200).json(order);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

// Update order status (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus, trackingNumber } = req.body;
    
    const updateData = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
    .populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Here you could add email notification logic
    
    res.status(200).send({ 
      message: 'Order updated successfully', 
      data: order 
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

// Update order (user can update shipping address before payment)
const updateOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // User can only update their own orders
    if (order.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }
    
    // Can only update if order hasn't been paid yet
    if (order.paymentStatus !== 'ממתין לתשלום') {
      return res.status(400).json({ message: 'Cannot modify order after payment' });
    }
    
    if (shippingAddress) {
      order.shippingAddress = shippingAddress;
    }
    
    await order.save();
    
    res.status(200).send({ 
      message: 'Order updated successfully', 
      data: order 
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

// Delete order (only if not paid)
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // User can only delete their own orders
    if (order.user.toString() !== req.userId && !req.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this order' });
    }
    
    // Can only delete if order hasn't been paid
    if (order.paymentStatus !== 'ממתין לתשלום') {
      return res.status(400).json({ message: 'Cannot delete order after payment' });
    }
    
    await order.deleteOne();
    
    res.status(200).send({ message: 'Order deleted successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

// Get order statistics (admin only)
const getOrderStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
          avgOrderValue: { $avg: "$totalAmount" }
        }
      },
      {
        $project: {
          _id: 0,
          totalOrders: 1,
          totalRevenue: 1,
          avgOrderValue: { $round: ["$avgOrderValue", 2] }
        }
      }
    ]);
    
    // Get orders by status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
          revenue: { $sum: "$totalAmount" }
        }
      }
    ]);
    
    // Get recent orders
    const recentOrders = await Order.find({})
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.status(200).json({
      statistics: stats[0] || { totalOrders: 0, totalRevenue: 0, avgOrderValue: 0 },
      ordersByStatus,
      recentOrders
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

// Process payment for order
const processPayment = async (req, res) => {
  try {
    const { paymentMethod, paymentDetails } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if order belongs to user
    if (order.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to pay for this order' });
    }
    
    // Check if already paid
    if (order.paymentStatus !== 'ממתין לתשלום') {
      return res.status(400).json({ message: 'Order already processed' });
    }
    
    // Here you would integrate with actual payment gateway
    // For now, we'll simulate a successful payment
    
    // Update order status
    order.paymentStatus = 'שולם';
    order.paymentMethod = paymentMethod;
    order.paymentDate = new Date();
    order.paymentDetails = paymentDetails;
    
    await order.save();
    
    // Here you could:
    // 1. Update product stock
    // 2. Send confirmation email
    // 3. Create invoice
    
    res.status(200).send({ 
      message: 'Payment processed successfully', 
      data: order,
      receipt: {
        orderId: order._id,
        totalAmount: order.totalAmount,
        paymentDate: order.paymentDate,
        paymentMethod: order.paymentMethod
      }
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

// Create order from cart items
const createOrderFromCart = async (req, res) => {
  try {
    const { cartItems, shippingAddress, paymentMethod } = req.body;
    
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).send({
        message: 'Cart is empty',
      });
    }
    
    // Calculate total amount and prepare order items
    let totalAmount = 0;
    const orderItems = [];
    
    for (const cartItem of cartItems) {
      // Here you would typically validate each product
      // Check availability, price, etc.
      // For now, we assume all items are valid
      
      const itemTotal = cartItem.price * cartItem.quantity;
      totalAmount += itemTotal;
      
      orderItems.push({
        product: cartItem.productId,
        quantity: cartItem.quantity,
        price: cartItem.price
      });
    }
    
    // Create the order
    const order = await Order.create({
      user: req.userId,
      items: orderItems,
      totalAmount,
      shippingAddress: shippingAddress || {},
      paymentMethod: paymentMethod || 'מזומן',
      paymentStatus: paymentMethod ? 'ממתין לתשלום' : 'מזומן בהגעה',
      orderStatus: 'ממתין'
    });
    
    // Clear user's cart (if you have a cart system)
    // await Cart.findOneAndUpdate(
    //   { user: req.userId },
    //   { items: [] }
    // );
    
    res.status(201).send({
      message: 'Order created successfully',
      orderId: order._id,
      totalAmount: order.totalAmount,
      nextSteps: paymentMethod ? 'המשך לתשלום' : 'ההזמנה מחכה לאישור'
    });
    
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
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
};