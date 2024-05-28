import api from "../api/api";
import { toastMessageDeleted } from "../toasts/messages";

const getMessages = async () => {
  try {
    const response = await api.get('messages');
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
};

const getAllUserMessages = async (userId) => {
  try {
    const response = await api.get(`messages/userMessages/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user messages:", error);
  }
};

const getOneMessage = async (messageId) => {
  try {
    const response = await api.get(`messages/${messageId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching message:", error);
  }
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
