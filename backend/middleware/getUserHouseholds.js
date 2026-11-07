const User = require('../models/User');
const { sendServerError } = require('../utils/errorResponse');

const getUserHouseholds = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User nicht gefunden' });
    }

    // Alle Haushalte des Users (für Checks wie "ist Mitglied")
    req.userHouseholds = user.households;

    // Aktiver Haushalt = der zuletzt beigetretene (letzter in der Liste)
    req.activeHousehold = user.households.length > 0
      ? user.households[user.households.length - 1]
      : null;

    next();
  } catch (error) {
    sendServerError(res, error);
  }
};

module.exports = getUserHouseholds;