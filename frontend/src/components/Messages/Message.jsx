import React, { useState } from "react";
import { toast } from "react-toastify";
import ClearIcon from '@mui/icons-material/Clear';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ModeCommentOutlined';
import ShareIcon from '@mui/icons-material/Share';
import globalFunctions from "../../_utils/_functions";
import { deleteOneMessage, toggleMessageLike } from "../../_utils/messages/messages.functions";
import { useI18n } from "../../_utils/i18n/I18nContext";

const Message = ({ ...message }) => {
  const { t, lang } = useI18n();
  const [liked, setLiked] = useState(Boolean(message.likedByMe));
  const [likeCount, setLikeCount] = useState(message.likeCount || 0);
  const [busy, setBusy] = useState(false);

  const onClickDeleteMessage = async (e) => {
    e.preventDefault();
    if (window.confirm(t("message.confirmDelete"))) {
      try {
        await deleteOneMessage(message.id);
        if (message.onErase) {
          message.onErase();
        }
      } catch (error) {
        console.error("Failed to delete the message:", error);
      }
    }
  };

  const onClickLike = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const { likeCount: count, likedByMe } = await toggleMessageLike(message.id);
      setLikeCount(count);
      setLiked(likedByMe);
    } catch (error) {
      console.error("Failed to like the message:", error);
    } finally {
      setBusy(false);
    }
  };

  const onClickShare = async (e) => {
    e.preventDefault();
    const url = `${window.location.origin}/messages/${message.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: message.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.info(t("message.linkCopied"));
      }
    } catch (error) {
      return;
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <a className="post-author" href={`/account/${message.User.id}`}>
          <img src={message.User.imageUrl} className="profilePic" alt={`${message.User.name} ${message.User.surname}`} />
          <span className="post-author-meta">
            <span className="post-author-name">@{message.User.name}</span>
            <span className="post-author-sub">{message.User.name} {message.User.surname}</span>
          </span>
        </a>
      </div>
      <div className="card-body">
        <div className="post-time mb-2">{globalFunctions.timeAgo(message.createdAt, lang)}</div>
        <a className="card-link" href={`/messages/${message.id}`}>
          <h2 className="h5 card-title">{message.title}</h2>
        </a>
        <p className={`card-text ${message.teaserMessage ? 'text-teaser overflow-hidden' : ''}`}>
          {message.content}
        </p>
      </div>
      <div className="card-footer">
        <button type="button" className={`action-btn ${liked ? "liked" : ""}`} onClick={onClickLike} disabled={busy}>
          {liked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />} {t("message.like")}
          {likeCount > 0 && <span className="count">{likeCount}</span>}
        </button>
        <a href={`/messages/${message.id}`} className="action-btn">
          <ChatBubbleOutlineIcon fontSize="small" /> {t("message.comment")}
          {message.commentsCount > 0 && <span className="count">{message.commentsCount}</span>}
        </a>
        <button type="button" className="action-btn" onClick={onClickShare}>
          <ShareIcon fontSize="small" /> {t("message.share")}
        </button>
        {message.canEdit && (
          <button type="button" className="action-btn danger ms-auto" onClick={onClickDeleteMessage}>
            <ClearIcon fontSize="small" /> {t("message.delete")}
          </button>
        )}
      </div>
    </div>
  );
};

export default Message;
