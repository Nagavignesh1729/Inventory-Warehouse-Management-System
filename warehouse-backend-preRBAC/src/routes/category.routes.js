// src/routes/category.routes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const auth = require('../middlewares/auth.middleware');

// RBAC is removed for now; all authenticated users can access these.
router.get('/', auth, categoryController.listCategories);
router.get('/:id', auth, categoryController.getCategory);
router.post('/', auth, categoryController.createCategory);
router.put('/:id', auth, categoryController.updateCategory);
router.delete('/:id', auth, categoryController.deleteCategory);

module.exports = router;
