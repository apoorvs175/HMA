const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

// Admin, Owner, Warden Login
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  console.log(`--- LOGIN ATTEMPT --- Email: ${email}, Role: ${role}`);
  let table = '';

  if (role === 'admin') table = 'admins';
  else if (role === 'owner') table = 'owners';
  else if (role === 'warden') table = 'wardens';
  else {
    console.log(`--- LOGIN FAILED --- Invalid role: ${role}`);
    return res.status(400).json({ error: 'Invalid role specified.' });
  }

  try {
    const result = await db.query(`SELECT * FROM ${table} WHERE email = $1`, [email]);
    console.log(`--- DB QUERY --- Table: ${table}, Found: ${result.rows.length > 0}`);
    
    if (result.rows.length === 0) {
      console.log(`--- LOGIN FAILED --- User not found in ${table}`);
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const user = result.rows[0];
    console.log(`--- AUTH DEBUG --- Input: ${password}, DB Hash: ${user.password}`);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`--- BCRYPT CHECK --- Match: ${isMatch}`);
    
    if (!isMatch) {
      console.log(`--- LOGIN FAILED --- Password mismatch for ${email}`);
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const payload = { id: user.admin_id || user.owner_id || user.warden_id, role: role, name: user.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1d' });

    console.log(`--- LOGIN SUCCESS --- User: ${user.name}, Role: ${role}`);
    res.json({ token, user: payload });
  } catch (err) {
    console.error(`--- LOGIN ERROR ---`, err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Admin Registration (Initial setup or through other admin)
router.post('/register/admin', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await db.query(
      'INSERT INTO admins (name, email, password) VALUES ($1, $2, $3) RETURNING admin_id, name, email',
      [name, email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
