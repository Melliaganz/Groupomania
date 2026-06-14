import React, { useState } from 'react';
import { toastCommentPosted } from '../../_utils/toasts/comments';
import "react-toastify/dist/ReactToastify.css";
import { useParams } from 'react-router-dom';
import CommentIcon from '@mui/icons-material/Comment';
import api from '../../_utils/api/api';
import { useI18n } from "../../_utils/i18n/I18nContext";

const PostComment = ({ onPost }) => {
  const { t } = useI18n();
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
      }
    } catch (err) {
      console.error('Error posting comment', err);
      setError(t("common.error"));
    }
  };

  return (
    <form className="card mb-4" onSubmit={handleSendData}>
      <div className="card-body">
        <div className="form-group mb-3">
          <textarea
            id="commentaires"
            required
            name="commentaire"
            className="form-control"
            placeholder={t("comment.placeholder")}
            minLength="2"
            rows="2"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
          />
        </div>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-primary">
            <CommentIcon /> {t("comment.submit")}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PostComment;
