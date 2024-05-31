const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
require('dotenv').config();

const LOCK_TIME = 60 * 1000; // 1 minute

// Compare passwords
function comparePassword(password, userPassword, res) {
  bcrypt
    .compare(password, userPassword)
    .then((valid) => {
      if (!valid) {
        console.log("Mot de passe invalide");
        return res.status(401).json({ error: "Mot de passe (ou email) incorrect !" });
      } else {
        console.log("Mot de passe valide");
      }
    })
    .catch((error) => res.status(500).json({ error }));
}

// Check password strength
function checkPassword(password) {
  const regularExp = RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{4,}$");
  return regularExp.test(password);
}

// Check if account is locked
function checkIfAccountIsLocked(userLockUntil) {
  return userLockUntil && userLockUntil > Date.now();
}

// Increment login attempt
async function incrementLoginAttempt(emailHash, user) {
  return await user.update(
    { login_attempts: user.login_attempts + 1 },
    { where: { emailHash: emailHash } }
  );
}

// Block user account
async function blockUserAccount(emailHash, user) {
  return await user.update(
    { login_attempts: user.login_attempts + 1, lock_until: Date.now() + LOCK_TIME },
    { where: { emailHash: emailHash } }
  );
}

// Reset user lock attempt
async function resetUserLockAttempt(emailHash, user) {
  return await user.update(
    { login_attempts: 0, lock_until: null },
    { where: { emailHash: emailHash } }
  );
}

// Send new token
function sendNewToken(userData, res) {
  const jwtSecret = process.env.JWT_SECRET;

  const newToken = jwt.sign(
    { userId: userData.id, admin: userData.admin },
    jwtSecret,
    { expiresIn: "2h" }
  );

  res.status(200).json({
    userId: userData.id,
    token: newToken,
  });
}

// Get user info from token
function getInfosUserFromToken(req) {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    throw new Error("Authorization header not found");
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new Error("Token not found");
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    return { userId: decodedToken.userId, admin: decodedToken.admin };
  } catch (error) {
    throw new Error("Invalid token");
  }
}


// Check if user is admin
function isAdmin(req, res) {
  try {
    const { admin } = getInfosUserFromToken(req);
    return admin;
  } catch (error) {
    res.status(401).json({ error: "Invalid request!" });
  }
}

module.exports = {
  checkPassword,
  checkIfAccountIsLocked,
  sendNewToken,
  resetUserLockAttempt,
  incrementLoginAttempt,
  blockUserAccount,
  comparePassword,
  getInfosUserFromToken,
  isAdmin,
};
