// Pakete importieren
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const locationRoutes = require('./routes/locationRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');

// Datenbank verbinden
connectDB();

// App erstellen
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Test-Route
app.get('/', (req, res) => {
  res.json({ message: 'Yay, SmartStock Backend läuft!' });
});

// API-Routen
app.use('/api/products', productRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);

// Server starten
app.listen(PORT, () => {
  console.log(`Yay, Server läuft auf Port ${PORT}`);
});