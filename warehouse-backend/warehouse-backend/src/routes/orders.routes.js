const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/', auth, ordersController.listOrders);
router.get('/:id', auth, ordersController.getOrder);
router.post('/', auth, ordersController.createOrder);
router.put('/:id', auth, ordersController.updateOrder);

module.exports = router;
