const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

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
    {
      where: { emailHash: emailHash },
    }
  );
}

async function blockUserAccount(emailHash, user) {
  console.log("Verrouillage du compte utilisateur");
  return await user.update(
    { login_attempts: user.login_attempts + 1, lock_until: Date.now() + LOCK_TIME },
    {
      where: {
        emailHash: emailHash,
      },
    }
  );
}

async function resetUserLockAttempt(emailHash, user) {
  console.log("Réinitialisation des tentatives de verrouillage utilisateur");
  return await user.update(
    { login_attempts: 0, lock_until: null },
    {
      where: {
        emailHash: emailHash,
      },
    }
  );
}

function sendNewToken(userData, res) {
  const newToken = jwt.sign(
    { userId: userData.id, admin: userData.admin },
    "RANDOM_TOKEN_SECRET",
    { expiresIn: "2h" }
  );

  const cookieOptions = {
    maxAge: 2 * 60 * 60 * 1000, // 2 hours
    httpOnly: true, // Prevent access via JavaScript
    secure: process.env.NODE_ENV === 'production', // Ensure secure cookies in production
    sameSite: "None", // Allow cross-site cookies
    partitioned: true // Add partitioned attribute
  };

  console.log("Envoi des cookies avec userId :", userData.id);

  res
    .status(200)
    .cookie("token", newToken, cookieOptions)
    .cookie("groupomania", true, { ...cookieOptions, httpOnly: false })
    .cookie("groupomaniaId", userData.id, { ...cookieOptions, httpOnly: false })
    .json({
      userId: userData.id,
      token: newToken,
    });
}

function getInfosUserFromToken(req, res) {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw "Token non fourni";
    }
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userInfos = {
      userId: decodedToken.userId,
      admin: decodedToken.admin
    };
    return userInfos;
  } catch (error) {
    res.status(401).json({
      error: new Error("Requête invalide !"),
    });
  }
}

function isAdmin(req, res) {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw "Token non fourni";
    }
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const isAdmin = decodedToken.admin;
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw "Identifiant utilisateur invalide";
    } else {
      return isAdmin;
    }
  } catch (error) {
    res.status(401).json({
      error: new Error("Requête invalide !"),
    });
  }
}

function eraseCookie(res) {
  return res
    .status(200)
    .cookie("token", "", { expires: new Date(0) })
    .json({
      message: "Utilisateur déconnecté",
    });
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
  eraseCookie
};
