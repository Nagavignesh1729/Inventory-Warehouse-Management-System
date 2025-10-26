const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/', auth, productsController.listProducts);
router.get('/:id', auth, productsController.getProduct);
router.post('/', auth, productsController.createProduct);
router.put('/:id', auth, productsController.updateProduct);
router.delete('/:id', auth, productsController.deleteProduct);

module.exports = router;
