import fetchApi from "../api/api.service"

const getMessageAllComments = (messageId, page) => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    };
    return fetchApi(`messages/${messageId}/comments`, page, requestOptions)
  };
  const deleteOneComment = (commentId, messageId, page) => {
      const requestOptions = {
          method: "DELETE",
          headers: {"Content-Type": "application/json" },
          credentials: "include",
      };
      
      return fetchApi(`messages/${messageId}/comment/${commentId}`, page, requestOptions)
  }

  const getOneComment = (commentId, messageId, page) => {
      const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application.json"},
          credentials: "include",
      }

      return fetchApi(`messages/${messageId}/comment/${commentId},`, page, requestOptions)
  }

  export {
      getMessageAllComments,
      deleteOneComment,
      getOneComment,
  }