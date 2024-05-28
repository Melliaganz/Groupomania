const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
require('dotenv').config();

const LOCK_TIME = 60 * 1000; // 1 minute

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

function checkPassword(password) {
  const regularExp = RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{4,}$");
  if (regularExp.test(password)) {
    console.log("Mot de passe fort");
    return true;
  } else {
    console.log("Mot de passe faible");
    return false;
  }
}

function checkIfAccountIsLocked(userLockUntil) {
  console.log("Vérification si le compte est verrouillé");
  if (userLockUntil && userLockUntil > Date.now()) {
    console.log("Compte verrouillé");
    return true;
  } else {
    console.log("Compte non verrouillé");
    return false;
  }
}

async function incrementLoginAttempt(emailHash, user) {
  console.log("Incrémentation du nombre de tentatives de connexion");
  return await user.update(
    { login_attempts: user.login_attempts + 1 },
    { where: { emailHash: emailHash } }
  );
}

async function blockUserAccount(emailHash, user) {
  console.log("Verrouillage du compte utilisateur");
  return await user.update(
    { login_attempts: user.login_attempts + 1, lock_until: Date.now() + LOCK_TIME },
    { where: { emailHash: emailHash } }
  );
}

async function resetUserLockAttempt(emailHash, user) {
  console.log("Réinitialisation des tentatives de verrouillage utilisateur");
  return await user.update(
    { login_attempts: 0, lock_until: null },
    { where: { emailHash: emailHash } }
  );
}

function sendNewToken(userData, res) {
  const jwtSecret = process.env.JWT_SECRET;

  const newToken = jwt.sign(
    { userId: userData.id, admin: userData.admin },
    jwtSecret,
    { expiresIn: "2h" }
  );

  console.log("Sending new token for userId:", userData.id);

  res.status(200).json({
    userId: userData.id,
    token: newToken,
  });
}

function getInfosUserFromToken(req, res) {
  try {
    const token = req.header('Authorization');
    if (!token) {
      throw "Token not provided";
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userInfos = {
      userId: decodedToken.userId,
      admin: decodedToken.admin,
    };
    return userInfos;
  } catch (error) {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
}

function isAdmin(req, res) {
  try {
    const token = req.header('Authorization');
    if (!token) {
      throw "Token not provided";
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const isAdmin = decodedToken.admin;
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid user ID";
    } else {
      return isAdmin;
    }
  } catch (error) {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
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
