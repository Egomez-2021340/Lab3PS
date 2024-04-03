const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Token de autenticación no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, 'secreto');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    return res.status(401).json({ message: 'Token de autenticación no válido' });
  }
};

module.exports = authMiddleware;
