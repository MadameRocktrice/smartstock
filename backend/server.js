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

// Pakete für Socket-Auth
const jwt = require('jsonwebtoken');
const User = require('./models/User');

// Socket.io Event-Handler mit Haushalt-Rooms
io.on('connection', async (socket) => {
  try {
    // Token aus Auth-Payload holen (kommt vom Frontend useSocket)
    const token = socket.handshake.auth?.token;

    if (!token) {
      console.log('🔴 Socket ohne Token abgelehnt:', socket.id);
      socket.disconnect();
      return;
    }

    // Token verifizieren
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // User aus DB holen
    const user = await User.findById(decoded.userId);
    if (!user) {
      console.log('🔴 User nicht gefunden:', socket.id);
      socket.disconnect();
      return;
    }

    // Aktiver Haushalt = letzter in der Liste
    const activeHousehold = user.households.length > 0
      ? user.households[user.households.length - 1]
      : null;

    if (activeHousehold) {
      // Socket dem Haushalt-Raum beitreten lassen
      const roomName = `household_${activeHousehold}`;
      socket.join(roomName);
      socket.data.household = activeHousehold.toString();
      console.log(`🟢 Client verbunden: ${socket.id} → Raum ${roomName}`);
    } else {
      console.log(`🟢 Client verbunden: ${socket.id} → kein Haushalt`);
    }

    socket.on('disconnect', () => {
      console.log('🔴 Client getrennt:', socket.id);
    });
  } catch (error) {
    console.log('🔴 Socket-Auth-Fehler:', error.message);
    socket.disconnect();
  }
});

// Server starten
server.listen(PORT, () => {
  console.log(`Yay, Server läuft auf Port ${PORT}`);
  console.log(`Socket.io bereit auf Port ${PORT}`);
});