const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/:item_id/warehouse/:warehouse_id', auth, inventoryController.getStock);
router.put('/:item_id/warehouse/:warehouse_id', auth, inventoryController.setStock);
router.post('/transactions', auth, inventoryController.createTransaction);

module.exports = router;
