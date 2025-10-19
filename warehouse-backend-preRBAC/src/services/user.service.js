// src/services/user.service.js
const supabase = require('../config/supabaseclient');

const PROFILES_TABLE = 'profiles';

async function getUserById(userId) {
  // The primary key is now 'id' and it's a UUID.
  const { data, error } = await supabase.from(PROFILES_TABLE).select('*').eq('id', userId).single();
  return { data, error };
}

async function listUsers() {
  const { data, error } = await supabase.from(PROFILES_TABLE).select('*');
  return { data, error };
}

// This function is now primarily for creating a user's profile after they have been created in Supabase Auth.
async function createUserProfile(payload) {
  const { data, error } = await supabase.from(PROFILES_TABLE).insert(payload).select().single();
  return { data, error };
}

async function updateUserProfile(userId, payload) {
  const { data, error } = await supabase.from(PROFILES_TABLE).update(payload).eq('id', userId).select().single();
  return { data, error };
}

async function deleteUserProfile(userId) {
 
  const { data, error } = await supabase.from(PROFILES_TABLE).delete().eq('id', userId);
  return { data, error };
}

// Fetches the user's profile along with their role name.
async function getUserWithRole(userId) {
    const { data, error } = await supabase
      .from(PROFILES_TABLE)
      .select(`
        *,
        roles (
          role_name
        )
      `)
      .eq('id', userId)
      .single();
    return { data, error };
  }

module.exports = {
  getUserById,
  listUsers,
  createUserProfile,
  updateUserProfile,
  deleteUserProfile,
  getUserWithRole,
};
