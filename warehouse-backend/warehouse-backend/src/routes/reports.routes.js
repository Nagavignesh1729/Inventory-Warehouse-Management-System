// src/routes/reports.routes.js
import express from 'express';
import { generateInventoryReport, generateSalesReport, generateSupplierReport } from '../controllers/reports.controller.js';
import { verifyAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Protected routes for report generation
router.get('/inventory', verifyAuth, generateInventoryReport);
router.get('/sales', verifyAuth, generateSalesReport);
router.get('/suppliers', verifyAuth, generateSupplierReport);

export default router;
