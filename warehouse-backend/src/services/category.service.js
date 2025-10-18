// src/services/category.service.js
const supabase = require('../config/supabaseclient');
const CATEGORIES_TABLE = 'categories';

async function listCategories() {
  return supabase.from(CATEGORIES_TABLE).select('*');
}

async function getCategory(id) {
  return supabase.from(CATEGORIES_TABLE).select('*').eq('category_id', id).single();
}

async function createCategory(payload) {
  return supabase.from(CATEGORIES_TABLE).insert(payload).select().single();
}

async function updateCategory(id, payload) {
  return supabase.from(CATEGORIES_TABLE).update(payload).eq('category_id', id).select().single();
}

async function deleteCategory(id) {
  return supabase.from(CATEGORIES_TABLE).delete().eq('category_id', id);
}

module.exports = {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};

