// src/services/stock.service.js
const supabase = require('../config/supabaseclient');
const STOCK_TABLE = 'stock_levels';
const TRANSACTIONS_TABLE = 'transactions';

async function listStockLevels(filters = {}) {
  let query = supabase.from(STOCK_TABLE).select('*, item:items(*), warehouse:warehouses(*)');
  if (filters.warehouse_id) {
    query = query.eq('warehouse_id', filters.warehouse_id);
  }
  if (filters.item_id) {
    query = query.eq('item_id', filters.item_id);
  }
  return query;
}

async function getStockLevelById(id) {
    return supabase.from(STOCK_TABLE).select('*').eq('stock_id', id).single();
}

async function createStockLevel(payload) {
    return supabase.from(STOCK_TABLE).insert(payload).select().single();
}

async function updateStockLevel(id, payload) {
    return supabase.from(STOCK_TABLE).update(payload).eq('stock_id', id).select().single();
}


async function listTransactions(filters = {}) {
  let query = supabase.from(TRANSACTIONS_TABLE).select('*, item:items(*), warehouse:warehouses(*)');
    if (filters.warehouse_id) {
        query = query.eq('warehouse_id', filters.warehouse_id);
    }
    if (filters.type) {
        query = query.eq('type', filters.type);
    }
  return query.order('transaction_date', { ascending: false });
}

async function getTransaction(id) {
  return supabase.from(TRANSACTIONS_TABLE).select('*').eq('transaction_id', id).single();
}

async function createTransaction(payload) {
  return supabase.from(TRANSACTIONS_TABLE).insert(payload).select().single();
}

module.exports = {
  listStockLevels,
  getStockLevelById,
  createStockLevel,
  updateStockLevel,
  listTransactions,
  getTransaction,
  createTransaction,
};
