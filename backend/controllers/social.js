const { fn, col } = require("sequelize");
const models = require("../models");

const toCountMap = (rows, key) =>
  rows.reduce((acc, row) => {
    acc[row[key]] = Number(row.cnt);
    return acc;
  }, {});

async function decorateMessages(messages, userId) {
  const ids = messages.map((m) => m.id);
  if (ids.length === 0) return;

  const [likeRows, commentRows, myLikes] = await Promise.all([
    models.Like.findAll({
      where: { messageId: ids },
      attributes: ["messageId", [fn("COUNT", col("id")), "cnt"]],
      group: ["messageId"],
      raw: true,
    }),
    models.Comment.findAll({
      where: { messageId: ids },
      attributes: ["messageId", [fn("COUNT", col("id")), "cnt"]],
      group: ["messageId"],
      raw: true,
    }),
    models.Like.findAll({
      where: { messageId: ids, userId },
      attributes: ["messageId"],
      raw: true,
    }),
  ]);

  const likeMap = toCountMap(likeRows, "messageId");
  const commentMap = toCountMap(commentRows, "messageId");
  const likedSet = new Set(myLikes.map((r) => r.messageId));

  messages.forEach((m) => {
    m.dataValues.likeCount = likeMap[m.id] || 0;
    m.dataValues.commentsCount = commentMap[m.id] || 0;
    m.dataValues.likedByMe = likedSet.has(m.id);
  });
}

async function decorateComments(comments, userId) {
  const ids = comments.map((c) => c.id);
  if (ids.length === 0) return;

  const [likeRows, myLikes] = await Promise.all([
    models.Like.findAll({
      where: { commentId: ids },
      attributes: ["commentId", [fn("COUNT", col("id")), "cnt"]],
      group: ["commentId"],
      raw: true,
    }),
    models.Like.findAll({
      where: { commentId: ids, userId },
      attributes: ["commentId"],
      raw: true,
    }),
  ]);

  const likeMap = toCountMap(likeRows, "commentId");
  const likedSet = new Set(myLikes.map((r) => r.commentId));

  comments.forEach((c) => {
    c.dataValues.likeCount = likeMap[c.id] || 0;
    c.dataValues.likedByMe = likedSet.has(c.id);
  });
}

module.exports = { decorateMessages, decorateComments };
