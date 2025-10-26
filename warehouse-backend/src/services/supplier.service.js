// src/services/supplier.service.js
const supabase = require('../config/supabaseclient');
const SUPPLIER_TABLE = 'suppliers';

async function listSuppliers() {
  return supabase.from(SUPPLIER_TABLE).select('*');
}

async function getSupplier(id) {
    return supabase.from(SUPPLIER_TABLE).select('*').eq('supplier_id', id).single();
}

async function createSupplier(payload) {
  return supabase.from(SUPPLIER_TABLE).insert(payload).select().single();
}

async function updateSupplier(id, payload) {
    return supabase.from(SUPPLIER_TABLE).update(payload).eq('supplier_id', id).select().single();
}

async function deleteSupplier(id) {
    return supabase.from(SUPPLIER_TABLE).delete().eq('supplier_id', id);
}

module.exports = {
    listSuppliers,
    getSupplier,
    createSupplier,
    updateSupplier,
    deleteSupplier
};
