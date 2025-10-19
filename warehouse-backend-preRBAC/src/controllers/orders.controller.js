const orderService = require('../services/order.service');
const { success, error } = require('../utils/response');

async function listOrders(req, res) {
  const { data, error: svcErr } = await orderService.listOrders();
  if (svcErr) return error(res, svcErr.message || 'Unable to fetch orders', 500);
  return success(res, data);
}

async function getOrder(req, res) {
  const { data, error: svcErr } = await orderService.getOrder(req.params.id);
  if (svcErr) return error(res, svcErr.message || 'Unable to fetch order', 500);
  if (!data) return error(res, 'Order not found', 404);
  return success(res, data);
}

async function createOrder(req, res) {
  const payload = { ...req.body, created_by: req.user?.id };
  const { data, error: svcErr } = await orderService.createOrder(payload);
  if (svcErr) return error(res, svcErr.message || 'Create failed', 500);
  return success(res, data, 'Order created', 201);
}

async function updateOrder(req, res) {
  const { data, error: svcErr } = await orderService.updateOrder(req.params.id, req.body);
  if (svcErr) return error(res, svcErr.message || 'Update failed', 500);
  return success(res, data, 'Order updated');
}

module.exports = { listOrders, getOrder, createOrder, updateOrder };
