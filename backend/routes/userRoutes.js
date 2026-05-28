const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/users/register → neuen User registrieren
router.post('/register', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    
    // User zurückgeben, aber ohne Passwort
    res.status(201).json({
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      createdAt: savedUser.createdAt
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST /api/users/login → User einloggen
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 1. User mit dieser Email suchen
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Falsche Email oder Passwort' });
    }
    
    // 2. Passwort vergleichen
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Falsche Email oder Passwort' });
    }
    
    // 3. Token erstellen
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // 4. Token + User zurückschicken (ohne Passwort)
    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;