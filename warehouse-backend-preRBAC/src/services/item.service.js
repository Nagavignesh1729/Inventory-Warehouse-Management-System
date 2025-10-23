// src/services/item.service.js
const supabase = require('../config/supabaseclient');
const ITEMS_TABLE = 'items';
const STOCK_TABLE = 'stock_levels';
const WAREHOUSES_TABLE = 'warehouses_old';

/**
 * Fetches items with stock levels and warehouse information
 */
async function listItems(filters = {}) {
  try {
    // Try RPC function first
    const { data, error } = await supabase.rpc('get_item_details', {
      w_id: filters.warehouse_id || null
    });
    
    if (error) {
      console.error("RPC Error: 'get_item_details' function might be missing. Falling back to a basic query.", error);
      
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
          category:categories(name),
          stock_levels(
            quantity,
            warehouse:${WAREHOUSES_TABLE}(warehouse_id, name)
          )
        `);
      
      if (filters.warehouse_id) {
        query = query.eq('stock_levels.warehouse_id', filters.warehouse_id);
      }
      
      const { data: items, error: itemsError } = await query;
      
      if (itemsError) return { data: null, error: itemsError };
      
      // Transform data to match frontend expectations
      const transformedItems = items.map(item => {
        const stockLevel = item.stock_levels?.[0]?.quantity || 0;
        const warehouse = item.stock_levels?.[0]?.warehouse;
        
        return {
          item_id: item.item_id,
          name: item.name,
          sku: item.sku,
          description: item.description,
          category: item.category?.name || 'Uncategorized',
          stock_level: stockLevel,
          warehouse_name: warehouse?.name || 'Unknown',
          warehouse_id: warehouse?.warehouse_id,
          reorder_level: item.reorder_level,
          is_active: item.is_active,
          created_at: item.created_at,
          updated_at: item.updated_at
        };
      });
      
      return { data: transformedItems, error: null };
    }
    
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

async function getItem(id) {
  return supabase
    .from(ITEMS_TABLE)
    .select(`
      *,
      category:categories(*),
      stock_levels(
        quantity,
        warehouse:${WAREHOUSES_TABLE}(*)
      )
    `)
    .eq('item_id', id)
    .single();
}

async function createItem(payload) {
  try {
    // If category is provided as name, find or create the category
    let categoryId = payload.category_id;
    let categoryName = payload.category;
    
    if (!categoryId && payload.category) {
      // Try to find existing category by name
      const { data: existingCategory } = await supabase
        .from('categories')
        .select('category_id, name')
        .eq('name', payload.category)
        .single();
      
      if (existingCategory) {
        categoryId = existingCategory.category_id;
        categoryName = existingCategory.name;
      } else {
        // Create new category
        const { data: newCategory, error: categoryError } = await supabase
          .from('categories')
          .insert({ name: payload.category, description: `Auto-created category for ${payload.category}` })
          .select('category_id, name')
          .single();
        
        if (categoryError) {
          console.error('Category creation error:', categoryError);
          return { data: null, error: categoryError };
        }
        categoryId = newCategory.category_id;
        categoryName = newCategory.name;
      }
    }
    
    if (!categoryId) {
      return { data: null, error: new Error('Category is required') };
    }
    
    // Create item
    const { data: item, error: itemError } = await supabase
      .from(ITEMS_TABLE)
      .insert({
        name: payload.name,
        sku: payload.sku || null,
        description: payload.description || null,
        category_id: categoryId,
        reorder_level: payload.reorder_level || payload.minStockLevel || 0
      })
      .select()
      .single();
    
    if (itemError) return { data: null, error: itemError };
    
    // Get warehouse info if provided
    let warehouseName = 'Unknown';
    if (payload.warehouse_id) {
      const { data: warehouse } = await supabase
        .from(WAREHOUSES_TABLE)
        .select('name')
        .eq('warehouse_id', payload.warehouse_id)
        .single();
      
      if (warehouse) {
        warehouseName = warehouse.name;
      }
    }
    
    // Create stock level entry if warehouse_id and quantity provided
    if (payload.warehouse_id && payload.stockLevel !== undefined) {
      const { error: stockError } = await supabase
        .from(STOCK_TABLE)
        .insert({
          item_id: item.item_id,
          warehouse_id: payload.warehouse_id,
          quantity: payload.stockLevel
        });
      
      if (stockError) {
        console.error('Stock level creation error:', stockError);
        return { data: null, error: stockError };
      }
    }
    
    // Return complete item data in the format expected by frontend
    const completeItem = {
      item_id: item.item_id,
      name: item.name,
      sku: item.sku,
      description: item.description,
      category: categoryName,
      stock_level: payload.stockLevel || 0,
      warehouse_name: warehouseName,
      warehouse_id: payload.warehouse_id,
      reorder_level: item.reorder_level,
      is_active: item.is_active,
      created_at: item.created_at,
      updated_at: item.updated_at
    };
    
    return { data: completeItem, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

async function updateItem(id, payload) {
  // Update item
  const { data: item, error: itemError } = await supabase
    .from(ITEMS_TABLE)
    .update({
      name: payload.name,
      sku: payload.sku,
      description: payload.description,
      category_id: payload.category_id,
      reorder_level: payload.reorder_level
    })
    .eq('item_id', id)
    .select()
    .single();
  
  if (itemError) return { data: null, error: itemError };
  
  // Update stock level if provided
  if (payload.warehouse_id && payload.quantity !== undefined) {
    const { error: stockError } = await supabase
      .from(STOCK_TABLE)
      .upsert({
        item_id: id,
        warehouse_id: payload.warehouse_id,
        quantity: payload.quantity
      });
    
    if (stockError) console.error('Stock level update error:', stockError);
  }
  
  return { data: item, error: null };
}

async function deleteItem(id) {
  // Delete stock levels first (due to foreign key constraint)
  await supabase.from(STOCK_TABLE).delete().eq('item_id', id);
  
  // Then delete the item
  return supabase.from(ITEMS_TABLE).delete().eq('item_id', id);
}

// This function is now part of the main `listItems` RPC logic
// but can be kept for a separate endpoint if needed.
async function getLowStockItems() {
    const { data, error } = await supabase.rpc('get_low_stock_items');
    return { data, error };
}


module.exports = {
  listItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  getLowStockItems,
};
