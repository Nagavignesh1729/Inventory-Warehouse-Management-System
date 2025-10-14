const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const errorMiddleware = require('./middlewares/error.middleware');
const logger = require('./utils/logger');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

app.get('/', (req, res) => res.json({ success: true, message: 'Warehouse API running' }));

// mount API routes
app.use('/api/v1', routes);

// health check
app.get('/health', (_req, res) => res.status(200).send('OK'));

app.use(errorMiddleware);

module.exports = app;
