//const User = require("../models/user");
const bcrypt = require("bcrypt");
//const jwt = require("jsonwebtoken");
const cryptoJS = require("crypto-js");
const functions = require("./functions");
const models = require("../models");
const fs = require('fs')

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Variables used to verify / lock a user
const MAX_LOGIN_ATTEMPTS = 3;

function incrementLoginAttempt(emailHash, loginAttempts) {
  console.log("Dans incrementLoginAttempt");
  User.update(
    { login_attempts: loginAttempts.login_attempts + 1 },
    {
      where: { emailHash: emailHash },
    }
  );
}

exports.signup = (req, res, next) => {
  let name = req.body.name;
  let surname = req.body.surname;
  let password = req.body.password;
  let imageUrl = "https://freeimghost.net/images/2022/05/25/icon1653051982534.webp";
  let emailHash = cryptoJS.MD5(req.body.email).toString();
  let emailEncrypted = cryptoJS.AES.encrypt(req.body.email, "Secret Passphrase").toString();

  if (emailHash == null || name == null || surname == null || password == null) {
    return res.status(400).json({ error: "missing parameters" });
  }

  if (name.length >= 20 || name.length < 2 || surname.length >= 20 || surname.length < 2) {
    return res.status(400).json({ error: "Wrong name or surname (must be length 2 - 30)" });
  }

  if (!EMAIL_REGEX.test(req.body.email)) {
    return res.status(400).json({ error: "email is not valid" });
  }

  if (!functions.checkPassword(password)) {
    return res.status(400).json({ error: "Password is not valid (must be length min 4 and include 1 number" });
  }

  models.User.findOne({ attributes: ["emailHash"], where: { emailHash: emailHash } })
    .then((user) => {
      if (!user) {
        bcrypt.hash(password, 10)
          .then(async (hash) => {
            const newUser = await models.User.create({
              name: name,
              surname: surname,
              email: emailEncrypted,
              emailHash: emailHash,
              password: hash,
              imageUrl: imageUrl,
              admin: 0,
            });
            console.log("Nouvel utilisateur créé, ID :", newUser.id); // Log user ID
            newUser.save()
              .then(() => res.status(201).json({ message: "Utilisateur créé ! userId : " + newUser.id }))
              .catch((error) => res.status(400).json({ error }));
          })
          .catch((error) => res.status(500).json({ error }));
      } else {
        return res.status(409).json({ error: "email already used" });
      }
    })
    .catch((error) => {
      return res.status(500).json({ error: "unable to verify user" });
    });
};


exports.login = (req, res, next) => {
  let emailHash = cryptoJS.MD5(req.body.email).toString();
  let password = req.body.password;

  if (emailHash == null || password == null) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  models.User.findOne({ where: { emailHash: emailHash } })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Nom d'utilisateur (ou mot de passe) incorrect" });
      }

      bcrypt.compare(req.body.password, user.password).then((valid) => {
        if (!valid) {
          functions.incrementLoginAttempt(emailHash, user).catch((error) => console.log({ error }));
          return res.status(401).json({ error: "Mot de passe (ou email) incorrect !" });
        } else {
          req.session.userId = user.id;
          res.cookie('sessionId', req.sessionID, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000,
            partitioned: true,
            sameSite: "None"
          });
          console.log("Utilisateur connecté, ID :", user.id); // Log user ID
          functions.sendNewToken(user, res); // Passe l'objet user entier
        }
      }).catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};




exports.getUserProfile = (req, res, next) => {
  // Getting auth header
  let userInfos = functions.getInfosUserFromToken(req, res);
  let CurrentUserId = req.params.id;

  if (userInfos.userId < 0) {
    return res.status(400).json({ error: "Wrong token" });
  }

  models.User.findOne({
    attributes: ["id", "name", "surname", "email", "createdAt", "imageUrl"],
    where: { id: CurrentUserId },
  })
    .then((user) => {
      if (!user) {
        res.status(404).json({ error: "User not found" });
      }
      if ((user && user.id === userInfos.userId) || userInfos.admin === true) {
        user.dataValues.canEdit = true;
        if (userInfos.admin === true) {
          user.dataValues.isAdmin = true;
          res.status(200).json(user);
        } else {
          res.status(200).json(user);
        }
      } else if (user) {
        res.status(200).json(user);
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "Cannot fetch user" });
    });
};

exports.updateUserProfile = (req, res, next) => {
  // Getting auth header
  const userInfos = functions.getInfosUserFromToken(req, res);
  const CurrentUserId = req.params.id;

  if (userInfos.userId < 0) {
    return res.status(400).json({ error: "Wrong token" });
  }

  
  // Params
  let name = req.body.name;
  let surname = req.body.surname;
  let imageUrl = req.body && req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null;



  models.User.findOne({
    attributes: ["id", "name", "surname", "imageUrl"],
    where: { id: CurrentUserId },
  })
    .then((user) => {
      if (!user) {
        res.status(404).json({ error: "User not found" });
      }
      if (user.imageUrl != null) {
        const filename = user.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, (err) => {
          if (err) {
            console.log("impossible de supprimer l'image " + err);
          } else {
            console.log("image supprimée")
          }
        })
      }
      if ((user && user.id === userInfos.userId) || userInfos.admin === true)  {
        user
          .update({
            name: (name ? name : user.name),
            surname: (surname ? surname : user.surname),
            imageUrl: (imageUrl ? imageUrl : user.imageUrl),
          })
          .then((updated) => {
            if (updated) {
              res.status(201).json("Profile mis à jour");
            } else {
              res.status(500).json({ error: "Cannot update profile" });
            }
          });
      } else {
        res.status(400).json({ error: "User not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "Erreur" });
    });
};

exports.deleteUserProfile = (req, res) => {
  let userInfos = functions.getInfosUserFromToken(req, res);
  let CurrentUserId = req.params.id;
  
  if (userInfos.userId < 0) {
    return res.status(400).json({ error: "Wrong token" });
  }

  models.User.findOne({
    where: { id: CurrentUserId },
    attributes: ["id", "name", "surname", "email", "createdAt", "imageUrl"],
  })
  
    .then((user) => {
      console.log(user.id);
      console.log(userInfos.userId);
      console.log(userInfos.admin);
      
      if ((user && user.id === userInfos.userId) || userInfos.admin === true) {
        async function destroyUser(userId) {
          await models.User.destroy({
            where: { id: userId },
          });
          
        }
        if (user.imageUrl != null) {
          const filename = user.imageUrl.split("/images/")[1];
          fs.unlink(`./images/${filename}`, (err) => {
            console.log(err);
          })
        }
        
        destroyUser(user.id)
        
          .then(() => {
            console.log("User supprimé");
            res.status(200).json({ message: "User supprimé !" });
          })
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => {
      return res.status(404).json({ error: error });
    });
};

exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to log out!' });
    }
    res.clearCookie('sessionId');
    res.status(200).json({ message: 'Logged out successfully!' });
  });
};
