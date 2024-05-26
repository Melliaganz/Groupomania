import api from "../api/api.service";

const getMessageAllComments = (messageId) => {
  return api.get(`messages/${messageId}/comments`);
};

const deleteOneComment = (commentId, messageId) => {
  return api.delete(`messages/${messageId}/comment/${commentId}`);
};

const getOneComment = (commentId, messageId) => {
  return api.get(`messages/${messageId}/comment/${commentId}`);
};

export {
  getMessageAllComments,
  deleteOneComment,
  getOneComment,
};
