const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  households: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Household'
  }]
},{
  timestamps: true
});

// Passwort automatisch hashen, bevor es gespeichert wird
userSchema.pre('save', async function() {
  // Nur hashen, wenn das Passwort neu oder geändert wurde
  if (!this.isModified('password')) return;
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Methode zum Passwort-Vergleich
userSchema.methods.comparePassword = async function(plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;