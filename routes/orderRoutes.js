const express = require('express');
const auth = require('../middleware/auth');
const {
  getAllOrders,
  adminRemoveOrderItem,
  adminUpdateOrderStatus,
  createOrder,
  getUserOrders,
  updateOrderStatus,
  updateOrderItems,
  deleteOrder,
} = require('../controllers/orderController');
const router = express.Router();

router.route('/')
  .post(auth, createOrder)
  .get(auth, getUserOrders);

router.route('/:orderId')
  .patch(auth, updateOrderStatus)
  .delete(auth, deleteOrder);

router.route('/:orderId/items')
  .patch(auth, updateOrderItems);

  router.route('/admin').get(auth, getAllOrders);

  router.route('/admin/:orderId/items/:itemId').delete(
  auth, // Make sure your auth middleware allows only admin
  adminRemoveOrderItem // This is the new controller function (see Step 2)
);

router.route('/admin/:orderId/status').patch(
  auth,        // Your auth middleware (must allow only admin)
  adminUpdateOrderStatus  // Controller function (see next step)
)

module.exports = router;
