// src/services/stock.service.js
const supabase = require('../config/supabaseclient');
const STOCK_TABLE = 'stock_levels';
const TRANSACTIONS_TABLE = 'transactions';

async function listStockLevels(filters = {}) {
  let query = supabase.from(STOCK_TABLE).select('*');
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
  let query = supabase.from(TRANSACTIONS_TABLE).select('*');
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
  try {
    // Clean payload to avoid foreign key issues
    const cleanPayload = {
      item_id: payload.item_id,
      warehouse_id: payload.warehouse_id,
      type: payload.type,
      quantity: payload.quantity,
      notes: payload.notes,
      transfer_request_id: payload.transfer_request_id || null
      // Skip initiated_by to avoid foreign key constraints
    };
    
    // Create the transaction record
    const { data: transaction, error: transError } = await supabase
      .from(TRANSACTIONS_TABLE)
      .insert(cleanPayload)
      .select()
      .single();
    
    if (transError) throw transError;
    
    // Update the stock levels based on the transaction
    await updateStockFromTransaction(cleanPayload);
    
    return { data: transaction, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

async function updateStockFromTransaction(transactionData) {
  const { item_id, warehouse_id, type, quantity } = transactionData;
  
  console.log(`Updating stock: ${type} ${quantity} units for item ${item_id} in warehouse ${warehouse_id}`);
  
  // Get current stock level
  const { data: currentStock, error: fetchError } = await supabase
    .from(STOCK_TABLE)
    .select('*')
    .eq('item_id', item_id)
    .eq('warehouse_id', warehouse_id)
    .single();
  
  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error fetching stock:', fetchError);
    throw fetchError;
  }
  
  if (currentStock) {
    // Update existing stock level
    const newQuantity = type === 'IN' 
      ? currentStock.quantity + quantity 
      : Math.max(0, currentStock.quantity - quantity);
    
    console.log(`Updating existing stock from ${currentStock.quantity} to ${newQuantity}`);
    
    const { error: updateError } = await supabase
      .from(STOCK_TABLE)
      .update({ 
        quantity: newQuantity
      })
      .eq('stock_id', currentStock.stock_id);
    
    if (updateError) {
      console.error('Error updating stock:', updateError);
      throw updateError;
    }
    
    console.log(`✅ Stock updated successfully`);
  } else if (type === 'IN') {
    // Create new stock level record for incoming stock
    console.log(`Creating new stock record with ${quantity} units`);
    
    const { error: insertError } = await supabase
      .from(STOCK_TABLE)
      .insert({
        item_id,
        warehouse_id,
        quantity
      });
    
    if (insertError) {
      console.error('Error creating stock:', insertError);
      throw insertError;
    }
    
    console.log(`✅ New stock record created`);
  } else {
    console.log(`No existing stock found for OUT transaction - skipping`);
  }
}

module.exports = {
  listStockLevels,
  getStockLevelById,
  createStockLevel,
  updateStockLevel,
  listTransactions,
  getTransaction,
  createTransaction,
  updateStockFromTransaction,
};
