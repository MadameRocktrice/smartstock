const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendServerError, sendClientError } = require('../utils/errorResponse');

// POST /api/users/register → neuen User registrieren mit Default-Haushalt
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. User erstellen
    const newUser = new User({ username, email, password });
    const savedUser = await newUser.save();

    // 2. Default-Haushalt erstellen
    const Household = require('../models/Household');
    const Category = require('../models/Category');
    const Location = require('../models/Location');

    const defaultHousehold = await Household.create({
      name: 'Mein Haushalt',
      owner: savedUser._id,
      members: [savedUser._id],
      note: 'Willkommen bei SmartStock! Hier kannst du Notizen für deinen Haushalt hinterlassen.',
    });

    savedUser.households.push(defaultHousehold._id);
    await savedUser.save();

    // 3. Default-Kategorien
    const defaultCategories = [
      'Obst & Gemüse',
      'Backwaren',
      'Milchprodukte',
      'Tiefkühlprodukte',
      'Getränke',
      'Haushalt',
      'Sonstiges',
    ];
    await Category.insertMany(
      defaultCategories.map((name) => ({ name, household: defaultHousehold._id }))
    );

    // 4. Default-Standorte
    const defaultLocations = ['Küche', 'Kühlschrank', 'Tiefkühler', 'Vorratsschrank'];
    await Location.insertMany(
      defaultLocations.map((name) => ({ name, household: defaultHousehold._id }))
    );

    // 5. Token erstellen (direkt eingeloggt nach Register)
    const token = jwt.sign(
      { userId: savedUser._id, username: savedUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 6. Antwort: Token + User
    res.status(201).json({
      token,
      user: {
        _id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
      },
    });
  } catch (error) {
    sendClientError(res, error);
  }
});

// POST /api/users/login → User einloggen
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Falsche Email oder Passwort' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Falsche Email oder Passwort' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    sendServerError(res, error);
  }
});

module.exports = router;