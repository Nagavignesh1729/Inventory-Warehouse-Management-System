
// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseclient');
const { success, error } = require('../utils/response');

router.post('/register', async (req, res) => {
  try {
    const { email, password, full_name, role_id } = req.body;
    if (!email || !password) return error(res, 'Email and password required', 400);

    // 1️⃣ Create auth user in Supabase
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name, role_id } // store in user_metadata
      }
    });
    if (signUpError) return error(res, signUpError.message, 400);

    // 2️⃣ Optionally insert into "users" table in Supabase DB
    const { data: userRecord, error: insertErr } = await supabase.from('users').insert({
      user_id: data.user.id,
      email,
      username: email.split('@')[0],
      full_name,
      role_id,
      is_active: true,
      created_at: new Date().toISOString()
    }).select().single();

    if (insertErr) return error(res, insertErr.message, 500);

    return success(res, { user: userRecord }, 'Registration successful', 201);
  } catch (err) {
    return error(res, err.message, 500);
  }
});

module.exports = router;

