import React, { useState } from 'react';
import { toastCommentPosted } from '../../_utils/toasts/comments';
import "react-toastify/dist/ReactToastify.css";
import { useParams } from 'react-router-dom';
import CommentIcon from '@mui/icons-material/Comment';
import api from '../../_utils/api/api'; // Importez l'instance d'axios configurée

const PostComment = ({ onPost }) => {
  const { id } = useParams();
  const [textValue, setTextValue] = useState("");

  async function SendData(e) {
    e.preventDefault();
    console.log(textValue);

    try {
      const response = await api.post(`/messages/${id}/comment`, {
        text: textValue,
      });
      if (response.status === 201) {
        onPost();
        setTextValue("");
        toastCommentPosted();
        window.location.reload();
      } else {
        console.log('Failed to post comment', response);
      }
    } catch (error) {
      console.log('Error posting comment', error);
    }
  }

  return (
    <React.Fragment>
      <section className="row justify-content-lg-center">
        <form className="col-11 " onSubmit={SendData}>
          <div className="card bg-transparent">
            <div className="card-body ">
              <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade show active" id="posts">
                  <div className="form-group mb-2">
                    <label className="sr-only" htmlFor="title"></label>
                    <textarea
                      id="commentaires"
                      required
                      name="commentaire"
                      type="text"
                      className='form-control'
                      placeholder="Commenter !"
                      minLength="2"
                      value={textValue}
                      onChange={(event) => setTextValue(event.target.value)}
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
    </React.Fragment>
  );
};

export default PostComment;
