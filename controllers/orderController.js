

// @desc    Create an order
// @route   POST /api/orders
// @access  Private
const Order = require('../models/order'); // Make sure to import your Order model

const createOrder = async (req, res) => {
  try {
    const { items, shop, totalDiscount, appliedOffers } = req.body;

    console.log(req.body);

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Items are required',
      });
    }

    // Basic validation for totalDiscount
    const discountValue = totalDiscount && !isNaN(totalDiscount) && totalDiscount >= 0
      ? parseFloat(totalDiscount)
      : 0;

    // Basic validation for appliedOffers: should be an array or empty
    let offers = [];
    if (appliedOffers && Array.isArray(appliedOffers)) {
      // Optional: you can add further validation for each offer object structure here
      offers = appliedOffers.map((offer) => ({
        id: offer.id,
        discount: parseFloat(offer.discount) || 0,
        productName: offer.productName || '',
      }));
    }

    // Build order data object
    const orderData = {
      user: req.user._id,
      items,
      status: 'Processing',
      totalDiscount: discountValue,
      appliedOffers: offers,
      ...(shop?.id && {
        shop: {
          id: shop.id,
          name: shop.name,
          address: shop.address,
        },
      }),
    };

    const order = await Order.create(orderData);

    // Emit socket event for new order
    req.app.get('io').emit('orderPlaced', order);
    console.log('🚀 SOCKET EMIT:', 'orderPlaced', order);

    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error creating order',
      error: err.message,
    });
  }
};



// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
const getUserOrders = async (req, res) => {
  try {
    
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching orders', error: err.message });
  }
};

// @desc    Update order status (e.g., Cancel)
// @route   PATCH /api/orders/:orderId
// @access  Private
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    console.log(status, orderId);
    const allowedStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Only the user who placed the order can cancel
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Only allow cancellation if order is Processing
    if (status === 'Cancelled' && order.status !== 'Processing') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a delivered or already cancelled order'
      });
    }

    order.status = status;
    console.log(status);
    await order.save();

    // Emit socket event for order update (complete/cancel)
    req.app.get('io').emit('orderUpdated', order);
    console.log('🚀 SOCKET EMIT:', 'orderUpdated', order);

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
// @desc    Edit items in an order (add/remove/update quantity)
// @route   PATCH /api/orders/:orderId/items
// @access  Private
const updateOrderItems = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { action, itemId, productId, newQuantity } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Only the user who placed the order can edit
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Only allow editing if order is Processing
    if (order.status !== 'Processing') {
      return res.status(400).json({ success: false, message: 'Order cannot be modified after approved' });
    }

    // Action: update, remove, or add
    if (action === 'update' && itemId && newQuantity) {
      const item = order.items.id(itemId);
      if (item) {
        item.quantity = newQuantity;
      } else {
        return res.status(404).json({ success: false, message: 'Item not found' });
      }
    } else if (action === 'remove' && itemId) {
      order.items = order.items.filter(item => item._id.toString() !== itemId);
    } else if (action === 'add' && productId && newQuantity) {
      // You'll need productName, price, imageUrl from your Product model
      // For now, we just mock the required fields
      order.items.push({
        productName: 'Sample Product', // Replace with actual data
        quantity: newQuantity,
        price: 100, // Replace with actual data
        size: null, // Replace if needed
        imageUrl: '', // Replace with actual data
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid action or missing fields' });
    }

    await order.save();

    req.app.get('io').emit('orderUpdated', order);
    console.log('🚀 SOCKET EMIT:', 'orderUpdated', order);

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// @desc    Delete (cancel) an order
// @route   DELETE /api/orders/:orderId
// @access  Private
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Only the user who placed the order can delete
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Only allow deletion if order is Processing
    if (order.status !== 'Processing') {
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled' });
    }

    await order.deleteOne();
    res.json({ success: true, message: 'Order cancelled' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort('-createdAt').populate('user', 'name number address email');
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};


// @desc    Admin: Remove item from order
// @route   DELETE /api/orders/admin/:orderId/items/:itemId
// @access  Private/Admin
const adminRemoveOrderItem = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Remove the item
    order.items = order.items.filter(item => item._id.toString() !== itemId);

    // Optional: Recalculate totalAmount if you store it
    // order.totalAmount = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    await order.save();

    req.app.get('io').emit('orderUpdated', order);
    console.log('🚀 SOCKET EMIT:', 'orderUpdated', order);

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

const adminUpdateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    
    order.status = status;
    await order.save();
      req.app.get('io').emit('orderUpdated', order);
    console.log('🚀 SOCKET EMIT:', 'orderUpdated', order);
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
module.exports = {
  adminUpdateOrderStatus,
  getAllOrders,
  createOrder,
  getUserOrders,
  adminRemoveOrderItem,
  updateOrderStatus,
  updateOrderItems,
  deleteOrder,
};