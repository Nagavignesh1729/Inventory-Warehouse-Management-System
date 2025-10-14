// src/controllers/auth.controller.js
const supabase = require('../config/supabaseclient');
const { success, error } = require('../utils/response');

/**
 * Sign up a new user
 * Registers user in Supabase Auth and optionally inserts a record into your `users` table
 */
const signUp = async (req, res) => {
  try {
    const { email, password, full_name, role_id, assigned_warehouse_id } = req.body;
    if (!email || !password) {
      return error(res, 'Email and password are required', 400);
    }

    // Create user in Supabase Auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name, role_id, assigned_warehouse_id } }
    });
    if (signUpError) return error(res, signUpError.message, 400);

    // Optionally, insert into `users` table for internal tracking
    if (data?.user) {
      await supabase.from('users').insert({
        user_id: data.user.id,
        email,
        full_name,
        role_id,
        assigned_warehouse_id,
        is_active: true
      });
    }

    return success(res, { user: data.user }, 'User registered successfully');
  } catch (err) {
    return error(res, err.message || 'Sign-up failed', 500);
  }
};

/**
 * Sign in existing user
 * Returns Supabase access_token & user info
 */
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return error(res, 'Email and password are required', 400);

    const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError) return error(res, loginError.message || 'Invalid credentials', 401);

    return success(res, {
      user: data.user,
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token
    }, 'Login successful');
  } catch (err) {
    return error(res, err.message || 'Login failed', 500);
  }
};

/**
 * Sign out current user
 * Requires client to send Authorization: Bearer <access_token>
 */
const signOut = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1];
    if (!token) return error(res, 'Token missing', 400);

    const { error: signOutError } = await supabase.auth.signOut(token);
    if (signOutError) return error(res, signOutError.message, 400);

    return success(res, {}, 'User signed out successfully');
  } catch (err) {
    return error(res, err.message || 'Sign-out failed', 500);
  }
};

/**
 * Get currently authenticated user info from access token
 */
const getCurrentUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1];
    if (!token) return error(res, 'Token missing', 400);

    const { data, error: userError } = await supabase.auth.getUser(token);
    if (userError || !data?.user) return error(res, 'Invalid or expired token', 401);

    return success(res, data.user, 'User info retrieved');
  } catch (err) {
    return error(res, err.message || 'Failed to retrieve user', 500);
  }
};

module.exports = {
  signUp,
  signIn,
  signOut,
  getCurrentUser
};
