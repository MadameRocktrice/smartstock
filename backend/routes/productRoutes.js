const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');
const getUserHouseholds = require('../middleware/getUserHouseholds');
const pickUpdateFields = require('../utils/pickUpdateFields');
const validateObjectId = require('../middleware/validateObjectId');
const { sendServerError, sendClientError } = require('../utils/errorResponse');

const PRODUCT_FIELDS = [
  'name',
  'currentAmount',
  'minAmount',
  'unit',
  'expiryDate',
  'location',
  'category',
  'household',
];

router.use(authMiddleware);
router.use(getUserHouseholds);
router.param('id', validateObjectId);

// GET /api/products → Produkte des aktiven Haushalts abrufen
router.get('/', async (req, res) => {
  try {
    if (!req.activeHousehold) {
      return res.json([]);  // Kein Haushalt → keine Produkte
    }

    const products = await Product.find({
      household: req.activeHousehold,
    })
      .populate('location')
      .populate('category');
    res.json(products);
  } catch (error) {
    sendServerError(res, error);
  }
});

// GET /api/products/:id → ein einzelnes Produkt abrufen
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('location');
    if (!product) {
      return res.status(404).json({ message: 'Produkt nicht gefunden' });
    }
    if (!req.userHouseholds.some((h) => h.equals(product.household))) {
      return res.status(403).json({ message: 'Kein Zugriff auf dieses Produkt' });
    }
    res.json(product);
  } catch (error) {
    sendServerError(res, error);
  }
});

// POST /api/products → neues Produkt erstellen
router.post('/', async (req, res) => {
  try {
    const data = pickUpdateFields(req.body, PRODUCT_FIELDS);

    if (!data.household) {
      return res.status(400).json({ message: 'Haushalt-ID fehlt' });
    }

    if (!req.userHouseholds.some((h) => h.equals(data.household))) {
      return res.status(403).json({ message: 'Du bist kein Mitglied dieses Haushalts' });
    }

    const savedProduct = await new Product(data).save();
    req.io.to(`household_${savedProduct.household}`).emit('product:created', savedProduct);
    res.status(201).json(savedProduct);
  } catch (error) {
    sendClientError(res, error);
  }
});

// PUT /api/products/:id → ein Produkt aktualisieren
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Produkt nicht gefunden' });
    }

    if (!req.userHouseholds.some((h) => h.equals(product.household))) {
      return res.status(403).json({ message: 'Kein Zugriff auf dieses Produkt' });
    }

    Object.assign(
      product,
      pickUpdateFields(req.body, PRODUCT_FIELDS.filter((field) => field !== 'household'))
    );
    const updatedProduct = await product.save();

    req.io.to(`household_${updatedProduct.household}`).emit('product:updated', updatedProduct);

    res.json(updatedProduct);
  } catch (error) {
    sendClientError(res, error);
  }
});

// DELETE /api/products/:id → ein Produkt loeschen
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Produkt nicht gefunden' });
    }

    if (!req.userHouseholds.some((h) => h.equals(product.household))) {
      return res.status(403).json({ message: 'Kein Zugriff auf dieses Produkt' });
    }

    const householdId = product.household;

    await Product.findByIdAndDelete(req.params.id);

    req.io.to(`household_${householdId}`).emit('product:deleted', { _id: req.params.id });

    res.json({ message: 'Produkt gelöscht' });
  } catch (error) {
    sendServerError(res, error);
  }
});

module.exports = router;
