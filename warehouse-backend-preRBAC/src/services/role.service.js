// src/services/role.service.js
const supabase = require('../config/supabaseclient');
const ROLES_TABLE = 'roles';

async function listRoles() {
  return supabase.from(ROLES_TABLE).select('*');
}

async function createRole(payload) {
  return supabase.from(ROLES_TABLE).insert(payload).select().single();
}

module.exports = {
    listRoles,
    createRole
};
