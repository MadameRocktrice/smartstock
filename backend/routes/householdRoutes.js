const express = require('express');
const router = express.Router();
const Household = require('../models/Household');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Alle Haushalt-Routen sind geschützt
router.use(authMiddleware);

// POST /api/households → neuen Haushalt erstellen
router.post('/', async (req, res) => {
  try {
    const newHousehold = new Household({
      name: req.body.name,
      owner: req.user.userId,
      members: [req.user.userId]
    });
    
    const savedHousehold = await newHousehold.save();
    
    // Den User auch zum Haushalt-Array hinzufuegen
    await User.findByIdAndUpdate(req.user.userId, {
      $push: { households: savedHousehold._id }
    });
    
    res.status(201).json(savedHousehold);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST /api/households/:id/invite > User per Email zum Haushalt hinzufügen
router.post('/:id/invite', async (req, res) => {
  try {
    const { email } = req.body;
    
    const household = await Household.findById(req.params.id);
    
    if (!household) {
      return res.status(404).json({ message: 'Haushalt nicht gefunden' });
    }
    
    // Nur Mitglieder duerfen einladen
    if (!household.members.some(m => m.equals(req.user.userId))) {
      return res.status(403).json({ message: 'Du bist kein Mitglied dieses Haushalts' });
    }
    
    // User per Email suchen
    const userToInvite = await User.findOne({ email });
    
    if (!userToInvite) {
      return res.status(404).json({ message: 'Kein User mit dieser Email gefunden' });
    }
    
    // Pruefen, ob User schon Mitglied ist
    if (household.members.some(m => m.equals(userToInvite._id))) {
      return res.status(400).json({ message: 'User ist bereits Mitglied' });
    }
    
    // User zum Haushalt hinzufuegen
    household.members.push(userToInvite._id);
    await household.save();
    
    // Haushalt zur User-Liste hinzufuegen
    userToInvite.households.push(household._id);
    await userToInvite.save();
    
    res.json({ 
      message: 'User erfolgreich hinzugefügt',
      household: household 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/households → alle Haushalte des eingeloggten Users
router.get('/', async (req, res) => {
  try {
    const households = await Household.find({ 
      members: req.user.userId 
    }).populate('members', 'username email').populate('owner', 'username email');
    
    res.json(households);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    
    // Pruefen, ob der User Mitglied ist
    if (!household.members.some(m => m._id.equals(req.user.userId))) {
      return res.status(403).json({ message: 'Du bist kein Mitglied dieses Haushalts' });
    }
    
    res.json(household);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/households/:id > Haushalt aktualisieren (nur Owner)
router.put('/:id', async (req, res) => {
  try {
    const household = await Household.findById(req.params.id);
    
    if (!household) {
      return res.status(404).json({ message: 'Haushalt nicht gefunden' });
    }
    
    // Nur der Owner darf ändern
    if (!household.owner.equals(req.user.userId)) {
      return res.status(403).json({ message: 'Nur der Owner darf den Haushalt ändern' });
    }
    
    household.name = req.body.name || household.name;
    const updatedHousehold = await household.save();
    
    res.json(updatedHousehold);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/households/:id > Haushalt löschen (nur Owner)
router.delete('/:id', async (req, res) => {
  try {
    const household = await Household.findById(req.params.id);
    
    if (!household) {
      return res.status(404).json({ message: 'Haushalt nicht gefunden' });
    }
    
    // Nur der Owner darf löschen
    if (!household.owner.equals(req.user.userId)) {
      return res.status(403).json({ message: 'Nur der Owner darf den Haushalt löschen' });
    }
    
    // Den Haushalt aus den User-Listen aller Mitglieder entfernen
    await User.updateMany(
      { _id: { $in: household.members } },
      { $pull: { households: household._id } }
    );
    
    // Den Haushalt selbst löschen
    await Household.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Haushalt gelöscht' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;