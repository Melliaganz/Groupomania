import React, { useState } from "react";
import { toastMessagePosted } from "../../_utils/toasts/messages";
import "react-toastify/dist/ReactToastify.css";
import { REGEX } from "../../_utils/auth/auth.functions";
import PostAddIcon from '@mui/icons-material/PostAdd';
import api from "../../_utils/api/api";
import { useI18n } from "../../_utils/i18n/I18nContext";

const PostMessage = ({ onPost }) => {
  const { t } = useI18n();
  const [titleValue, setTitleValue] = useState("");
  const [contentValue, setContentValue] = useState("");

  const SendData = async (e) => {
    e.preventDefault();
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
    <form className="card mb-4" onSubmit={SendData}>
      <div className="card-header"><PostAddIcon /> {t("post.title")}</div>
      <div className="card-body">
        <div className="form-group mb-2">
          <label className="sr-only" htmlFor="title">{t("post.titlePlaceholder")}</label>
          <input
            id="title"
            required
            name="title"
            type="text"
            className="form-control"
            placeholder={t("post.titlePlaceholder")}
            value={titleValue}
            pattern={REGEX.TITLE_REGEX}
            onChange={(event) => setTitleValue(event.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <label className="sr-only" htmlFor="message">{t("post.contentPlaceholder")}</label>
          <textarea
            className="form-control"
            required
            id="message"
            rows="3"
            placeholder={t("post.contentPlaceholder")}
            value={contentValue}
            minLength="5"
            onChange={(event) => setContentValue(event.target.value)}
          />
        </div>
        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-primary">
            <PostAddIcon /> {t("post.submit")}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PostMessage;
