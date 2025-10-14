const supabase = require('../config/supabaseclient');
const SUPPLIER = 'suppliers';

async function listSuppliers() {
  return supabase.from(SUPPLIER).select('*');
}

async function createSupplier(payload) {
  return supabase.from(SUPPLIER).insert(payload).select().single();
}

module.exports = { listSuppliers, createSupplier };
