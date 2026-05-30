const mongoose = require('mongoose');

const validateObjectId = (req, res, next, id) => {
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Ungültige ID' });
  }
  next();
};

module.exports = validateObjectId;
