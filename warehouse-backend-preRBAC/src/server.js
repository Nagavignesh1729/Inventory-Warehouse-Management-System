const app = require('./index');
const logger = require('./utils/logger');
require('dotenv').config(); // loads variables from .env

const port = process.env.PORT || 3000;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const nodeEnv = process.env.NODE_ENV || 'development';

app.listen(port, () => {
  logger.info(`Warehouse API listening on port ${port} (env=${nodeEnv})`);
  logger.info(`Supabase URL: ${supabaseUrl}`);
});
