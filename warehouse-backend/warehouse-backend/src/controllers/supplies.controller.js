// src/controllers/suppliers.controller.js
import { supabase } from '../config/supabaseclient.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getAllSuppliers = async (req, res) => {
  try {
    const { data, error } = await supabase.from('suppliers').select('*');
    if (error) throw error;
    return sendSuccess(res, data, 'Suppliers fetched successfully');
  } catch (err) {
    return sendError(res, err.message);
  }
};

export const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('suppliers').select('*').eq('id', id).single();
    if (error) throw error;
    return sendSuccess(res, data, 'Supplier fetched successfully');
  } catch (err) {
    return sendError(res, err.message);
  }
};

export const addSupplier = async (req, res) => {
  try {
    const { name, contact, email, address } = req.body;
    const { data, error } = await supabase.from('suppliers').insert([{ name, contact, email, address }]).select();
    if (error) throw error;
    return sendSuccess(res, data, 'Supplier added successfully');
  } catch (err) {
    return sendError(res, err.message);
  }
};

export const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact, email, address } = req.body;
    const { data, error } = await supabase
      .from('suppliers')
      .update({ name, contact, email, address })
      .eq('id', id)
      .select();
    if (error) throw error;
    return sendSuccess(res, data, 'Supplier updated successfully');
  } catch (err) {
    return sendError(res, err.message);
  }
};

export const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('suppliers').delete().eq('id', id);
    if (error) throw error;
    return sendSuccess(res, null, 'Supplier deleted successfully');
  } catch (err) {
    return sendError(res, err.message);
  }
};
