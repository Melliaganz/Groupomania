import api from "../api/api";

// Get all comments for a specific message
const getMessageAllComments = (messageId) => {
  return api.get(`messages/${messageId}/comments`);
};

// Delete a specific comment from a specific message
const deleteOneComment = (commentId, messageId) => {
  return api.delete(`messages/${messageId}/comment/${commentId}`);
};

// Get a specific comment from a specific message
const getOneComment = (commentId, messageId) => {
  return api.get(`messages/${messageId}/comment/${commentId}`);
};

export {
  getMessageAllComments,
  deleteOneComment,
  getOneComment,
};
