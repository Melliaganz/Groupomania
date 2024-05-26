const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw 'No token found';
    }
    const decodedToken = jwt.verify(token, process.env.REACT_APP_JWT_TOKEN);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      req.auth = { userId }; // Ajoute l'userId à l'objet req pour utilisation ultérieure
      next();
    }
  } catch (error) {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};
