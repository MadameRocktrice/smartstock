// Pakete importieren
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// App erstellen
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test-Route
app.get('/', (req, res) => {
  res.json({ message: 'Yay, SmartStock Backend läuft!' });
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});