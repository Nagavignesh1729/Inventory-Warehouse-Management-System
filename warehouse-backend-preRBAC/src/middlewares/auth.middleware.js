const supabase = require('../config/supabaseclient');
const { error } = require('../utils/response');

/**
 * Middleware: verify bearer token and attach user info.
 * This simplified version checks for a valid token but does NOT fetch the user role.
 */
module.exports = async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1];

    if (!token) {
      return error(res, 'Authorization token missing', 401, 'AUTH_REQUIRED');
    }

    // Verify token with Supabase
    const { data: { user }, error: supError } = await supabase.auth.getUser(token);
    
    if (supError || !user) {
      return error(res, 'Invalid or expired token', 401, 'INVALID_TOKEN');
    }

    // Attach basic user info to the request object
    // The detailed profile with role is no longer fetched here.
    req.user = user;

    next();
  } catch (err) {
    console.error('Authentication Error:', err);
    return error(res, 'Authentication error', 500, 'SERVER_ERROR');
  }
};
