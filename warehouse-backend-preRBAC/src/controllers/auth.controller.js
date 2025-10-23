// src/controllers/auth.controller.js
const supabase = require('../config/supabaseclient');
const { success, error } = require('../utils/response');

/**
 * Sign up new user (POST /auth/signup)
 * Creates a new user account with Supabase
 */
const signUp = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    if (!email || !password) return error(res, 'Email and password are required', 400);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || ''
        }
      }
    });

    if (signUpError) return error(res, signUpError.message || 'Signup failed', 400);

    return success(res, {
      user: data.user,
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token
    }, 'Signup successful');
  } catch (err) {
    return error(res, err.message || 'Signup failed', 500);
  }
};

/**
 * Sign in existing user (POST /auth/login)
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
 * Sign out current user (POST /auth/logout)
 */
const signOut = async (req, res) => {
  try {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) return error(res, signOutError.message, 400);

    return success(res, {}, 'User signed out successfully');
  } catch (err) {
    return error(res, err.message || 'Sign-out failed', 500);
  }
};

/**
 * Get currently authenticated user info from access token (GET /users/me)
 */
const getCurrentUser = async (req, res) => {
  // The user object is attached to the request by the auth middleware
  return success(res, req.user, 'User info retrieved');
};


/**
 * Change user password (PUT /auth/change-password)
 */
const changePassword = async (req, res) => {
    try {
        const { new_password } = req.body;
        if (!new_password) {
            return error(res, 'New password is required', 400);
        }

        const { data, error: updateError } = await supabase.auth.updateUser({
            password: new_password
        });

        if (updateError) {
            return error(res, updateError.message, 400);
        }

        return success(res, data, 'Password updated successfully');
    } catch (err) {
        return error(res, err.message || 'Failed to change password', 500);
    }
};

/**
 * Refresh authentication token (POST /auth/refresh)
 */
const refreshToken = async (req, res) => {
    try {
        const { refresh_token } = req.body;
        if (!refresh_token) {
            return error(res, 'Refresh token is required', 400);
        }

        const { data, error: refreshError } = await supabase.auth.refreshSession({ refresh_token });

        if (refreshError) {
            return error(res, refreshError.message, 401);
        }

        return success(res, {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            user: data.user
        }, 'Token refreshed successfully');
    } catch (err) {
        return error(res, err.message || 'Failed to refresh token', 500);
    }
};


module.exports = {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  changePassword,
  refreshToken
};
