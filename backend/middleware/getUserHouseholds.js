const User = require('../models/User');
const { sendServerError } = require('../utils/errorResponse');

const getUserHouseholds = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User nicht gefunden' });
    }

    req.userHouseholds = user.households;
    next();
  } catch (error) {
    sendServerError(res, error);
  }
};

module.exports = getUserHouseholds;