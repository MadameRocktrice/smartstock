const mongoose = require('mongoose');
const ShoppingListItem = require('./ShoppingListItem');

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
  }, 
  household: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Household',
    required: true
  }
}, {
  timestamps: true
});

// Auto-Logik: Wenn currentAmount unter minAmount, Eintrag auf Einkaufsliste
productSchema.post('save', async function(doc) {
  if (doc.currentAmount < doc.minAmount) {
    const existingItem = await ShoppingListItem.findOne({
      product: doc._id,
      isBought: false
    });
    
    if (!existingItem) {
      const missingAmount = doc.minAmount - doc.currentAmount;
      
      await ShoppingListItem.create({
        name: doc.name,
        quantity: missingAmount > 0 ? missingAmount : 1,
        unit: doc.unit,
        product: doc._id,
        category: doc.category,
        household: doc.household
      });
    }
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;