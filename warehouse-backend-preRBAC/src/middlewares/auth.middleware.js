const supabase = require('../config/supabaseclient');
const { error } = require('../utils/response');
// No longer importing userService

/**
 * Middleware: verify bearer token and attach user.
 * This simplified version checks for a valid token but does NOT fetch the user role.
 */
module.exports = async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1];

    if (!token) {
      return error(res, 'Authorization token missing', 401, 'AUTH_REQUIRED');
    }

    // 1. Verify token with Supabase
    const { data: { user: authUser }, error: supError } = await supabase.auth.getUser(token);
    if (supError || !authUser) {
      return error(res, 'Invalid or expired token', 401, 'INVALID_TOKEN');
    }
    
    // 2. Attach basic user info (from auth.users) to the request object
    req.user = {
      id: authUser.id,
      email: authUser.email,
      ...authUser
    };

    next();
  } catch (err) {
    console.error('Authentication Error:', err);
    return error(res, 'Authentication error', 500, 'SERVER_ERROR');
  }
};

