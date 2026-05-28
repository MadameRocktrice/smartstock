const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  currentAmount: {
    type: Number,
    required: true,
    default: 1,
    min: 0
  },
  minAmount: {
    type: Number,
    default: 1,
    min: 0
  },
  unit: {
    type: String,
    default: 'Stueck',
    trim: true
  },
  expiryDate: {
    type: Date
  },
    location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location'
  },
  category: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Category'
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;