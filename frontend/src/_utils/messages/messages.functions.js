import api from "../api/api";
import { toastMessageDeleted } from "../toasts/messages";

const getMessages = async (page = 0) => {
  try {
    const response = await api.get(`messages?page=${page}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error.response ? error.response.data : error.message);
    throw error;
  }
};

const getAllUserMessages = async (userId, page = 0) => {
  try {
    const response = await api.get(`messages/userMessages/${userId}?page=${page}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user messages:", error.response ? error.response.data : error.message);
    throw error;
  }
};

const getOneMessage = async (messageId) => {
  try {
    const response = await api.get(`messages/${messageId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching message:", error.response ? error.response.data : error.message);
    throw error;
  }
};

const deleteOneMessage = async (messageId) => {
  try {
    await api.delete(`messages/${messageId}`);
    toastMessageDeleted();
  } catch (error) {
    console.error("Error deleting message:", error.response ? error.response.data : error.message);
  }
};

export {
  getOneMessage,
  deleteOneMessage,
  getMessages,
  getAllUserMessages,
};
