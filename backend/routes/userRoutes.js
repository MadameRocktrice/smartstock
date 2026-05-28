const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/users/register → neuen User registrieren
router.post('/register', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    
    // Wir geben den User zurueck, aber OHNE Passwort
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

module.exports = router;