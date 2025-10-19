const supabase = require('../config/supabaseclient');
const ITEMS = 'items';

async function listProducts() {
  return supabase.from(ITEMS).select('*');
}

async function getProduct(id) {
  return supabase.from(ITEMS).select('*').eq('item_id', id).single();
}

async function createProduct(payload) {
  return supabase.from(ITEMS).insert(payload).select().single();
}

async function updateProduct(id, payload) {
  return supabase.from(ITEMS).update(payload).eq('item_id', id).select().single();
}

async function deleteProduct(id) {
  return supabase.from(ITEMS).delete().eq('item_id', id);
}

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};
