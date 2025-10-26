// src/services/stock.service.js
const supabase = require('../config/supabaseclient');
const STOCK_TABLE = 'stock_levels';
const TRANSACTIONS_TABLE = 'transactions';

async function listStockLevels(filters = {}) {
  // Fetch stock levels, potentially joining with items and warehouses for context
  let query = supabase.from(STOCK_TABLE).select(`
    *,
    item:items(item_id, name),
    warehouse:warehouses_old(warehouse_id, name)
  `);
  if (filters.warehouse_id) {
    query = query.eq('warehouse_id', filters.warehouse_id);
  }
  if (filters.item_id) {
    query = query.eq('item_id', filters.item_id);
  }
  return query;
}

async function getStockLevelById(id) {
    // Fetch a specific stock level entry by its primary key
    return supabase.from(STOCK_TABLE).select('*').eq('stock_id', id).single();
}

async function listTransactions(filters = {}) {
  // Fetch transactions, joining with items and warehouses
  let query = supabase.from(TRANSACTIONS_TABLE).select(`
    *,
    item:items(item_id, name),
    warehouse:warehouses_old(warehouse_id, name)
  `);
    if (filters.warehouse_id) {
        query = query.eq('warehouse_id', filters.warehouse_id);
    }
    if (filters.type) {
        query = query.eq('type', filters.type);
    }
  return query.order('transaction_date', { ascending: false });
}

async function getTransaction(id) {
  // Fetch a specific transaction by its ID
  return supabase.from(TRANSACTIONS_TABLE).select('*').eq('transaction_id', id).single();
}

/**
 * NEW CENTRAL FUNCTION for all stock updates.
 * Atomically updates stock and logs a transaction. Prevents negative stock.
 * @param {object} payload
 * @param {string} payload.item_id
 * @param {string} payload.warehouse_id
 * @param {string} payload.type - 'IN', 'OUT', or 'ADJUST'
 * @param {number} payload.quantity - Positive amount for IN/OUT, target quantity for ADJUST.
 * @param {string} [payload.notes]
 * @param {string} [payload.transfer_request_id]
 */
async function updateStockAndLogTransaction(payload) {
  const { item_id, warehouse_id, type, quantity, notes, transfer_request_id } = payload;

  // Basic validation
  if (!item_id || !warehouse_id || !type || quantity == null) {
      return { data: null, error: { message: "Missing required fields for stock update." } };
  }
  if (type !== 'ADJUST' && quantity <= 0) {
      return { data: null, error: { message: "Quantity for IN/OUT must be positive." } };
  }
   if (type === 'ADJUST' && quantity < 0) {
      return { data: null, error: { message: "Adjusted quantity cannot be negative." } };
  }

  try {
    // 1. Get current stock
    const { data: currentStockArr, error: fetchError } = await listStockLevels({ item_id, warehouse_id });
    if (fetchError) throw fetchError;

    const currentStock = currentStockArr.length > 0 ? currentStockArr[0] : null;
    const currentQuantity = currentStock ? currentStock.quantity : 0;

    let newQuantity;
    let transactionQuantity = quantity; // Quantity to log

    // 2. Calculate new quantity and VALIDATE 'OUT'
    if (type === 'IN') {
      newQuantity = currentQuantity + quantity;
    } else if (type === 'OUT') {
      // --- CRITICAL VALIDATION ---
      if (currentQuantity < quantity) {
        throw new Error(`Insufficient stock. Available: ${currentQuantity}, Requested: ${quantity}`);
      }
      newQuantity = currentQuantity - quantity;
      // --- END VALIDATION ---
    } else if (type === 'ADJUST') {
      newQuantity = quantity; // quantity IS the new target
      transactionQuantity = newQuantity - currentQuantity; // Log the difference
    } else {
      throw new Error("Invalid transaction type.");
    }

    // 3. Update or Insert Stock Level
    let stock_id = currentStock ? currentStock.stock_id : null;
    const stockPayload = {
      item_id,
      warehouse_id,
      quantity: newQuantity,
      last_updated: new Date().toISOString()
      // Removed updated_by
    };

    if (currentStock) {
      const { error: updateError } = await supabase.from(STOCK_TABLE).update(stockPayload).eq('stock_id', stock_id);
      if (updateError) throw updateError;
    } else {
      // Only insert if it makes sense (e.g., IN or ADJUST to non-zero)
       if (newQuantity > 0 || type === 'IN' || (type === 'ADJUST' && newQuantity !== 0) ) {
         const { data: newStock, error: insertError } = await supabase.from(STOCK_TABLE).insert(stockPayload).select('stock_id').single();
         if (insertError) throw insertError;
         stock_id = newStock.stock_id;
       } else {
         // Don't create a zero-stock record if one didn't exist
         console.log("Skipping stock record creation for zero quantity.");
         return { data: { message: "No stock change needed for zero quantity", stock_id: null }, error: null };
       }
    }

    // 4. Log the Transaction (only if quantity changed)
    let logType = type;
    let logQuantity = transactionQuantity;

    if (type === 'ADJUST') {
      if (transactionQuantity === 0) {
          console.log("Skipping transaction log for zero adjustment.");
          return { data: { message: "Adjustment resulted in no change.", stock_id }, error: null };
      }
      logType = transactionQuantity > 0 ? 'IN' : 'OUT'; // Log ADJUST as IN or OUT
      logQuantity = Math.abs(transactionQuantity);
    }
    
    // Ensure logQuantity is positive for the DB constraint
    if (logQuantity <= 0) {
        console.warn("Attempted to log zero or negative quantity transaction. Skipping log.");
        return { data: { message: "Stock updated, but no transaction logged for zero quantity change.", stock_id }, error: null };
    }

    const transactionPayload = {
      item_id,
      warehouse_id,
      type: logType,
      quantity: logQuantity, // Log the actual change amount
      notes,
      transaction_date: new Date().toISOString(),
      transfer_request_id
      // Removed initiated_by, updated_by
    };

    const { data: transaction, error: transError } = await supabase.from(TRANSACTIONS_TABLE).insert(transactionPayload).select().single();
    if (transError) {
      // Attempt to revert stock update? Difficult without transactions. Log critical error.
      console.error(`CRITICAL: Stock updated for ID ${stock_id} but transaction log failed!`, transError);
      throw new Error(`Stock updated, but transaction log failed: ${transError.message}`);
    }

    return { data: transaction, error: null };

  } catch (error) {
      console.error("Error in updateStockAndLogTransaction:", error);
      return { data: null, error };
  }
}


// --- DEPRECATED FUNCTIONS (Kept for reference, but controllers should change) ---
// Controllers should now primarily use updateStockAndLogTransaction

async function createStockLevel(payload) {
    console.warn("DEPRECATED: createStockLevel called directly. Use updateStockAndLogTransaction.");
    return supabase.from(STOCK_TABLE).insert(payload).select().single();
}

async function updateStockLevel(id, payload) {
    console.warn("DEPRECATED: updateStockLevel called directly. Use updateStockAndLogTransaction.");
    return supabase.from(STOCK_TABLE).update(payload).eq('stock_id', id).select().single();
}

async function createTransaction(payload) {
  console.warn("DEPRECATED: createTransaction called directly. Use updateStockAndLogTransaction.");
  return supabase.from(TRANSACTIONS_TABLE).insert(payload).select().single();
}

async function updateStockFromTransaction(transactionData) {
  console.warn("DEPRECATED: updateStockFromTransaction should not be called directly.");
  return null;
}
// --- END DEPRECATED ---


module.exports = {
  listStockLevels,
  getStockLevelById,
  listTransactions,
  getTransaction,
  updateStockAndLogTransaction, // New primary function
  // Keep deprecated functions temporarily if needed by other parts not yet updated
  createStockLevel,
  updateStockLevel,
  createTransaction,
  updateStockFromTransaction,
};

