// src/routes/item.routes.js
const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item.controller');
const auth = require('../middlewares/auth.middleware');
// Removed authorize and ROLES

// Special route for low-stock items
router.get('/low-stock', auth, itemController.listItems);

// All routes accessible to any authenticated user
router.get('/', auth, itemController.listItems);
router.get('/:id', auth, itemController.getItem);
router.post('/', auth, itemController.createItem);
router.put('/:id', auth, itemController.updateItem);
router.delete('/:id', auth, itemController.deleteItem);

module.exports = router;

