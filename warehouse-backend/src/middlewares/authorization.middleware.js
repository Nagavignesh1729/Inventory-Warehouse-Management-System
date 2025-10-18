// src/middlewares/authorization.middleware.js
const { error } = require('../utils/response');

/**
 * Higher-order function to create a role-based authorization middleware.
 * @param {string[]} allowedRoles - An array of role names allowed to access the route.
 * @returns {function} Express middleware function.
 */
const authorize = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return error(res, 'User role not available', 403, 'PERMISSION_DENIED');
    }

    if (allowedRoles.includes(userRole)) {
      return next(); // User has one of the allowed roles, proceed
    }

    return error(res, `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}`, 403, 'PERMISSION_DENIED');
  };
};

module.exports = authorize;
