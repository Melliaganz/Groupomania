import React, { useState } from 'react';
import { toastCommentPosted } from '../../_utils/toasts/comments';
import "react-toastify/dist/ReactToastify.css";
import { useParams } from 'react-router-dom';
import CommentIcon from '@mui/icons-material/Comment';
import api from '../../_utils/api/api'; // Import the configured axios instance

const PostComment = ({ onPost }) => {
  const { id } = useParams(); // Get the message ID from the URL parameters
  const [textValue, setTextValue] = useState(""); // State to manage comment text

  const handleSendData = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(`/messages/${id}/comment`, { text: textValue });

      if (response.status === 201) {
        onPost();
        setTextValue(""); // Clear the text area
        toastCommentPosted(); // Show success toast
      } else {
        console.error('Failed to post comment', response);
      }
    } catch (error) {
      console.error('Error posting comment', error);
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        // Request was made but no response received
        console.error('Request data:', error.request);
      } else {
        // Something else happened while setting up the request
        console.error('Error message:', error.message);
      }
    }
  };

  return (
    <section className="row justify-content-lg-center">
      <form className="col-11" onSubmit={handleSendData}>
        <div className="card bg-transparent">
          <div className="card-body">
            <div className="tab-content" id="myTabContent">
              <div className="tab-pane fade show active" id="posts">
                <div className="form-group mb-2">
                  <textarea
                    id="commentaires"
                    required
                    name="commentaire"
                    className='form-control'
                    placeholder="Commenter !"
                    minLength="2"
                    value={textValue}
                    onChange={(e) => setTextValue(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className='btn-toolbar justify-content-between'>
              <div className='btn-group'>
                <button type="submit" className='btn btn-primary'>
                  <CommentIcon /> Commenter
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default PostComment;
