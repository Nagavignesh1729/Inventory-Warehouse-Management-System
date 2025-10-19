// src/routes/category.routes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const auth = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/authorization.middleware');
const { ROLES } = require('../utils/constants');

router.get('/', auth, categoryController.listCategories);
router.get('/:id', auth, categoryController.getCategory);
router.post('/', auth, authorize([ROLES.ADMIN, ROLES.MANAGER]), categoryController.createCategory);
router.put('/:id', auth, authorize([ROLES.ADMIN, ROLES.MANAGER]), categoryController.updateCategory);
router.delete('/:id', auth, authorize([ROLES.ADMIN]), categoryController.deleteCategory);

module.exports = router;

