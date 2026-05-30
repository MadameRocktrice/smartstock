const express = require('express');
const router = express.Router();
const Household = require('../models/Household');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Location = require('../models/Location');
const ShoppingListItem = require('../models/ShoppingListItem');
const authMiddleware = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');
const { sendServerError, sendClientError } = require('../utils/errorResponse');

router.use(authMiddleware);
router.param('id', validateObjectId);

// POST /api/households → neuen Haushalt erstellen
router.post('/', async (req, res) => {
  try {
    const newHousehold = new Household({
      name: req.body.name,
      owner: req.user.userId,
      members: [req.user.userId],
    });

    const savedHousehold = await newHousehold.save();

    await User.findByIdAndUpdate(req.user.userId, {
      $push: { households: savedHousehold._id },
    });

    res.status(201).json(savedHousehold);
  } catch (error) {
    sendClientError(res, error);
  }
});

// POST /api/households/:id/invite → User per Email zum Haushalt hinzufügen
router.post('/:id/invite', async (req, res) => {
  try {
    const { email } = req.body;

    const household = await Household.findById(req.params.id);

    if (!household) {
      return res.status(404).json({ message: 'Haushalt nicht gefunden' });
    }

    if (!household.members.some((m) => m.equals(req.user.userId))) {
      return res.status(403).json({ message: 'Du bist kein Mitglied dieses Haushalts' });
    }

    const userToInvite = await User.findOne({ email });

    if (!userToInvite) {
      return res.status(404).json({ message: 'Kein User mit dieser Email gefunden' });
    }

    if (household.members.some((m) => m.equals(userToInvite._id))) {
      return res.status(400).json({ message: 'User ist bereits Mitglied' });
    }

    household.members.push(userToInvite._id);
    await household.save();

    userToInvite.households.push(household._id);
    await userToInvite.save();

    res.json({
      message: 'User erfolgreich hinzugefügt',
      household,
    });
  } catch (error) {
    sendServerError(res, error);
  }
});

// GET /api/households → alle Haushalte des eingeloggten Users
router.get('/', async (req, res) => {
  try {
    const households = await Household.find({
      members: req.user.userId,
    })
      .populate('members', 'username email')
      .populate('owner', 'username email');

    res.json(households);
  } catch (error) {
    sendServerError(res, error);
  }
});

// GET /api/households/:id → ein einzelner Haushalt
router.get('/:id', async (req, res) => {
  try {
    const household = await Household.findById(req.params.id)
      .populate('members', 'username email')
      .populate('owner', 'username email');

    if (!household) {
      return res.status(404).json({ message: 'Haushalt nicht gefunden' });
    }

    if (!household.members.some((m) => m._id.equals(req.user.userId))) {
      return res.status(403).json({ message: 'Du bist kein Mitglied dieses Haushalts' });
    }

    res.json(household);
  } catch (error) {
    sendServerError(res, error);
  }
});

// PUT /api/households/:id → Haushalt aktualisieren (nur Owner)
router.put('/:id', async (req, res) => {
  try {
    const household = await Household.findById(req.params.id);

    if (!household) {
      return res.status(404).json({ message: 'Haushalt nicht gefunden' });
    }

    if (!household.owner.equals(req.user.userId)) {
      return res.status(403).json({ message: 'Nur der Owner darf den Haushalt ändern' });
    }

    household.name = req.body.name || household.name;
    const updatedHousehold = await household.save();

    res.json(updatedHousehold);
  } catch (error) {
    sendClientError(res, error);
  }
});

// DELETE /api/households/:id → Haushalt löschen (nur Owner)
router.delete('/:id', async (req, res) => {
  try {
    const household = await Household.findById(req.params.id);

    if (!household) {
      return res.status(404).json({ message: 'Haushalt nicht gefunden' });
    }

    if (!household.owner.equals(req.user.userId)) {
      return res.status(403).json({ message: 'Nur der Owner darf den Haushalt löschen' });
    }

    const householdId = household._id;

    await Promise.all([
      Product.deleteMany({ household: householdId }),
      Category.deleteMany({ household: householdId }),
      Location.deleteMany({ household: householdId }),
      ShoppingListItem.deleteMany({ household: householdId }),
    ]);

    await User.updateMany(
      { _id: { $in: household.members } },
      { $pull: { households: householdId } }
    );

    await Household.findByIdAndDelete(req.params.id);

    res.json({ message: 'Haushalt gelöscht' });
  } catch (error) {
    sendServerError(res, error);
  }
});

module.exports = router;
