// Pakete importieren
const express = require('express');
const http = require('http');
const { Server } = require('socket.io'); 
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const locationRoutes = require('./routes/locationRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');
const householdRoutes = require('./routes/householdRoutes');
const shoppingListRoutes = require('./routes/shoppingListRoutes');

// Datenbank verbinden
connectDB();

// App erstellen
const app = express();
const PORT = process.env.PORT || 5001;

// HTTP-Server erstellen (für socket.io)
const server = http.createServer(app);

// Socket.io an den Server haengen
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Socket.io an Request-Objekt hängen, damit Routen Events senden können
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Test-Route
app.get('/', (req, res) => {
  res.json({ message: 'Yay, SmartStock Backend läuft!' });
});

// API-Routen
app.use('/api/products', productRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/households', householdRoutes);
app.use('/api/shoppinglist', shoppingListRoutes);

// Socket.io Event-Handler
io.on('connection', (socket) => {
  console.log('🟢 Client verbunden:', socket.id);
  socket.on('disconnect', () => {
    console.log('🔴 Client getrennt:', socket.id);
  });
});

// Server starten
server.listen(PORT, () => {
  console.log(`Yay, Server läuft auf Port ${PORT}`);
  console.log(`Socket.io bereit auf Port ${PORT}`);
});