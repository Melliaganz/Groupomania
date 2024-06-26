import React, { useState } from "react";
import { toastMessagePosted } from "../../_utils/toasts/messages";
import "react-toastify/dist/ReactToastify.css";
import { REGEX } from "../../_utils/auth/auth.functions";
import PostAddIcon from '@mui/icons-material/PostAdd';
import api from "../../_utils/api/api"; // Importez l'instance d'axios configurée

const PostMessage = ({ onPost }) => {
  const [titleValue, setTitleValue] = useState("");
  const [contentValue, setContentValue] = useState("");

  const SendData = async (e) => {
    e.preventDefault();
    console.log(titleValue, contentValue);

    try {
      const response = await api.post('/messages/new', {
        title: titleValue,
        content: contentValue,
      });

      if (response.status === 201) {
        onPost();
        setTitleValue("");
        setContentValue("");
        toastMessagePosted();
      }
    } catch (error) {
      console.error("Error posting message:", error);
    }
  };

  return (
    <section className="row justify-content-center mb-5 ">
      <form className="col-11 " onSubmit={SendData}>
        <div className="card bg-transparent">
          <div className="card-header "> <PostAddIcon /> Publier un article</div>
          <div className="card-body ">
            <div className="tab-content" id="myTabContent">
              <div className="tab-pane fade show active" id="posts">
                <div className="form-group mb-2">
                  <label className="sr-only" htmlFor="title">
                    title
                  </label>
                  <input
                    id="title"
                    required
                    name="title"
                    type="text"
                    className="form-control"
                    placeholder="Titre"
                    value={titleValue}
                    pattern={REGEX.TITLE_REGEX}
                    title="Character a à Z"
                    onChange={(event) => setTitleValue(event.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="sr-only" htmlFor="message">
                    Post
                  </label>
                  <textarea
                    className="form-control"
                    required
                    id="message"
                    rows="5"
                    placeholder="Contenu du message (Lettres de A à Z)"
                    value={contentValue}
                    minLength="5"
                    onChange={(event) => setContentValue(event.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="btn-toolbar justify-content-between">
              <div className="btn-group">
                <button type="submit" className="btn btn-primary Publier">
                  <PostAddIcon/>Publier
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default PostMessage;
