import fetchApi from "../api/api.service";
import { toastMessageDeleted } from "../toasts/messages";

const getMessages = (page) => {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };

  return fetchApi(`messages`, page, requestOptions);
};

const getAllUserMessages = (userId, page) => {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };

  return fetchApi(`messages/userMessages/${userId}`, page, requestOptions);
};

const getOneMessage = (messageId, page) => {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };

  return fetchApi(`messages/${messageId}`, page, requestOptions);
};

const deleteOneMessage = (messageId, page) => {
  const requestOptions = {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };

  return fetchApi(`messages/${messageId}`, page, requestOptions)
  .then(() => toastMessageDeleted());
};

const getMessageAllComments = (messageId, page) => {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };
  return fetchApi(`http://localhost:3000/api/messages/${messageId}/comments`, page, requestOptions)
};

export {
  getOneMessage,
  deleteOneMessage,
  getMessages,
  getAllUserMessages,
  getMessageAllComments,
};
