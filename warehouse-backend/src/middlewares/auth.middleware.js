const supabase = require('../config/supabaseclient');
const { error } = require('../utils/response');
const userService = require('../services/user.service');

/**
 * Middleware: verify bearer token and attach user with role.
 * Expects 'Authorization: Bearer <token>'
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

    // 2. Fetch user profile from public `users` table to get role
    // This assumes you have a `roles` table and `users` has a `role_id` foreign key.
    const { data: userProfile, error: profileError } = await userService.getUserWithRole(authUser.id);

    if (profileError || !userProfile) {
        return error(res, 'User profile not found or role not assigned', 403, 'PERMISSION_DENIED');
    }

    // 3. Attach user info, including the role name, to the request object
    req.user = {
      id: userProfile.user_id,
      email: userProfile.email,
      role: userProfile.roles.role_name, // Assuming the role name is what we use for checks
      ...userProfile
    };

    next();
  } catch (err) {
    console.error('Authentication Error:', err);
    return error(res, 'Authentication error', 500, 'SERVER_ERROR');
  }
};
