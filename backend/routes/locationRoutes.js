const express = require('express');
const router = express.Router();
const Location = require('../models/Location');
const authMiddleware = require('../middleware/auth');
const getUserHouseholds = require('../middleware/getUserHouseholds');
const pickUpdateFields = require('../utils/pickUpdateFields');
const validateObjectId = require('../middleware/validateObjectId');
const { sendServerError, sendClientError } = require('../utils/errorResponse');

router.use(authMiddleware);
router.use(getUserHouseholds);
router.param('id', validateObjectId);

// GET /api/locations → alle Standorte
router.get('/', async (req, res) => {
  try {
    const locations = await Location.find({
      household: { $in: req.userHouseholds },
    });
    res.json(locations);
  } catch (error) {
    sendServerError(res, error);
  }
});

// GET /api/locations/:id → ein Standort
router.get('/:id', async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Standort nicht gefunden' });
    }
    if (!req.userHouseholds.some((h) => h.equals(location.household))) {
      return res.status(403).json({ message: 'Kein Zugriff auf diesen Standort' });
    }
    res.json(location);
  } catch (error) {
    sendServerError(res, error);
  }
});

// POST /api/locations → neuen Standort erstellen
router.post('/', async (req, res) => {
  try {
    const data = pickUpdateFields(req.body, ['name', 'description', 'household']);

    if (!data.household) {
      return res.status(400).json({ message: 'Haushalt-ID fehlt' });
    }

    if (!req.userHouseholds.some((h) => h.equals(data.household))) {
      return res.status(403).json({ message: 'Du bist kein Mitglied dieses Haushalts' });
    }

    const savedLocation = await new Location(data).save();
    res.status(201).json(savedLocation);
  } catch (error) {
    sendClientError(res, error);
  }
});

// PUT /api/locations/:id → Standort aktualisieren
router.put('/:id', async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({ message: 'Standort nicht gefunden' });
    }

    if (!req.userHouseholds.some((h) => h.equals(location.household))) {
      return res.status(403).json({ message: 'Kein Zugriff auf diesen Standort' });
    }

    Object.assign(location, pickUpdateFields(req.body, ['name', 'description']));
    const updatedLocation = await location.save();

    res.json(updatedLocation);
  } catch (error) {
    sendClientError(res, error);
  }
});

// DELETE /api/locations/:id → Standort löschen
router.delete('/:id', async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({ message: 'Standort nicht gefunden' });
    }

    if (!req.userHouseholds.some((h) => h.equals(location.household))) {
      return res.status(403).json({ message: 'Kein Zugriff auf diesen Standort' });
    }

    await Location.findByIdAndDelete(req.params.id);
    res.json({ message: 'Standort gelöscht' });
  } catch (error) {
    sendServerError(res, error);
  }
});

module.exports = router;
