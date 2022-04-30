const models = require("../models");
const message = require("../models/message");
const functions = require("./functions");

exports.createComment = (req, res) => {
  // Getting auth header
  let userInfos = functions.getInfosUserFromToken(req, res);

  if (userInfos.userId < 0) {
    return res.status(400).json({ error: "Wrong token" });
  }

  // Params
  let text = req.body.text;

  if (text == null) {
    return res.status(400).json({ error: "Missing parameters"});
  }

  if (text.length <= 2) {
    return res.status(400).json({ error: "Invalid parameters"});
  }

  models.User.findOne({
    where: { id: userInfos.userId },
  })
    .then((user) => {
      if (user) {
        models.Comment.create({
          text: text,
          UserId: user.id,
          MessageId: message.id,
        })
          .then((newComment) => {
            if (newComment) {
              return res.status(201).json({ Message: "Message posted !" });
            } else {
              return res.status(500).json({ error: "Cannot post message" });
            }
          })
          .catch((error) => {
            return res.status(500).json({ error: "Internal error" });
          });
      } else {
        return res.status(404).json({ error: "User not found" });
      }
    })
    .catch((error) => {
      return res.status(500).json({ error: "Unable to verify user" });
    });
};