const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Atlas verbunden');
  } catch (error) {
    console.error('Fehler beim Verbinden mit MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;