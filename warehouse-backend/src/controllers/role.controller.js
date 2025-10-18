// src/controllers/role.controller.js
const roleService = require('../services/role.service');
const { success, error } = require('../utils/response');

async function listRoles(req, res) {
    const { data, error: svcErr } = await roleService.listRoles();
    if(svcErr) return error(res, svcErr.message, 500);
    return success(res, data);
}

async function createRole(req, res) {
    const payload = { ...req.body, created_by: req.user?.id };
    const { data, error: svcErr } = await roleService.createRole(payload);
    if(svcErr) return error(res, svcErr.message, 500);
    return success(res, data, 'Role created', 201);
}

module.exports = {
    listRoles,
    createRole
};
