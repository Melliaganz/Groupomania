const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cryptoJS = require("crypto-js");
const functions = require("./functions");
const models = require("../models");
const fs = require('fs');

exports.signup = async (req, res, next) => {
  const { name, surname, password, email } = req.body;
  if (!name || !surname || !password || !email) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  const emailHash = cryptoJS.MD5(email).toString();
  const emailEncrypted = cryptoJS.AES.encrypt(email, "Secret Passphrase").toString();
  const imageUrl = "https://freeimghost.net/images/2022/05/25/icon1653051982534.webp";

  try {
    const existingUser = await models.User.findOne({ where: { emailHash } });
    if (existingUser) {
      return res.status(409).json({ error: "Email already used" });
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = await models.User.create({
      name,
      surname,
      email: emailEncrypted,
      emailHash,
      password: hash,
      imageUrl,
    });

    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({
      userId: newUser.id,
      token,
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Unable to create user" });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  const emailHash = cryptoJS.MD5(email).toString();

  if (!email || !password) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    const user = await models.User.findOne({ where: { emailHash } });
    if (!user) {
      return res.status(401).json({ error: "Incorrect username or password" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      await functions.incrementLoginAttempt(emailHash, user);
      return res.status(401).json({ error: "Incorrect email or password" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({
      userId: user.id,
      token,
      message: 'Logged in successfully',
    });
  } catch (error) {
    res.status(500).json({ error: "Unable to log in" });
  }
};

exports.logout = (req, res, next) => {
  res.status(200).json({ message: 'Logged out successfully!' });
};

exports.getUserProfile = async (req, res, next) => {
  const userInfos = functions.getInfosUserFromToken(req, res);
  const CurrentUserId = req.params.id;

  if (userInfos.userId < 0) {
    return res.status(400).json({ error: "Wrong token" });
  }

  try {
    const user = await models.User.findOne({
      attributes: ["id", "name", "surname", "email", "createdAt", "imageUrl"],
      where: { id: CurrentUserId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const canEdit = (user.id === userInfos.userId || userInfos.admin);
    const response = {
      ...user.dataValues,
      canEdit,
      isAdmin: userInfos.admin || false,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Cannot fetch user" });
  }
};

exports.updateUserProfile = async (req, res, next) => {
  const userInfos = functions.getInfosUserFromToken(req, res);
  const CurrentUserId = req.params.id;

  if (userInfos.userId < 0) {
    return res.status(400).json({ error: "Wrong token" });
  }

  const { name, surname } = req.body;
  const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null;

  try {
    const user = await models.User.findOne({
      attributes: ["id", "name", "surname", "imageUrl"],
      where: { id: CurrentUserId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.imageUrl && imageUrl) {
      const filename = user.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, (err) => {
        if (err) {
          console.log("Impossible to delete image: " + err);
        } else {
          console.log("Image deleted");
        }
      });
    }

    if (user.id === userInfos.userId || userInfos.admin) {
      const updatedUser = await user.update({
        name: name || user.name,
        surname: surname || user.surname,
        imageUrl: imageUrl || user.imageUrl,
      });

      if (updatedUser) {
        res.status(200).json({ message: "Profile updated" });
      } else {
        res.status(500).json({ error: "Cannot update profile" });
      }
    } else {
      res.status(403).json({ error: "Not authorized" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating profile" });
  }
};

exports.deleteUserProfile = async (req, res) => {
  const userInfos = functions.getInfosUserFromToken(req, res);
  const CurrentUserId = req.params.id;

  if (userInfos.userId < 0) {
    return res.status(400).json({ error: "Wrong token" });
  }

  try {
    const user = await models.User.findOne({
      where: { id: CurrentUserId },
      attributes: ["id", "name", "surname", "email", "createdAt", "imageUrl"],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.id === userInfos.userId || userInfos.admin) {
      if (user.imageUrl) {
        const filename = user.imageUrl.split("/images/")[1];
        fs.unlink(`./images/${filename}`, (err) => {
          if (err) {
            console.log(err);
          }
        });
      }

      await models.User.destroy({
        where: { id: CurrentUserId },
      });

      console.log("User deleted");
      res.status(200).json({ message: "User deleted!" });
    } else {
      res.status(403).json({ error: "Not authorized" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
};
