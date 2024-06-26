import React, { useState } from 'react';
import { toastCommentPosted } from '../../_utils/toasts/comments';
import "react-toastify/dist/ReactToastify.css";
import { useParams } from 'react-router-dom';
import CommentIcon from '@mui/icons-material/Comment';
import api from '../../_utils/api/api';

const PostComment = ({ onPost }) => {
  const { id } = useParams();
  const [textValue, setTextValue] = useState("");
  const [error, setError] = useState(null);

  const handleSendData = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(`/messages/${id}/comment`, { text: textValue });

      if (response.status === 201) {
        onPost();
        setTextValue("");
        toastCommentPosted();
        setError(null);
      } else {
        console.error('Failed to post comment', response);
        setError(`Failed to post comment: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error posting comment', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        setError(`Error: ${error.response.status} - ${error.response.data.error}`);
      } else if (error.request) {
        console.error('Request data:', error.request);
        setError('Error: No response received from the server.');
      } else {
        console.error('Error message:', error.message);
        setError(`Error: ${error.message}`);
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
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
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
