const supabase = require('../config/supabaseclient');
const { error } = require('../utils/response');

/**
 * Middleware: verify bearer token using Supabase auth.getUser
 * Expects 'Authorization: Bearer <token>'
 */
module.exports = async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1];

    if (!token) {
      return error(res, 'Authorization token missing', 401);
    }

    // supabase.auth.getUser expects { access_token } in v2.
    const { data, error: supError } = await supabase.auth.getUser(token);
    if (supError || !data?.user) {
      return error(res, 'Invalid token', 401, supError?.message || null);
    }

    // attach user info
    req.user = {
      id: data.user.id,
      email: data.user.email,
      role: data.user.user_metadata?.role || null
    };

    next();
  } catch (err) {
    console.error(err);
    return error(res, 'Authentication error', 500);
  }
};
