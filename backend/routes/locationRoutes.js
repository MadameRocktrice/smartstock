const express = require('express');
const router = express.Router();
const Location = require('../models/Location');
const authMiddleware = require('../middleware/auth');
const Household = require('../models/Household');
const getUserHouseholds = require('../middleware/getUserHouseholds');

router.use(authMiddleware);
router.use(getUserHouseholds);

// GET /api/locations → alle Standorte
router.get('/', authMiddleware, async (req, res) => {
  try {
    const locations = await Location.find({ 
      household: { $in: req.userHouseholds } 
    });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/locations/:id → ein Standort
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!req.userHouseholds.some(h => h.equals(location.household))) {
      return res.status(403).json({ message: 'Kein Zugriff auf diesen Standort' });
    }
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/locations → neuen Standort erstellen
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (!req.body.household) {
      return res.status(400).json({ message: 'Haushalt-ID fehlt' });
    }
    
    if (!req.userHouseholds.some(h => h.equals(req.body.household))) {
      return res.status(403).json({ message: 'Du bist kein Mitglied dieses Haushalts' });
    }
    
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
    const location = await Location.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({ message: 'Standort nicht gefunden' });
    }
    
    if (!req.userHouseholds.some(h => h.equals(location.household))) {
      return res.status(403).json({ message: 'Kein Zugriff auf diesen Standort' });
    }
    
    Object.assign(location, req.body);
    const updatedLocation = await location.save();
    
    res.json(updatedLocation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/locations/:id > Standort löschen
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({ message: 'Standort nicht gefunden' });
    }
    
    if (!req.userHouseholds.some(h => h.equals(location.household))) {
      return res.status(403).json({ message: 'Kein Zugriff auf diesen Standort' });
    }
    
    await Location.findByIdAndDelete(req.params.id);
    res.json({ message: 'Standort gelöscht' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;