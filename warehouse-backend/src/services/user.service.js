const supabase = require('../config/supabaseclient');

const USERS_TABLE = 'users';

async function getUserById(userId) {
  const { data, error } = await supabase.from(USERS_TABLE).select('*').eq('user_id', userId).single();
  return { data, error };
}

async function listUsers() {
  const { data, error } = await supabase.from(USERS_TABLE).select('*');
  return { data, error };
}

async function createUser(payload) {
  const { data, error } = await supabase.from(USERS_TABLE).insert(payload).select().single();
  return { data, error };
}

async function updateUser(userId, payload) {
  const { data, error } = await supabase.from(USERS_TABLE).update(payload).eq('user_id', userId).select().single();
  return { data, error };
}

async function deleteUser(userId) {
  const { data, error } = await supabase.from(USERS_TABLE).delete().eq('user_id', userId);
  return { data, error };
}

async function getUserWithRole(userId) {
  const { data, error } = await supabase
    .from(USERS_TABLE)
    .select(`
      *,
      roles (
        role_name
      )
    `)
    .eq('user_id', userId)
    .single();
  return { data, error };
}

module.exports = {
  getUserById,
  listUsers,
  createUser,
  updateUser,
  getUserWithRole,
  deleteUser
};
