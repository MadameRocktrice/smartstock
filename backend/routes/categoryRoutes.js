const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const authMiddleware = require('../middleware/auth');
const Household = require('../models/Household');


// GET /api/categories → alle Kategorien
router.get('/', authMiddleware, async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/categories/:id → eine Kategorie
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Kategorie nicht gefunden' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/categories → neue Kategorie erstellen
router.post('/', authMiddleware, async (req, res) => {
  try {
    // Prüfen, ob household mitgeschickt wurde
    if (!req.body.household) {
      return res.status(400).json({ message: 'Haushalt-ID fehlt' });
    }
    
    // Pruefen, ob User Mitglied dieses Haushalts ist
    const household = await Household.findById(req.body.household);
    
    if (!household) {
      return res.status(404).json({ message: 'Haushalt nicht gefunden' });
    }
    
    if (!household.members.some(m => m.equals(req.user.userId))) {
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
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Kategorie nicht gefunden' });
    }
    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/categories/:id → Kategorie loeschen
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Kategorie nicht gefunden' });
    }
    res.json({ message: 'Kategorie gelöscht' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;