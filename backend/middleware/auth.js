const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // 1. Token aus dem Header holen
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Kein Token vorhanden' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // 2. Token verifizieren
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. User-Info an die Anfrage hängen
    req.user = decoded;
    
    // 4. Weiter zur eigentlichen Route
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Ungueltiger Token' });
  }
};

module.exports = authMiddleware;