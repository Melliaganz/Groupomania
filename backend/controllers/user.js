const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cryptoJS = require("crypto-js");
const functions = require("./functions");
const models = require("../models");

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
