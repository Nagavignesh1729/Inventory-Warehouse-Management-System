const Joi = require('joi');
const userService = require('../services/user.service');
const { success, error } = require('../utils/response');

// validation schema
const createUserSchema = Joi.object({
  username: Joi.string().min(3).required(),
  full_name: Joi.string().required(),
  email: Joi.string().email().required(),
  role_id: Joi.number().integer().required(),
  assigned_warehouse_id: Joi.number().integer().optional(),
  is_active: Joi.boolean().optional()
});

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
  const { data, error: svcErr } = await userService.deleteUser(req.params.id);
  if (svcErr) return error(res, svcErr.message || 'Delete failed', 500);
  return success(res, data, 'User deleted');
}

module.exports = { listUsers, getUser, createUser, updateUser, deleteUser };
