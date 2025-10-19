// src/controllers/users.controllers.js
const Joi = require('joi');
const userService = require('../services/user.service');
const { success, error } = require('../utils/response');
const supabase = require('../config/supabaseclient'); // This was missing

// validation schema for creating users via admin endpoint
const createUserSchema = Joi.object({
  username: Joi.string().min(3).required(),
  full_name: Joi.string().required(),
  email: Joi.string().email().required(),
  role_id: Joi.number().integer().required(),
  assigned_warehouse_id: Joi.number().integer().optional().allow(null),
  is_active: Joi.boolean().optional()
});

// validation schema for public registration
const registerUserSchema = Joi.object({
    full_name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role_id: Joi.number().integer().required(), // Frontend should send a default role ID (e.g., for STAFF)
    assigned_warehouse_id: Joi.number().integer().optional().allow(null),
});

async function registerUser(req, res) {
    try {
        const { error: valErr } = registerUserSchema.validate(req.body);
        if (valErr) return error(res, valErr.details[0].message, 400);

        const { email, password, full_name, role_id, assigned_warehouse_id } = req.body;

        // 1. Create auth user in Supabase Auth
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name }
            }
        });

        if (signUpError) return error(res, signUpError.message, 400);
        if (!authData.user) return error(res, 'Registration failed, user not created in auth.', 500);

        // 2. Insert corresponding profile into public "users" table
        const profilePayload = {
            user_id: authData.user.id,
            email,
            username: email.split('@')[0],
            full_name,
            role_id,
            assigned_warehouse_id,
            is_active: true,
        };
        const { data: userRecord, error: insertErr } = await userService.createUser(profilePayload);

        if (insertErr) {
            // Important: Clean up the auth user if profile creation fails to prevent orphaned auth users.
            await supabase.auth.admin.deleteUser(authData.user.id);
            return error(res, `Failed to create user profile: ${insertErr.message}`, 500);
        }

        return success(res, { user: userRecord }, 'Registration successful', 201);

    } catch (err) {
        return error(res, err.message, 500);
    }
}


async function listUsers(req, res) {
  const { data, error: svcErr } = await userService.listUsers();
  if (svcErr) return error(res, svcErr.message || 'Unable to fetch users', 500);
  return success(res, data);
}

async function getUser(req, res) {
  const { id } = req.params;
  const { data, error: svcErr } = await userService.getUserById(id);
  if (svcErr) return error(res, svcErr.message || 'Unable to fetch user', 500);
  if (!data) return error(res, 'User not found', 404);
  return success(res, data);
}

// Admin-only create user
async function createUser(req, res) {
  try {
    const { error: valErr } = createUserSchema.validate(req.body);
    if (valErr) return error(res, valErr.details[0].message, 400);
    const { data, error: svcErr } = await userService.createUser(req.body);
    if (svcErr) return error(res, svcErr.message || 'Create failed', 500);
    return success(res, data, 'User created', 201);
  } catch (err) {
    return error(res, err.message, 500);
  }
}

async function updateUser(req, res) {
  const userId = req.params.id;
  const { data, error: svcErr } = await userService.updateUser(userId, req.body);
  if (svcErr) return error(res, svcErr.message || 'Update failed', 500);
  return success(res, data, 'User updated');
}

async function deleteUser(req, res) {
  const { id } = req.params;
  const { error: svcErr } = await userService.deleteUser(id);
  if (svcErr) return error(res, svcErr.message || 'Delete failed', 500);
  return success(res, {}, 'User deleted');
}

module.exports = { registerUser, listUsers, getUser, createUser, updateUser, deleteUser };
