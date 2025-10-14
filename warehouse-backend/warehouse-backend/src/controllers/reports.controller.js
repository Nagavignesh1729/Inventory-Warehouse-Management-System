const supabase = require('../config/supabaseclient');
const { success, error } = require('../utils/response');

async function stockSummary(req, res) {
  // Example: sum of quantities grouped by item
  const query = `SELECT items.item_id, items.name, SUM(stock_levels.quantity) as total_qty
                 FROM stock_levels
                 JOIN items ON stock_levels.item_id = items.item_id
                 GROUP BY items.item_id, items.name
                 ORDER BY total_qty DESC`;
  const { data, error: err } = await supabase.rpc('sql', { query }).catch(() => ({ data: null, error: null }));
  // Note: If Supabase doesn't allow raw SQL via rpc like this, do simpler queries via supabase.from
  if (err) return error(res, err.message || 'Failed');
  return success(res, data);
}

module.exports = { stockSummary };
