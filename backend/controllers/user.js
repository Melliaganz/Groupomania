const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cryptoJS = require("crypto-js");
const functions = require("./functions");
const models = require("../models");
const fs = require('fs');

exports.signup = (req, res, next) => {
  let name = req.body.name;
  let surname = req.body.surname;
  let password = req.body.password;
  let emailHash = cryptoJS.MD5(req.body.email).toString();
  let emailEncrypted = cryptoJS.AES.encrypt(req.body.email, "Secret Passphrase").toString();

  if (!name || !surname || !password || !req.body.email) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  models.User.findOne({ where: { emailHash: emailHash } })
    .then((user) => {
      if (!user) {
        bcrypt.hash(password, 10)
          .then((hash) => {
            const newUser = models.User.create({
              name: name,
              surname: surname,
              email: emailEncrypted,
              emailHash: emailHash,
              password: hash,
            });
            const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(201).json({
              userId: newUser.id,
              token: token,
              message: "User created successfully",
            });
          })
          .catch((error) => res.status(500).json({ error }));
      } else {
        return res.status(409).json({ error: "Email already used" });
      }
    })
    .catch((error) => res.status(500).json({ error: "Unable to verify user" }));
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
          const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
          res.status(200).json({
            userId: user.id,
            token: token,
            message: 'Logged in successfully',
          });
        }
      }).catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.logout = (req, res, next) => {
  res.status(200).json({ message: 'Logged out successfully!' });
};

exports.getUserProfile = (req, res, next) => {
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
        }
        res.status(200).json(user);
      } else {
        res.status(200).json(user);
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "Cannot fetch user" });
    });
};

exports.updateUserProfile = (req, res, next) => {
  const userInfos = functions.getInfosUserFromToken(req, res);
  const CurrentUserId = req.params.id;

  if (userInfos.userId < 0) {
    return res.status(400).json({ error: "Wrong token" });
  }

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
        });
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
      if ((user && user.id === userInfos.userId) || userInfos.admin === true) {
        if (user.imageUrl != null) {
          const filename = user.imageUrl.split("/images/")[1];
          fs.unlink(`./images/${filename}`, (err) => {
            if (err) {
              console.log(err);
            }
          });
        }

        models.User.destroy({
          where: { id: CurrentUserId },
        })
          .then(() => {
            console.log("User deleted");
            res.status(200).json({ message: "User deleted!" });
          })
          .catch((error) => res.status(400).json({ error }));
      } else {
        res.status(403).json({ error: "Not authorized" });
      }
    })
    .catch((error) => {
      res.status(404).json({ error: "User not found" });
    });
};
