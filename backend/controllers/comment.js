const models = require("../models");
const functions = require("./functions");

exports.createComment = async (req, res) => {
  const userInfos = functions.getInfosUserFromToken(req, res);
  if (userInfos.userId < 0) {
    return res.status(400).json({ error: "Wrong token" });
  }

  const { id: messageId } = req.params;
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  if (text.length <= 2) {
    return res.status(400).json({ error: "Invalid Parameters" });
  }

  try {
    const user = await models.User.findOne({ where: { id: userInfos.userId } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const newComment = await models.Comment.create({
      UserId: user.id,
      MessageId: messageId,
      text: text,
    });

    return res.status(201).json({ message: "Comment posted!", newComment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteComments = async (req, res) => {
  const userInfos = functions.getInfosUserFromToken(req, res);
  const { commentId } = req.params;

  try {
    const comment = await models.Comment.findOne({ where: { id: commentId } });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.UserId === userInfos.userId || userInfos.admin) {
      await models.Comment.destroy({ where: { id: commentId } });
      return res.status(200).json({ message: "Comment deleted!" });
    } else {
      return res.status(403).json({ error: "Unauthorized action" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

exports.getMessageAllComments = async (req, res) => {
  const userInfos = functions.getInfosUserFromToken(req, res);
  const { id: messageId } = req.params;
  const { fields, order, page = 0, size = 5 } = req.query;

  const getPagination = (page, size) => {
    const limit = size ? +size : 5;
    const offset = page ? page * limit : 0;
    return { limit, offset };
  };

  const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: comments } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, comments, totalPages, currentPage };
  };

  const { limit, offset } = getPagination(page, size);

  try {
    const data = await models.Comment.findAndCountAll({
      where: { messageId },
      order: order ? order.split(":") : [["createdAt", "DESC"]],
      attributes: fields ? fields.split(",") : null,
      limit,
      offset,
      include: [{ model: models.User, attributes: ["name", "surname", "id", "imageUrl"] }],
    });

    const response = getPagingData(data, page, limit);

    if (response.comments.length > 0 && (response.comments[0].dataValues.messageId === messageId || userInfos.admin)) {
      response.comments.forEach(comment => comment.dataValues.canEdit = true);
      res.send(response);
    } else if (response.totalItems > 0) {
      res.send(response);
    } else {
      res.status(404).json({ error: "No comments found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};


exports.getOneComment = async (req, res) => {
  const userInfos = functions.getInfosUserFromToken(req, res);
  const { commentId } = req.params;

  try {
    const comment = await models.Comment.findOne({ where: { id: commentId } });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.UserId === userInfos.userId || userInfos.admin) {
      comment.dataValues.canEdit = true;
    }

    res.status(200).json(comment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
