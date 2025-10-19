// src/routes/item.routes.js
const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item.controller');
const auth = require('../middlewares/auth.middleware');

// RBAC is removed for now; all authenticated users can access these.

// Special route for low-stock items
router.get('/low-stock', auth, itemController.listItems);

router.get('/', auth, itemController.listItems);
router.get('/:id', auth, itemController.getItem);
router.post('/', auth, itemController.createItem);
router.put('/:id', auth, itemController.updateItem);
router.delete('/:id', auth, itemController.deleteItem);

module.exports = router;
