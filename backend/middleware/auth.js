const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log("Token reçu :", token); // Log token
    if (!token) {
      throw 'No token found';
    }
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    console.log("Token décodé :", decodedToken); // Log decoded token
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      req.auth = { userId }; // Ajoute l'userId à l'objet req pour utilisation ultérieure
      next();
    }
  } catch (error) {
    console.log("Erreur d'authentification :", error); // Log error
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};
