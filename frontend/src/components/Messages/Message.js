import React from "react";
import ClearIcon from '@mui/icons-material/Clear';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import AddCommentIcon from '@mui/icons-material/AddComment';
import ShareIcon from '@mui/icons-material/Share';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import globalFunctions from "../../_utils/_functions";
import { deleteOneMessage } from "../../_utils/messages/messages.functions";

const Message = ({ ...message }) => {
  const onClickDeleteMessage = async (e) => {
    e.preventDefault();
    if (window.confirm("Voulez-vous vraiment supprimer ce message ?")) {
      try {
        await deleteOneMessage(message.id);
        if (message.onErase) {
          message.onErase();
        }
      } catch (error) {
        console.error("Failed to delete the message:", error);
        // Optionally display an error message to the user
      }
    }
  };

  return (
    <div className="card bg-transparent">
      <div className="card-header">
        <div className="justify-content-between align-items-center">
          <div className="ml-2">
            <a className="card-link" href={`/account/${message.User.id}`}>
              <img src={message.User.imageUrl} className="profilePic" alt={`${message.User.name} ${message.User.surname}`} />
              <div className="h5 m-0">@{message.User.name}</div>
              <div className="h7 text-muted">{message.User.name} {message.User.surname}</div>
            </a>
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="text-muted h7 mb-2">
          <AccessTimeIcon />{" " + globalFunctions.convertDateForHuman(message.createdAt)}
        </div>
        <a className="card-link" href={`/messages/${message.id}`}>
          <h2 className="h5 card-title">{message.title}</h2>
        </a>
        <p className={`card-text ${message.teaserMessage ? 'text-teaser overflow-hidden' : ''}`}>
          {message.content}
        </p>
      </div>
      <div className="card-footer">
        <button className="card-link">
          <ThumbUpIcon /> Like
        </button>
        <a href={`/messages/${message.id}`} className="card-link">
          <AddCommentIcon /> Comment
        </a>
        <button className="card-link">
          <ShareIcon /> Share
        </button>
        {message.canEdit && (
          <button className="card-link text-danger" onClick={onClickDeleteMessage}>
            <span className="supprimer"><ClearIcon /> Supprimer</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Message;
