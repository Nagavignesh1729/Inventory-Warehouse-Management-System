// src/routes/stock.routes.js
const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stock.controller');
const auth = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/authorization.middleware');
const { ROLES } = require('../utils/constants');

// --- Routes for /stock-levels ---
router.get('/levels', auth, stockController.listStockLevels);
router.get('/levels/:id', auth, stockController.getStockLevel);
router.post('/levels', auth, authorize([ROLES.ADMIN, ROLES.MANAGER]), stockController.createStockLevel);
router.put('/levels/:id', auth, authorize([ROLES.ADMIN, ROLES.MANAGER]), stockController.updateStockLevel);
router.post('/levels/bulk-update', auth, authorize([ROLES.ADMIN, ROLES.MANAGER]), (req, res) => res.status(501).json({message: "Not implemented"})); // Placeholder

// --- Routes for /transactions ---
router.get('/transactions', auth, authorize([ROLES.ADMIN, ROLES.MANAGER]), stockController.listTransactions);
router.get('/transactions/:id', auth, authorize([ROLES.ADMIN, ROLES.MANAGER]), stockController.getTransaction);

// The API doc specifies separate endpoints for /in, /out, /adjust.
// This implementation uses a single controller function and sets the type based on the route.
router.post('/transactions/in', auth, authorize([ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]), (req, res, next) => {
    req.body.type = 'IN';
    stockController.createTransaction(req, res, next);
});

router.post('/transactions/out', auth, authorize([ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]), (req, res, next) => {
    req.body.type = 'OUT';
    stockController.createTransaction(req, res, next);
});

router.post('/transactions/adjust', auth, authorize([ROLES.ADMIN, ROLES.MANAGER]), (req, res, next) => {
    req.body.type = 'ADJUST';
    stockController.createTransaction(req, res, next);
});

module.exports = router;
