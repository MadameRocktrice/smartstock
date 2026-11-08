require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('./models/User');
const Household = require('./models/Household');
const Category = require('./models/Category');
const Location = require('./models/Location');
const Product = require('./models/Product');
const ShoppingListItem = require('./models/ShoppingListItem');

// --- Demo-Konfiguration ---
const DEMO_EMAILS = ['demo1@smartstock.ch', 'demo2@smartstock.ch'];
const DEMO_PASSWORD = 'Demo1234';
const DEMO_HOUSEHOLD_NAME = 'Demo-Haushalt';

async function seed() {
  console.log('🌱 Starte Seed-Script...');

  // 1. Verbindung
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB verbunden');

  // 2. Alte Demo-Daten löschen (nur Demo!)
  console.log('🧹 Lösche alte Demo-Daten...');
  const oldUsers = await User.find({ email: { $in: DEMO_EMAILS } });
  const oldUserIds = oldUsers.map((u) => u._id);
  const oldHouseholds = await Household.find({ owner: { $in: oldUserIds } });
  const oldHouseholdIds = oldHouseholds.map((h) => h._id);

  await Product.deleteMany({ household: { $in: oldHouseholdIds } });
  await ShoppingListItem.deleteMany({ household: { $in: oldHouseholdIds } });
  await Category.deleteMany({ household: { $in: oldHouseholdIds } });
  await Location.deleteMany({ household: { $in: oldHouseholdIds } });
  await Household.deleteMany({ _id: { $in: oldHouseholdIds } });
  await User.deleteMany({ email: { $in: DEMO_EMAILS } });

  // 3. Demo-User anlegen
  console.log('👥 Erstelle Demo-User...');

  const user1 = await User.create({
    username: 'Demo 1',
    email: DEMO_EMAILS[0],
    password: DEMO_PASSWORD,
    households: [],
  });

  const user2 = await User.create({
    username: 'Demo 2',
    email: DEMO_EMAILS[1],
    password: DEMO_PASSWORD,
    households: [],
  });

  // 4. Haushalt erstellen
  console.log('🏠 Erstelle Haushalt...');
  const household = await Household.create({
    name: DEMO_HOUSEHOLD_NAME,
    owner: user1._id,
    members: [user1._id, user2._id],
    note: 'Willkommen! Diese App lässt dich den Haushalt gemeinsam verwalten.',
  });

  user1.households.push(household._id);
  user2.households.push(household._id);
  await user1.save();
  await user2.save();

  // 5. Kategorien anlegen
  console.log('🏷  Erstelle Kategorien...');
  const categoryNames = [
    'Obst & Gemüse',
    'Backwaren',
    'Milchprodukte',
    'Tiefkühlprodukte',
    'Getränke',
    'Haushalt',
    'Sonstiges',
  ];
  const categories = {};
  for (const name of categoryNames) {
    const cat = await Category.create({ name, household: household._id });
    categories[name] = cat._id;
  }

  // 6. Standorte anlegen
  console.log('📍 Erstelle Standorte...');
  const locationNames = ['Küche', 'Kühlschrank', 'Tiefkühler', 'Vorratsschrank'];
  const locations = {};
  for (const name of locationNames) {
    const loc = await Location.create({ name, household: household._id });
    locations[name] = loc._id;
  }

  // 7. Produkte anlegen
  console.log('📦 Erstelle Produkte...');
  const products = [
  // --- MIT Minimum (klassischer Fall) ---
  
  // Milchprodukte
  { name: 'Milch', currentAmount: 5, minAmount: 2, unit: 'Liter',countStep: 1, category: 'Milchprodukte', location: 'Kühlschrank' },
  { name: 'Butter', currentAmount: 1, minAmount: 1, unit: 'Stück', category: 'Milchprodukte', location: 'Kühlschrank' },
  { name: 'Joghurt', currentAmount: 6, minAmount: 3, unit: 'Stück', category: 'Milchprodukte', location: 'Kühlschrank' },
  { name: 'Quark', currentAmount: 0, minAmount: 1, unit: 'Stück', category: 'Milchprodukte', location: 'Kühlschrank' },
  
  // Milchprodukte mit Ablaufdatum
  { 
    name: 'Camembert', currentAmount: 1, minAmount: 1, unit: 'Stück', 
    category: 'Milchprodukte', location: 'Kühlschrank',
    expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)  // 2 Tage → rot
  },
  { 
    name: 'Mozzarella', currentAmount: 2, minAmount: 1, unit: 'Stück',
    category: 'Milchprodukte', location: 'Kühlschrank',
    expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)  // 5 Tage → gelb
  },

  // Backwaren
  { name: 'Brot', currentAmount: 1, minAmount: 2, unit: 'Stück', category: 'Backwaren', location: 'Küche' },
  { name: 'Brötchen', currentAmount: 6, minAmount: 4, unit: 'Stück', category: 'Backwaren', location: 'Küche' },
  { name: 'Mehl', currentAmount: 1000, minAmount: 500, unit: 'Gramm', countStep: 100, category: 'Backwaren', location: 'Vorratsschrank' },

  // Obst & Gemüse
  { name: 'Äpfel', currentAmount: 8, minAmount: 5, unit: 'Stück', category: 'Obst & Gemüse', location: 'Küche' },
  { name: 'Karotten', currentAmount: 0, minAmount: 5, unit: 'Stück', category: 'Obst & Gemüse', location: 'Kühlschrank' },

  // Tiefkühl
  { name: 'Tiefkühlpizza', currentAmount: 2, minAmount: 1, unit: 'Stück', category: 'Tiefkühlprodukte', location: 'Tiefkühler' },

  // --- OHNE Minimum (bewusster Umgang) ---
  
  // Haushalt-Items wo Minimum keinen Sinn macht
  { name: 'Senf', currentAmount: 2, unit: 'Flasche', category: 'Sonstiges', location: 'Kühlschrank' },
  { name: 'Apfelmus', currentAmount: 1, unit: 'Glas', category: 'Sonstiges', location: 'Vorratsschrank' },
  { name: 'Spülmittel', currentAmount: 1, unit: 'Flasche', category: 'Haushalt', location: 'Küche' },
  
  // Ohne Minimum + mit Ablaufdatum
  { 
    name: 'Salami', currentAmount: 1, unit: 'Packung',
    category: 'Sonstiges', location: 'Kühlschrank',
    expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)  // 1 Tag → rot
  },

  // Getränke (mit Min)
  { name: 'Wasser', currentAmount: 6, minAmount: 6, unit: 'Flaschen', category: 'Getränke', location: 'Vorratsschrank' },
  { name: 'Orangensaft', currentAmount: 2, minAmount: 1, unit: 'Liter', countStep: 1,category: 'Getränke', location: 'Kühlschrank' },
];

  for (const p of products) {
    await Product.create({
      name: p.name,
      currentAmount: p.currentAmount,
      minAmount: p.minAmount,
      unit: p.unit,
      countStep: p.countStep,
      category: categories[p.category],
      location: locations[p.location],
      household: household._id,
      expiryDate: p.expiryDate,
    });
  }

  console.log('🎉 Seed abgeschlossen!');
  console.log(`   Login: ${DEMO_EMAILS[0]} oder ${DEMO_EMAILS[1]}`);
  console.log(`   Passwort: ${DEMO_PASSWORD}`);
  console.log(`   Haushalt: ${DEMO_HOUSEHOLD_NAME}`);
  console.log(`   Produkte: ${products.length}`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Fehler:', err);
  process.exit(1);
});