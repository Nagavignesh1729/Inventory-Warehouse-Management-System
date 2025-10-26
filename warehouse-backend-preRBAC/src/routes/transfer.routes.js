// src/routes/transfer.routes.js
const express = require('express');
const router = express.Router();
const transferController = require('../controllers/transfer.controller');
const auth = require('../middlewares/auth.middleware');
// Removed authorize and ROLES

// All routes accessible to any authenticated user
router.get('/', auth, transferController.listTransfers);
router.get('/:id', auth, transferController.getTransfer);
router.post('/', auth, transferController.createTransfer);
router.put('/:id', auth, transferController.updateTransfer);

// Actions for updating transfer status
router.post('/:id/approve', auth, transferController.approveTransfer);
router.post('/:id/reject', auth, transferController.rejectTransfer);
router.post('/:id/complete', auth, transferController.completeTransfer);
router.post('/:id/cancel', auth, transferController.cancelTransfer);

module.exports = router;

