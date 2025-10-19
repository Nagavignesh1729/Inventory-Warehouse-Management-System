// src/controllers/category.controller.js
const categoryService = require('../services/category.service');
const { success, error } = require('../utils/response');

async function listCategories(req, res) {
  const { data, error: svcErr } = await categoryService.listCategories();
  if (svcErr) return error(res, svcErr.message, 500);
  return success(res, data);
}

async function getCategory(req, res) {
  const { id } = req.params;
  const { data, error: svcErr } = await categoryService.getCategory(id);
  if (svcErr) return error(res, svcErr.message, 500);
  if (!data) return error(res, 'Category not found', 404);
  return success(res, data);
}

async function createCategory(req, res) {
  
  const payload = { ...req.body };
  const { data, error: svcErr } = await categoryService.createCategory(payload);
  if (svcErr) return error(res, svcErr.message, 500);
  return success(res, data, 'Category created', 201);
}

async function updateCategory(req, res) {
  const { id } = req.params;
  const payload = { ...req.body, updated_by: req.user?.id };
  const { data, error: svcErr } = await categoryService.updateCategory(id, payload);
  if (svcErr) return error(res, svcErr.message, 500);
  return success(res, data, 'Category updated');
}

async function deleteCategory(req, res) {
  const { id } = req.params;
  const { error: svcErr } = await categoryService.deleteCategory(id);
  if (svcErr) return error(res, svcErr.message, 500);
  return success(res, {}, 'Category deleted');
}

module.exports = {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
