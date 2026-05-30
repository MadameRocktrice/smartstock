const express = require('express');
const router = express.Router();
const ShoppingListItem = require('../models/ShoppingListItem');
const authMiddleware = require('../middleware/auth');
const getUserHouseholds = require('../middleware/getUserHouseholds');

router.use(authMiddleware);
router.use(getUserHouseholds);

// GET /api/shoppinglist > alle Eintraege aus den Haushalten des Users
router.get('/', async (req, res) => {
  try {
    const items = await ShoppingListItem.find({ 
      household: { $in: req.userHouseholds } 
    })
      .populate('product')
      .populate('category')
      .populate('addedBy', 'username')
      .populate('household', 'name');
    
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/shoppinglist/:id > einzelner Eintrag
router.get('/:id', async (req, res) => {
  try {
    const item = await ShoppingListItem.findById(req.params.id)
      .populate('product')
      .populate('category')
      .populate('addedBy', 'username');
    
    if (!item) {
      return res.status(404).json({ message: 'Eintrag nicht gefunden' });
    }
    
    if (!req.userHouseholds.some(h => h.equals(item.household))) {
      return res.status(403).json({ message: 'Kein Zugriff auf diesen Eintrag' });
    }
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/shoppinglist > neuen Eintrag erstellen
router.post('/', async (req, res) => {
  try {
    if (!req.body.household) {
      return res.status(400).json({ message: 'Haushalt-ID fehlt' });
    }
    
    if (!req.userHouseholds.some(h => h.equals(req.body.household))) {
      return res.status(403).json({ message: 'Du bist kein Mitglied dieses Haushalts' });
    }
    
    // addedBy automatisch aus dem Token setzen
    const newItem = new ShoppingListItem({
      ...req.body,
      addedBy: req.user.userId
    });
    
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/shoppinglist/:id > Eintrag aktualisieren (z.B. abhaken)
router.put('/:id', async (req, res) => {
  try {
    const item = await ShoppingListItem.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Eintrag nicht gefunden' });
    }
    
    if (!req.userHouseholds.some(h => h.equals(item.household))) {
      return res.status(403).json({ message: 'Kein Zugriff auf diesen Eintrag' });
    }
    
    Object.assign(item, req.body);
    const updatedItem = await item.save();
    
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/shoppinglist/:id > Eintrag loeschen
router.delete('/:id', async (req, res) => {
  try {
    const item = await ShoppingListItem.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Eintrag nicht gefunden' });
    }
    
    if (!req.userHouseholds.some(h => h.equals(item.household))) {
      return res.status(403).json({ message: 'Kein Zugriff auf diesen Eintrag' });
    }
    
    await ShoppingListItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Eintrag gelöscht' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;