const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(403).json({ error: 'No token found' });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = { userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({
      error: 'Invalid request!'
    });
  }
};
