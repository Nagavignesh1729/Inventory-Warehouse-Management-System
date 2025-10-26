// src/routes/stock.routes.js
const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stock.controller');
const auth = require('../middlewares/auth.middleware');
// Removed authorize and ROLES

// --- Routes for /stock-levels ---
router.get('/levels', auth, stockController.listStockLevels);
router.get('/levels/:id', auth, stockController.getStockLevel);
router.post('/levels', auth, stockController.createStockLevel);
router.put('/levels/:id', auth, stockController.updateStockLevel);
router.post('/levels/bulk-update', auth, (req, res) => res.status(501).json({message: "Not implemented"})); // Placeholder

// --- Routes for /transactions ---
router.get('/transactions', auth, stockController.listTransactions);
router.get('/transactions/:id', auth, stockController.getTransaction);

router.post('/transactions/in', auth, (req, res, next) => {
    req.body.type = 'IN';
    stockController.createTransaction(req, res, next);
});

router.post('/transactions/out', auth, (req, res, next) => {
    req.body.type = 'OUT';
    stockController.createTransaction(req, res, next);
});

router.post('/transactions/adjust', auth, (req, res, next) => {
    req.body.type = 'ADJUST';
    stockController.createTransaction(req, res, next);
});

module.exports = router;

