const models = require("../models");
const functions = require("./functions");

exports.toggleMessageLike = async (req, res) => {
  try {
    const { userId } = functions.getInfosUserFromToken(req);
    const messageId = req.params.id;

    const message = await models.Message.findByPk(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    const existing = await models.Like.findOne({ where: { userId, messageId } });
    let likedByMe;
    if (existing) {
      await existing.destroy();
      likedByMe = false;
    } else {
      await models.Like.create({ userId, messageId });
      likedByMe = true;
    }

    const likeCount = await models.Like.count({ where: { messageId } });
    return res.status(200).json({ likeCount, likedByMe });
  } catch (error) {
    console.error("Error toggling message like:", error);
    return res.status(500).json({ error: error.message });
  }
};

exports.toggleCommentLike = async (req, res) => {
  try {
    const { userId } = functions.getInfosUserFromToken(req);
    const { commentId } = req.params;

    const comment = await models.Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const existing = await models.Like.findOne({ where: { userId, commentId } });
    let likedByMe;
    if (existing) {
      await existing.destroy();
      likedByMe = false;
    } else {
      await models.Like.create({ userId, commentId });
      likedByMe = true;
    }

    const likeCount = await models.Like.count({ where: { commentId } });
    return res.status(200).json({ likeCount, likedByMe });
  } catch (error) {
    console.error("Error toggling comment like:", error);
    return res.status(500).json({ error: error.message });
  }
};
