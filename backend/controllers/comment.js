const models = require("../models");
const user = require("../models/user");
const functions = require("./functions");

exports.createComment = (req, res) => {
  let userInfos = functions.getInfosUserFromToken(req, res);
  if (userInfos.userId < 0) {
    return res.status(400).json({ error: "Wrong token" });
  }
  // Params
  let messageId = req.params.id
  let text = req.body.text;

  if (text == null) {
    return res.status(400).json({ error: " Missing parameters " })
  }

 if (text.length <= 2) {
   return res.status(400).json({ error: "Invalid Parameters" });
 }

  models.User.findOne({
    where: { id: userInfos.userId },
  })
    .then((user) => {
      if (user) {
        models.Comment.create({
          UserId: user.id,
          MessageId: messageId,
          text: text,
        })
          .then((newComment) => {
            if (newComment) {
              return res.status(201).json({ Message: "Message posted !" });
            } else {
              return res.status(500).json({  error: "error.message" });
            }
          })
          .catch((error) => {
            return res.status(500).json({  error: "error.message" });
          });
      } else {
        return res.status(404).json({  error: "error.message" });
      }
    })
    .catch((error) => {
      return res.status(500).json({ error: "error.message" });
    });
};
exports.deleteComments = (req, res) => {
  let userInfos = functions.getInfosUserFromToken(req, res);
  let commentId = req.params.id;
  console.log(commentId);

  models.Comment.findOne({
    where: { id: commentId},
  })
  .then((comment) => {
    if (
      (comment && comment.UserId === userInfos.userId) ||
      userInfos.admin === true
    ) {
      models.Comment.destroy({
        where: { id: commentId},
      })
      .then(() => {
        res.status(200).json({ message: "Objet Supprimé !"});
      })
      .catch((error) => {res.status(400).json({ error })});
    }
  })
  .catch((error) => {
    return res.status(404).json({ error: error.messsage})
  })
}


exports.getMessageAllComments = (req, res) => {
  let userInfos = functions.getInfosUserFromToken(req, res);
  let messageId = req.params.id;
  let CurrentMessageId = req.params.id;
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
    const { count: totalItems, rows: comments } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return {totalItems, comments, totalPages, currentPage};
  };
  const { limit, offset } = getPagination(page, size);

  models.Comment.findAndCountAll({
    where: {messageId: CurrentMessageId},
    order: [order != null ? order.split(":") : ["createdAt", "DESC"]],
    attributes: fields !== "*" && fields != null ? fields.split(",") : null,
    limit: !isNaN(limit) ? limit : 5 ,
    offset: !isNaN(offset) ? offset : 0,
    include: [
      {
        model: models.User,
        attributes: ["name", "surname", "id", "imageUrl"],
      },
    ],
  }).then((data) => {
    const response = getPagingData(data, page, limit);
    console.log(response.comments.length);
    if (
      (response.comments.length > 0 &&
        response.comments[0].dataValues.messageId === messageId) ||
        userInfos.admin === true
    ) {
      for (index = 0; index < response.comments.length; index++) {
        response.comments[index].dataValues.canEdit = true;
      }
      res.send(response);
    } else if (response.totalItems > 0) {
      res.send(response);
    } else {
      res.status(404).json({ error: "error.messsssage" })
    }
  })
}
exports.getOneComment= (req, res) => {
  let userInfos = functions.getInfosUserFromToken(req, res);
  let commentId = req.params.id;

  models.Comment.findOne({
    where: {id: commentId},
  })
  .then((comments) => {
    if (
      (comments && comments.UserId === userInfos.userId) ||
      userInfos.admin === true 
    ) {
      comments.dataValues.canEdit = true;
      res.status(200).json(comments);
    } else if (comments) {
      res.status(200).json(comments);
    } else {
      res.status(404).send({ error: "Comment Not Found "});
    }
  })
  .catch((error) => {
    return res.status(404).json({ error: "error.messssssage"});
  });
};