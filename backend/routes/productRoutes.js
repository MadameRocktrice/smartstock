const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');
const Household = require('../models/Household');
const getUserHouseholds = require('../middleware/getUserHouseholds');

router.use(authMiddleware);
router.use(getUserHouseholds);

// GET /api/products > alle Produkte abrufen
router.get('/', authMiddleware, async (req, res) => {
  try {
    const products = await Product.find({ 
      household: { $in: req.userHouseholds } 
    }).populate('location').populate('category');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/products/:id > ein einzelnes Produkt abrufen
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('location');
    if (!product) {
      return res.status(404).json({ message: 'Produkt nicht gefunden' });
    }
    if (!req.userHouseholds.some(h => h.equals(product.household))) {
      return res.status(403).json({ message: 'Kein Zugriff auf dieses Produkt' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/products > neues Produkt erstellen
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (!req.body.household) {
      return res.status(400).json({ message: 'Haushalt-ID fehlt' });
    }
    
    if (!req.userHouseholds.some(h => h.equals(req.body.household))) {
      return res.status(403).json({ message: 'Du bist kein Mitglied dieses Haushalts' });
    }
    
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/products/:id > ein Produkt aktualisieren
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Produkt nicht gefunden' });
    }
    
    if (!req.userHouseholds.some(h => h.equals(product.household))) {
      return res.status(403).json({ message: 'Kein Zugriff auf dieses Produkt' });
    }
    
    Object.assign(product, req.body);
    const updatedProduct = await product.save();
    
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/products/:id > ein Produkt loeschen
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Produkt nicht gefunden' });
    }
    
    if (!req.userHouseholds.some(h => h.equals(product.household))) {
      return res.status(403).json({ message: 'Kein Zugriff auf dieses Produkt' });
    }
    
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Produkt gelöscht' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;