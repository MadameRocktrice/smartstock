const mongoose = require('mongoose');

const shoppingListItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  unit: {
    type: String,
    default: 'Stueck',
    trim: true
  },
  isBought: {
    type: Boolean,
    default: false
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  household: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Household',
    required: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
}, {
  timestamps: true
});

const ShoppingListItem = mongoose.model('ShoppingListItem', shoppingListItemSchema);

module.exports = ShoppingListItem;