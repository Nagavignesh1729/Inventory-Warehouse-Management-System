const logger = require('../utils/logger');
const { error } = require('../utils/response');

module.exports = (err, req, res, next) => {
  logger.error(err.stack || err.message || err);
  return error(res, 'Server Error', 500, err.message || err);
};
