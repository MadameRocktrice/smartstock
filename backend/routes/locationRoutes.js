const express = require('express');
const router = express.Router();
const Location = require('../models/Location');
const authMiddleware = require('../middleware/auth');


// GET /api/locations → alle Standorte
router.get('/', authMiddleware, async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/locations/:id → ein Standort
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Standort nicht gefunden' });
    }
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/locations → neuen Standort erstellen
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newLocation = new Location(req.body);
    const savedLocation = await newLocation.save();
    res.status(201).json(savedLocation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/locations/:id → Standort aktualisieren
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updatedLocation = await Location.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedLocation) {
      return res.status(404).json({ message: 'Standort nicht gefunden' });
    }
    res.json(updatedLocation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/locations/:id → Standort loeschen
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedLocation = await Location.findByIdAndDelete(req.params.id);
    if (!deletedLocation) {
      return res.status(404).json({ message: 'Standort nicht gefunden' });
    }
    res.json({ message: 'Standort gelöscht' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;