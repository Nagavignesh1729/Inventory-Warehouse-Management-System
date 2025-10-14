const productService = require('../services/product.service');
const { success, error } = require('../utils/response');

async function listProducts(req, res) {
  const { data, error: svcErr } = await productService.listProducts();
  if (svcErr) return error(res, svcErr.message || 'Unable to fetch products', 500);
  return success(res, data);
}

async function getProduct(req, res) {
  const id = req.params.id;
  const { data, error: svcErr } = await productService.getProduct(id);
  if (svcErr) return error(res, svcErr.message || 'Unable to fetch product', 500);
  if (!data) return error(res, 'Product not found', 404);
  return success(res, data);
}

async function createProduct(req, res) {
  const { data, error: svcErr } = await productService.createProduct(req.body);
  if (svcErr) return error(res, svcErr.message || 'Create failed', 500);
  return success(res, data, 'Product created', 201);
}

async function updateProduct(req, res) {
  const id = req.params.id;
  const { data, error: svcErr } = await productService.updateProduct(id, req.body);
  if (svcErr) return error(res, svcErr.message || 'Update failed', 500);
  return success(res, data, 'Product updated');
}

async function deleteProduct(req, res) {
  const id = req.params.id;
  const { data, error: svcErr } = await productService.deleteProduct(id);
  if (svcErr) return error(res, svcErr.message || 'Delete failed', 500);
  return success(res, data, 'Product deleted');
}

module.exports = { listProducts, getProduct, createProduct, updateProduct, deleteProduct };
