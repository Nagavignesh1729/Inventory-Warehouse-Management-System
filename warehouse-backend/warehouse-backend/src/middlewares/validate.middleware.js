const { error } = require('../utils/response');

module.exports = (schema) => (req, res, next) => {
  const { error: validationError } = schema.validate(req.body);
  if (validationError) {
    return error(res, validationError.details[0].message, 400);
  }
  next();
};
