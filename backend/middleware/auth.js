const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(403).json({ error: 'No token found' });
    }
    const token = authHeader.split(' ')[1]; // Split to extract the token part
    if (!token) {
      return res.status(403).json({ error: 'No token found' });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = { userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid request!', error });
  }
};
