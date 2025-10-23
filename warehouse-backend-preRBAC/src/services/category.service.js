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
  // Remove created_by and updated_by for now since they cause foreign key issues
  const cleanPayload = {
    name: payload.name,
    description: payload.description || null
  };
  return supabase.from(CATEGORIES_TABLE).insert(cleanPayload).select().single();
}

async function updateCategory(id, payload) {
  const cleanPayload = {
    name: payload.name,
    description: payload.description || null
  };
  return supabase.from(CATEGORIES_TABLE).update(cleanPayload).eq('category_id', id).select().single();
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

