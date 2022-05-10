import React, { useState }from 'react'
import { toastMessagePosted } from '../../_utils/toasts/messages';
import "react-toastify/dist/ReactToastify.css"
import { useParams } from 'react-router-dom';

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
    await fetch(`http://localhost:3000/api/messages/${id}/comment`, requestOptions)
      .then((response) => {
        if (response.status !== 201) {

        } else {
          onPost();
          setTextValue("");
          toastMessagePosted();
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
                  placeholder="Commentez !"
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
                  Commentez
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