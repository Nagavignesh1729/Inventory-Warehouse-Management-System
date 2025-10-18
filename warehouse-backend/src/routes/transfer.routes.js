// src/routes/transfer.routes.js
const express = require('express');
const router = express.Router();
const transferController = require('../controllers/transfer.controller');
const auth = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/authorization.middleware');
const { ROLES } = require('../utils/constants');

// CRUD operations for transfers
router.get('/', auth, transferController.listTransfers);
router.get('/:id', auth, transferController.getTransfer);
router.post('/', auth, authorize([ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]), transferController.createTransfer);
router.put('/:id', auth, authorize([ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]), transferController.updateTransfer);

// Actions for updating transfer status
router.post('/:id/approve', auth, authorize([ROLES.ADMIN, ROLES.MANAGER]), transferController.approveTransfer);
router.post('/:id/reject', auth, authorize([ROLES.ADMIN, ROLES.MANAGER]), transferController.rejectTransfer);
router.post('/:id/complete', auth, authorize([ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]), transferController.completeTransfer);
router.post('/:id/cancel', auth, authorize([ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]), transferController.cancelTransfer);

// Note: A DELETE route is in the API doc but not used by the frontend.
// It can be added here if needed, likely restricted to ADMINs on non-completed transfers.
// router.delete('/:id', auth, authorize([ROLES.ADMIN]), transferController.deleteTransfer);

module.exports = router;
