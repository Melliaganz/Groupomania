import api from "../api/api.service";
import { toastMessageDeleted } from "../toasts/messages";

const getMessages = () => {
  return api.get('messages');
};

const getAllUserMessages = (userId) => {
  return api.get(`messages/userMessages/${userId}`);
};

const getOneMessage = (messageId) => {
  return api.get(`messages/${messageId}`);
};

const deleteOneMessage = async (messageId) => {
  try {
    await api.delete(`messages/${messageId}`);
    toastMessageDeleted();
  } catch (error) {
    console.error("Error deleting message:", error);
  }
};

export {
  getOneMessage,
  deleteOneMessage,
  getMessages,
  getAllUserMessages,
};
