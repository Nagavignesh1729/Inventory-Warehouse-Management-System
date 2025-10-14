const supabase = require('../config/supabaseclient');
const ORDERS = 'orders';

async function listOrders() {
  return supabase.from(ORDERS).select('*');
}

async function getOrder(orderId) {
  return supabase.from(ORDERS).select('*').eq('order_id', orderId).single();
}

async function createOrder(payload) {
  // expected payload: { customer_name, items: JSON, status, created_by, ... }
  return supabase.from(ORDERS).insert(payload).select().single();
}

async function updateOrder(orderId, payload) {
  return supabase.from(ORDERS).update(payload).eq('order_id', orderId).select().single();
}

module.exports = { listOrders, getOrder, createOrder, updateOrder };
