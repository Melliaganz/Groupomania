import React, { useState }from 'react'
import { toastCommentPosted } from '../../_utils/toasts/comments';
import "react-toastify/dist/ReactToastify.css"
import { useParams } from 'react-router-dom';
import CommentIcon from '@mui/icons-material/Comment';

const PostComment = ({ onPost }) => {
  const { id } = useParams();
  const [textValue, setTextValue] = useState("");

  async function SendData(e) {
    e.preventDefault();
    console.log(textValue);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        text: textValue,
      }),
    };
    await fetch(`https://polar-sea-78901-bf25cb159b01.herokuapp.com/api/messages/${id}/comment`, requestOptions)
      .then((response) => {
        if (response.status !== 201) {

        } else {
          onPost();
          setTextValue("");
          toastCommentPosted();
          window.location.reload();
        }
        
      })
      .catch((error) => console.log(error));

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
                  <label className="sr-only" htmlFor="title">
                  </label>
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
                <button type= "submit" className='btn btn-primary'>
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