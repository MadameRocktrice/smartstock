const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const authMiddleware = require('../middleware/auth');
const Household = require('../models/Household');
const getUserHouseholds = require('../middleware/getUserHouseholds');

router.use(authMiddleware);
router.use(getUserHouseholds);

// GET /api/categories → alle Kategorien
router.get('/', authMiddleware, async (req, res) => {
  try {
    const categories = await Category.find({ 
      household: { $in: req.userHouseholds } 
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/categories/:id → eine Kategorie
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!req.userHouseholds.some(h => h.equals(category.household))) {
      return res.status(403).json({ message: 'Kein Zugriff auf diese Kategorie' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/categories → neue Kategorie erstellen
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (!req.body.household) {
      return res.status(400).json({ message: 'Haushalt-ID fehlt' });
    }
    
    if (!req.userHouseholds.some(h => h.equals(req.body.household))) {
      return res.status(403).json({ message: 'Du bist kein Mitglied dieses Haushalts' });
    }
    
    const newCategory = new Category(req.body);
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/categories/:id → Kategorie aktualisieren
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Kategorie nicht gefunden' });
    }
    
    if (!req.userHouseholds.some(h => h.equals(category.household))) {
      return res.status(403).json({ message: 'Kein Zugriff auf diese Kategorie' });
    }
    
    Object.assign(category, req.body);
    const updatedCategory = await category.save();
    
    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/categories/:id → Kategorie loeschen
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Kategorie nicht gefunden' });
    }
    
    if (!req.userHouseholds.some(h => h.equals(category.household))) {
      return res.status(403).json({ message: 'Kein Zugriff auf diese Kategorie' });
    }
    
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Kategorie gelöscht' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;