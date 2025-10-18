// src/routes/item.routes.js
const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item.controller');
const auth = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/authorization.middleware');
const { ROLES } = require('../utils/constants');


// Special route for low-stock items, needs to be before /:id
router.get('/low-stock', auth, authorize([ROLES.ADMIN, ROLES.MANAGER]), itemController.listItems);

router.get('/', auth, itemController.listItems);
router.get('/:id', auth, itemController.getItem);
router.post('/', auth, authorize([ROLES.ADMIN, ROLES.MANAGER]), itemController.createItem);
router.put('/:id', auth, authorize([ROLES.ADMIN, ROLES.MANAGER]), itemController.updateItem);
router.delete('/:id', auth, authorize([ROLES.ADMIN]), itemController.deleteItem);

// Placeholder for sub-routes, to be implemented
// router.get('/:id/suppliers', auth, ...);
// router.get('/:id/stock-history', auth, ...);


module.exports = router;

