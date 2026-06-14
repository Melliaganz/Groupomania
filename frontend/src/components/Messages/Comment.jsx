import React, { useState } from "react";
import ClearIcon from '@mui/icons-material/Clear';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import globalFunctions from "../../_utils/_functions";
import { deleteOneComment, toggleCommentLike } from "../../_utils/comments/comments.functions";
import { useI18n } from "../../_utils/i18n/I18nContext";

const Comment = ({ ...comment }) => {
  const { t, lang } = useI18n();
  const [liked, setLiked] = useState(Boolean(comment.likedByMe));
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);
  const [busy, setBusy] = useState(false);

  const onClickDeleteComment = (e) => {
    e.preventDefault();
    if (window.confirm(t("comment.confirmDelete"))) {
      deleteOneComment(comment.id, comment.messageId);
      if (comment.onErase) comment.onErase();
    }
  };

  const onClickLike = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const { likeCount: count, likedByMe } = await toggleCommentLike(comment.messageId, comment.id);
      setLikeCount(count);
      setLiked(likedByMe);
    } catch (error) {
      console.error("Failed to like the comment:", error);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <a className="post-author" href={"/account/" + comment.User.id}>
          <img src={comment.User.imageUrl} alt={`${comment.User.name} ${comment.User.surname}`} className="profilePic" />
          <span className="post-author-meta">
            <span className="post-author-name">@{comment.User.name}</span>
            <span className="post-author-sub">{comment.User.name} {comment.User.surname}</span>
          </span>
        </a>
      </div>
      <div className="card-body">
        <div className="post-time mb-2">{globalFunctions.timeAgo(comment.createdAt, lang)}</div>
        <p className="card-text">{comment.text}</p>
      </div>
      <div className="card-footer">
        <button type="button" className={`action-btn ${liked ? "liked" : ""}`} onClick={onClickLike} disabled={busy}>
          {liked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />} {t("comment.like")}
          {likeCount > 0 && <span className="count">{likeCount}</span>}
        </button>
        {comment.canEdit === true && (
          <button type="button" className="action-btn danger ms-auto" onClick={onClickDeleteComment}>
            <ClearIcon fontSize="small" /> {t("comment.delete")}
          </button>
        )}
      </div>
    </div>
  );
};

export default Comment;
