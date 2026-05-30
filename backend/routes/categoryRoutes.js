const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const authMiddleware = require('../middleware/auth');
const getUserHouseholds = require('../middleware/getUserHouseholds');
const pickUpdateFields = require('../utils/pickUpdateFields');
const validateObjectId = require('../middleware/validateObjectId');
const { sendServerError, sendClientError } = require('../utils/errorResponse');

router.use(authMiddleware);
router.use(getUserHouseholds);
router.param('id', validateObjectId);

// GET /api/categories → alle Kategorien
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({
      household: { $in: req.userHouseholds },
    });
    res.json(categories);
  } catch (error) {
    sendServerError(res, error);
  }
});

// GET /api/categories/:id → eine Kategorie
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Kategorie nicht gefunden' });
    }
    if (!req.userHouseholds.some((h) => h.equals(category.household))) {
      return res.status(403).json({ message: 'Kein Zugriff auf diese Kategorie' });
    }
    res.json(category);
  } catch (error) {
    sendServerError(res, error);
  }
});

// POST /api/categories → neue Kategorie erstellen
router.post('/', async (req, res) => {
  try {
    const data = pickUpdateFields(req.body, ['name', 'description', 'household']);

    if (!data.household) {
      return res.status(400).json({ message: 'Haushalt-ID fehlt' });
    }

    if (!req.userHouseholds.some((h) => h.equals(data.household))) {
      return res.status(403).json({ message: 'Du bist kein Mitglied dieses Haushalts' });
    }

    const savedCategory = await new Category(data).save();
    res.status(201).json(savedCategory);
  } catch (error) {
    sendClientError(res, error);
  }
});

// PUT /api/categories/:id → Kategorie aktualisieren
router.put('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Kategorie nicht gefunden' });
    }

    if (!req.userHouseholds.some((h) => h.equals(category.household))) {
      return res.status(403).json({ message: 'Kein Zugriff auf diese Kategorie' });
    }

    Object.assign(category, pickUpdateFields(req.body, ['name', 'description']));
    const updatedCategory = await category.save();

    res.json(updatedCategory);
  } catch (error) {
    sendClientError(res, error);
  }
});

// DELETE /api/categories/:id → Kategorie loeschen
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Kategorie nicht gefunden' });
    }

    if (!req.userHouseholds.some((h) => h.equals(category.household))) {
      return res.status(403).json({ message: 'Kein Zugriff auf diese Kategorie' });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Kategorie gelöscht' });
  } catch (error) {
    sendServerError(res, error);
  }
});

module.exports = router;
