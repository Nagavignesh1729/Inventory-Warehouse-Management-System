const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes'); // This should point to the main router
const errorMiddleware = require('./middlewares/error.middleware');
const logger = require('./utils/logger');

const app = express();

// --- Standard Middleware ---
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// --- API Routes ---
// Mount the main router under the /api/v1 prefix
app.use('/api/v1', routes);

// --- Health Check Endpoint ---
app.get('/health', (_req, res) => res.status(200).send('OK'));

// --- Root Endpoint ---
app.get('/', (req, res) => res.json({ success: true, message: 'Warehouse API is running' }));


// --- Error Handling ---
// This should be the last middleware
app.use(errorMiddleware);

module.exports = app;
