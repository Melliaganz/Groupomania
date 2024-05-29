const models = require("../models");
const functions = require("./functions");

exports.createMessage = (req, res) => {
  try {
    let userInfos = functions.getInfosUserFromToken(req);

    if (userInfos.userId < 0) {
      return res.status(400).json({ error: "Wrong token" });
    }

    let title = req.body.title;
    let content = req.body.content;

    if (!title || !content) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    if (title.length <= 2 || content.length <= 4) {
      return res.status(400).json({ error: "Invalid parameters" });
    }

    models.User.findOne({ where: { id: userInfos.userId } })
      .then((user) => {
        if (user) {
          models.Message.create({
            title: title,
            content: content,
            likes: 0,
            userId: user.id,
            imageUrl: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null,
          })
            .then((newMessage) => {
              return res.status(201).json({ message: "Message posted!" });
            })
            .catch((error) => {
              console.error("Error creating message:", error);
              return res.status(500).json({ error: "Internal error" });
            });
        } else {
          return res.status(404).json({ error: "User not found" });
        }
      })
      .catch((error) => {
        console.error("Error verifying user:", error);
        return res.status(500).json({ error: "Unable to verify user" });
      });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllMessages = (req, res) => {
  const page = req.query.page;
  const size = req.query.size;

  const getPagination = (page, size) => {
    const limit = size ? +size : 5;
    const offset = page ? page * limit : 0;
    return { limit, offset };
  };

  const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: messages } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, messages, totalPages, currentPage };
  };

  let fields = req.query.fields;
  let order = req.query.order;
  const { limit, offset } = getPagination(page, size);

  models.Message.findAndCountAll({
    order: [order != null ? order.split(":") : ["createdAt", "DESC"]],
    attributes: fields !== "*" && fields != null ? fields.split(",") : null,
    limit: !isNaN(limit) ? limit : 5,
    offset: !isNaN(offset) ? offset : 0,
    include: [
      {
        model: models.User,
        attributes: ["name", "surname", "id", "imageUrl"],
      },
    ],
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch((error) => res.status(500).json({ error: "Unable to fetch messages", error }));
};

exports.getUserAllMessages = (req, res) => {
  let userInfos = functions.getInfosUserFromToken(req);
  let CurrentUserId = req.params.id;
  let fields = req.query.fields;
  let order = req.query.order;

  const page = req.query.page;
  const size = req.query.size;

  const getPagination = (page, size) => {
    const limit = size ? +size : 5;
    const offset = page ? page * limit : 0;
    return { limit, offset };
  };

  const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: messages } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, messages, totalPages, currentPage };
  };
  const { limit, offset } = getPagination(page, size);

  models.Message.findAndCountAll({
    where: { userId: CurrentUserId },
    order: [order != null ? order.split(":") : ["createdAt", "DESC"]],
    attributes: fields !== "*" && fields != null ? fields.split(",") : null,
    limit: !isNaN(limit) ? limit : 5,
    offset: !isNaN(offset) ? offset : 0,
    include: [
      {
        model: models.User,
        attributes: ["name", "surname", "id","imageUrl"],
      },
    ],
  }).then((data) => {
    const response = getPagingData(data, page, limit);
    console.log(response.messages.length);
    if (
      (response.messages.length > 0 &&
        response.messages[0].dataValues.userId === userInfos.userId) ||
      userInfos.admin === true
    ) {
      for (let index = 0; index < response.messages.length; index++) {
        response.messages[index].dataValues.canEdit = true;
      }
      res.send(response);
    } else if (response.totalItems > 0) {
      res.send(response);
    } else {
      res.status(404).json({ error: "No messages found" });
    }
  }).catch((error) => res.status(500).json({ error: "Unable to fetch user's messages", error }));
};

exports.getOneMessage = (req, res) => {
  let userInfos = functions.getInfosUserFromToken(req);
  let messageId = req.params.id;

  models.Message.findOne({
    where: { id: messageId },
    include: [
      {
        model: models.User,
        attributes: ["name", "surname", "id", "imageUrl"],
      },
    ],
  })
    .then((messages) => {
      if (
        (messages && messages.userId === userInfos.userId) ||
        userInfos.admin === true
      ) {
        messages.dataValues.canEdit = true;
        res.status(200).json(messages);
      } else if (messages) {
        res.status(200).json(messages);
      } else {
        res.status(404).send({ error: "Message not found" });
      }
    })
    .catch((error) => {
      return res.status(404).json({ error: "Message not found" });
    });
};

exports.deleteMessage = (req, res) => {
  let userInfos = functions.getInfosUserFromToken(req);
  let messageId = req.params.id;

  models.Message.findOne({
    where: { id: messageId },
    include: [
      {
        model: models.User,
        attributes: ["name", "surname", "id"],
      },
    ],
  })
    .then((messages) => {
      if (
        (messages && messages.userId === userInfos.userId) ||
        userInfos.admin === true
      ) {
        models.Message.destroy({
          where: { id: messageId },
        })
          .then(() => {
            res.status(200).json({ message: "Objet supprimé !" });
          })
          .catch((error) => res.status(400).json({ error }));
      } else {
        res.status(403).json({ error: "Not authorized" });
      }
    })
    .catch((error) => {
      return res.status(404).json({ error: "Message not found" });
    });
};
