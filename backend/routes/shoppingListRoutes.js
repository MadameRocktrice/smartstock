const express = require('express');
const router = express.Router();
const ShoppingListItem = require('../models/ShoppingListItem');
const authMiddleware = require('../middleware/auth');
const getUserHouseholds = require('../middleware/getUserHouseholds');
const pickUpdateFields = require('../utils/pickUpdateFields');
const validateObjectId = require('../middleware/validateObjectId');
const { sendServerError, sendClientError } = require('../utils/errorResponse');

const SHOPPING_LIST_CREATE_FIELDS = [
  'name',
  'quantity',
  'unit',
  'isBought',
  'product',
  'category',
  'household',
];

const SHOPPING_LIST_UPDATE_FIELDS = [
  'name',
  'quantity',
  'unit',
  'isBought',
  'product',
  'category',
];

router.use(authMiddleware);
router.use(getUserHouseholds);
router.param('id', validateObjectId);

// GET /api/shoppinglist → alle Eintraege aus den Haushalten des Users
router.get('/', async (req, res) => {
  try {
    const items = await ShoppingListItem.find({
      household: { $in: req.userHouseholds },
    })
      .populate('product')
      .populate('category')
      .populate('addedBy', 'username')
      .populate('household', 'name');

    res.json(items);
  } catch (error) {
    sendServerError(res, error);
  }
});

// GET /api/shoppinglist/:id → einzelner Eintrag
router.get('/:id', async (req, res) => {
  try {
    const item = await ShoppingListItem.findById(req.params.id)
      .populate('product')
      .populate('category')
      .populate('addedBy', 'username');

    if (!item) {
      return res.status(404).json({ message: 'Eintrag nicht gefunden' });
    }

    if (!req.userHouseholds.some((h) => h.equals(item.household))) {
      return res.status(403).json({ message: 'Kein Zugriff auf diesen Eintrag' });
    }

    res.json(item);
  } catch (error) {
    sendServerError(res, error);
  }
});

// POST /api/shoppinglist → neuen Eintrag erstellen
router.post('/', async (req, res) => {
  try {
    const data = pickUpdateFields(req.body, SHOPPING_LIST_CREATE_FIELDS);

    if (!data.household) {
      return res.status(400).json({ message: 'Haushalt-ID fehlt' });
    }

    if (!req.userHouseholds.some((h) => h.equals(data.household))) {
      return res.status(403).json({ message: 'Du bist kein Mitglied dieses Haushalts' });
    }

    const savedItem = await new ShoppingListItem({
      ...data,
      addedBy: req.user.userId,
    }).save();

    res.status(201).json(savedItem);
  } catch (error) {
    sendClientError(res, error);
  }
});

// PUT /api/shoppinglist/:id → Eintrag aktualisieren (z.B. abhaken)
router.put('/:id', async (req, res) => {
  try {
    const item = await ShoppingListItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Eintrag nicht gefunden' });
    }

    if (!req.userHouseholds.some((h) => h.equals(item.household))) {
      return res.status(403).json({ message: 'Kein Zugriff auf diesen Eintrag' });
    }

    Object.assign(item, pickUpdateFields(req.body, SHOPPING_LIST_UPDATE_FIELDS));
    const updatedItem = await item.save();

    res.json(updatedItem);
  } catch (error) {
    sendClientError(res, error);
  }
});

// DELETE /api/shoppinglist/:id → Eintrag loeschen
router.delete('/:id', async (req, res) => {
  try {
    const item = await ShoppingListItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Eintrag nicht gefunden' });
    }

    if (!req.userHouseholds.some((h) => h.equals(item.household))) {
      return res.status(403).json({ message: 'Kein Zugriff auf diesen Eintrag' });
    }

    await ShoppingListItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Eintrag gelöscht' });
  } catch (error) {
    sendServerError(res, error);
  }
});

module.exports = router;
