// src/services/item.service.js
const supabase = require('../config/supabaseclient');
const stockService = require('./stock.service'); // Import stock service
const ITEMS_TABLE = 'items';
const STOCK_TABLE = 'stock_levels';
const WAREHOUSES_TABLE = 'warehouses_old';
const TRANSACTIONS_TABLE = 'transactions';
const TRANSFERS_TABLE = 'transfer_requests';

// ... listItems, getItem remain the same ...
async function listItems(filters = {}) {
  try {
    // Try RPC function first
    const { data, error } = await supabase.rpc('get_item_details', {
      w_id: filters.warehouse_id || null
    });

    if (error) {
      console.warn("RPC 'get_item_details' failed or missing. Falling back to basic query.", error.message);

      // Fallback query with joins
      let query = supabase
        .from(ITEMS_TABLE)
        .select(`
          item_id,
          name,
          sku,
          description,
          reorder_level,
          is_active,
          created_at,
          updated_at,
          category:categories(category_id, name),
          stock_levels!left(
            quantity,
            warehouse:${WAREHOUSES_TABLE}(warehouse_id, name)
          )
        `);

       // Note: Filtering by warehouse_id in a LEFT JOIN requires a different approach
       // This simple fallback might show items without stock in the specified warehouse.
       // A more complex query or filtering after fetching might be needed for exact matching.

      const { data: items, error: itemsError } = await query;
      if (itemsError) throw itemsError;

      // Transform data to match frontend expectations (handling potential nulls)
      const transformedItems = items.map(item => {
        // Aggregate stock across all warehouses if no filter, or use specific warehouse if filtered
        const totalStock = item.stock_levels?.reduce((sum, stock) => sum + (stock.quantity || 0), 0) || 0;
        let warehouseName = 'Multiple';
        let warehouseId = null;

        if (filters.warehouse_id && item.stock_levels) {
            const specificStock = item.stock_levels.find(sl => sl.warehouse?.warehouse_id === filters.warehouse_id);
            if (specificStock) {
                warehouseName = specificStock.warehouse?.name || 'Unknown';
                warehouseId = specificStock.warehouse?.warehouse_id;
            } else {
                 warehouseName = 'N/A in selected'; // Not in the filtered warehouse
            }
        } else if (item.stock_levels?.length === 1) {
             warehouseName = item.stock_levels[0].warehouse?.name || 'Unknown';
             warehouseId = item.stock_levels[0].warehouse?.warehouse_id;
        } else if (item.stock_levels?.length === 0) {
            warehouseName = 'None';
        }


        return {
          id: item.item_id, // Use 'id' for frontend consistency
          name: item.name,
          sku: item.sku,
          description: item.description,
          category: item.category?.name || 'Uncategorized',
          category_id: item.category?.category_id, // Include category_id
          stockLevel: totalStock, // Show total stock across all warehouses
          warehouse: warehouseName, // Indicate specific or multiple warehouses
          warehouse_id: warehouseId, // Include specific ID if applicable
          reorderLevel: item.reorder_level, // Use 'reorderLevel'
          isActive: item.is_active,
          created_at: item.created_at,
          updated_at: item.updated_at,
           // Add status based on total stock vs reorder level
          status: totalStock > item.reorder_level ? 'In Stock' : totalStock > 0 ? 'Low Stock' : 'Out of Stock'
        };
      });

      return { data: transformedItems, error: null };
    }
     // Process data from RPC if successful
     const transformedRpcData = data.map(item => ({
        ...item,
        id: item.item_id, // Ensure 'id' field
        reorderLevel: item.reorder_level,
        stockLevel: item.stock_level, // Ensure correct field name
         status: item.stock_level > item.reorder_level ? 'In Stock' : item.stock_level > 0 ? 'Low Stock' : 'Out of Stock'
     }));

    return { data: transformedRpcData, error };
  } catch (err) {
    console.error("Error in listItems:", err);
    return { data: null, error: err };
  }
}

async function getItem(id) {
  // Fetch single item with related category and stock levels
  const { data, error} = await supabase
    .from(ITEMS_TABLE)
    .select(`
      *,
      category:categories(*),
      stock_levels(
        *,
        warehouse:${WAREHOUSES_TABLE}(*)
      )
    `)
    .eq('item_id', id)
    .single();

   if (error) return { data, error };

   // Transform data
    const totalStock = data.stock_levels?.reduce((sum, stock) => sum + (stock.quantity || 0), 0) || 0;
    const transformedData = {
        ...data,
        id: data.item_id,
        reorderLevel: data.reorder_level,
        stockLevel: totalStock,
        status: totalStock > data.reorder_level ? 'In Stock' : totalStock > 0 ? 'Low Stock' : 'Out of Stock',
        category_name: data.category?.name // Add category name
    };

    return { data: transformedData, error: null};
}


/**
 * FIXED: Uses centralized stock service for initial stock.
 * Handles category finding/creation. Removed user tracking.
 */
async function createItem(payload) {
  try {
    let categoryId = payload.category_id;
    let categoryName = payload.category; // Expecting name from frontend

    // 1. Find or Create Category if name is provided instead of ID
    if (!categoryId && categoryName) {
      const { data: existingCategory, error: findError } = await supabase
        .from('categories')
        .select('category_id, name')
        .ilike('name', categoryName) // Case-insensitive search
        .single();

      if (findError && findError.code !== 'PGRST116') throw findError; // Handle DB errors other than 'not found'

      if (existingCategory) {
        categoryId = existingCategory.category_id;
        categoryName = existingCategory.name; // Use consistent casing from DB
      } else {
        // Create new category if not found
        const { data: newCategory, error: categoryError } = await supabase
          .from('categories')
          .insert({ name: categoryName /* description removed */ })
          .select('category_id, name')
          .single();
        if (categoryError) throw new Error(`Failed to create category: ${categoryError.message}`);
        categoryId = newCategory.category_id;
        categoryName = newCategory.name;
      }
    } else if (categoryId && !categoryName) {
         // If only ID is provided, fetch the name
         const { data: catData } = await supabase.from('categories').select('name').eq('category_id', categoryId).single();
         categoryName = catData?.name || 'Unknown Category';
    }


    if (!categoryId) {
      throw new Error('Category is required (either name or category_id)');
    }

    // 2. Create the item
    const { data: item, error: itemError } = await supabase
      .from(ITEMS_TABLE)
      .insert({
        name: payload.name,
        sku: payload.sku || null,
        description: payload.description || null,
        category_id: categoryId,
        reorder_level: payload.minStockLevel || payload.reorderLevel || 0 // Use frontend field name
        // created_by, updated_by removed
      })
      .select()
      .single();

    if (itemError) throw itemError;

    // 3. Set Initial Stock using the centralized service
    let initialStockResult = null;
    if (payload.warehouse_id && payload.stockLevel != null && payload.stockLevel > 0) {
      const { data: stockData, error: stockError } = await stockService.updateStockAndLogTransaction({
          item_id: item.item_id,
          warehouse_id: payload.warehouse_id,
          type: 'IN', // Use 'IN' for initial stock
          quantity: parseInt(payload.stockLevel, 10),
          notes: 'Initial stock on item creation'
          // initiated_by removed
      });
      if (stockError) {
         // Attempt to roll back item creation if stock update fails? Complex without transactions.
         console.error(`Item ${item.item_id} created, but initial stock update failed:`, stockError);
         // Return the created item but include the stock error information
         initialStockResult = { error: stockError.message };
         // Optionally: await supabase.from(ITEMS_TABLE).delete().eq('item_id', item.item_id); throw stockError;
      } else {
         initialStockResult = stockData;
      }
    }

    // 4. Fetch warehouse name for response consistency
    let warehouseName = 'N/A';
    if (payload.warehouse_id) {
        const { data: wh } = await supabase.from(WAREHOUSES_TABLE).select('name').eq('warehouse_id', payload.warehouse_id).single();
        warehouseName = wh?.name || 'Unknown Warehouse';
    }

    // 5. Format response like listItems
     const responseItem = {
      id: item.item_id,
      name: item.name,
      sku: item.sku,
      description: item.description,
      category: categoryName,
      category_id: categoryId,
      stockLevel: payload.stockLevel || 0,
      warehouse: warehouseName,
      warehouse_id: payload.warehouse_id,
      reorderLevel: item.reorder_level,
      isActive: item.is_active,
      created_at: item.created_at,
      updated_at: item.updated_at,
      status: (payload.stockLevel || 0) > item.reorder_level ? 'In Stock' : (payload.stockLevel || 0) > 0 ? 'Low Stock' : 'Out of Stock',
      initialStockResult // Include result/error from stock update
    };

    return { data: responseItem, error: initialStockResult?.error ? new Error(initialStockResult.error) : null };

  } catch (err) {
    console.error("Error in createItem service:", err);
    return { data: null, error: err };
  }
}

/**
 * FIXED: Simplified update, removed direct stock update. Removed user tracking.
 * Stock updates should happen via stock controller/service.
 */
async function updateItem(id, payload) {
   try {
     let categoryId = payload.category_id;

     // Find category ID if only name is provided
     if (!categoryId && payload.category) {
        const { data: catData } = await supabase.from('categories').select('category_id').ilike('name', payload.category).single();
        if (catData) categoryId = catData.category_id;
        else throw new Error(`Category '${payload.category}' not found.`); // Or handle creation?
     }

     const updatePayload = {
        name: payload.name,
        sku: payload.sku,
        description: payload.description,
        reorder_level: payload.minStockLevel || payload.reorderLevel, // Use frontend field name
        is_active: payload.isActive
        // updated_by removed
     };
     // Only include category_id if it was resolved
     if (categoryId) {
       updatePayload.category_id = categoryId;
     }

     const { data: item, error: itemError } = await supabase
        .from(ITEMS_TABLE)
        .update(updatePayload)
        .eq('item_id', id)
        .select() // Select updated data
        .single(); // Expect single row

     if (itemError) throw itemError;
     if (!item) return { data: null, error: new Error("Item not found for update.")};

      // Fetch category name for response consistency
     const { data: catData } = await supabase.from('categories').select('name').eq('category_id', item.category_id).single();

     // Format response like listItems
     const responseItem = {
      id: item.item_id,
      name: item.name,
      sku: item.sku,
      description: item.description,
      category: catData?.name || 'Unknown',
      category_id: item.category_id,
      // Stock level is NOT updated here, fetch current if needed or rely on separate calls
      reorderLevel: item.reorder_level,
      isActive: item.is_active,
      created_at: item.created_at,
      updated_at: item.updated_at,
      // Status depends on current stock, cannot reliably determine here
    };

     return { data: responseItem, error: null };
   } catch (err) {
       console.error("Error updating item:", err);
       return { data: null, error: err };
   }
}


/**
 * FIXED: Deletes related records from transfers, transactions, and stock levels first.
 */
async function deleteItem(id) {
  try {
      console.log(`Attempting to delete item ${id} and related data...`);

      // 1. Delete associated Transactions
      const { error: transError } = await supabase.from(TRANSACTIONS_TABLE).delete().eq('item_id', id);
      if (transError) console.warn(`Could not delete transactions for item ${id}: ${transError.message}`);
      else console.log(`Deleted transactions for item ${id}`);

      // 2. Delete associated Transfer Requests
      const { error: transferError } = await supabase.from(TRANSFERS_TABLE).delete().eq('item_id', id);
      if (transferError) console.warn(`Could not delete transfer requests for item ${id}: ${transferError.message}`);
      else console.log(`Deleted transfer requests for item ${id}`);

      // 3. Delete associated Stock Levels
      const { error: stockError } = await supabase.from(STOCK_TABLE).delete().eq('item_id', id);
      if (stockError) console.warn(`Could not delete stock levels for item ${id}: ${stockError.message}`);
      else console.log(`Deleted stock levels for item ${id}`);

      // 4. Delete the Item itself
      const { data, error: itemError } = await supabase.from(ITEMS_TABLE).delete().eq('item_id', id).select().single(); // Use select to confirm deletion
      if (itemError) throw itemError; // If item deletion fails, it's a bigger issue
       if (!data) return {data: null, error: new Error("Item not found or already deleted.")}


      console.log(`Successfully deleted item ${id}`);
      return { data, error: null }; // Return data indicating success

  } catch (error) {
      console.error(`Failed to delete item ${id}:`, error);
      return { data: null, error };
  }
}


async function getLowStockItems() {
    // This assumes an RPC function 'get_low_stock_items' exists in Supabase
    // that correctly joins items and stock_levels and compares quantity <= reorder_level.
    const { data, error } = await supabase.rpc('get_low_stock_items');
     if (error) console.error("Error calling RPC get_low_stock_items:", error);
     // Transform data
     const transformedData = data?.map(item => ({
        ...item,
        id: item.item_id,
        reorderLevel: item.reorder_level,
        stockLevel: item.quantity, // RPC likely returns quantity directly
        warehouse: item.warehouse_name,
        status: item.quantity > 0 ? 'Low Stock' : 'Out of Stock'
     })) || [];
    return { data: transformedData, error };
}


module.exports = {
  listItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  getLowStockItems,
};

