const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');
const Household = require('../models/Household');

// GET /api/products > alle Produkte abrufen
router.get('/', authMiddleware, async (req, res) => {
  try {
    const products = await Product.find().populate('location').populate('category');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/products/:id → ein einzelnes Produkt abrufen
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('location');
    if (!product) {
      return res.status(404).json({ message: 'Produkt nicht gefunden' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/products > neues Produkt erstellen
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
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/products/:id → ein Produkt aktualisieren
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Produkt nicht gefunden' });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/products/:id → ein Produkt loeschen
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Produkt nicht gefunden' });
    }
    res.json({ message: 'Produkt gelöscht' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;