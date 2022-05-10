import globalFunctions from "../../_utils/_functions";
import { deleteOneMessage } from "../../_utils/messages/messages.functions";
import ClearIcon from '@mui/icons-material/Clear';
import React from "react";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import AddCommentIcon from '@mui/icons-material/AddComment';
import ShareIcon from '@mui/icons-material/Share';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const Message = ({ ...message }) => {
  const onClickDeleteMessage = (e) => {
    e.preventDefault();
    if(window.confirm("Are you sure you want to delete this message?")){
      deleteOneMessage(message.id) 
      message.onErase() 
    }
  };

  return (
    <div className="card bg-transparent">
      <div className="card-header">
        <div className="justify-content-between align-items-center ">
          <div className="justify-content-between align-items-center">
            <div className="ml-2">
              <a className="card-link" href={"/account/" + message.User.id}>
                <div className="h5 m-0">@{message.User.name}</div>
                <div className="h7 text-muted">{message.User.name} {message.User.surname}</div>

              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="card-body ">
        <div className="text-muted h7 mb-2">
          {" "}
          <AccessTimeIcon/>
          {" " + globalFunctions.convertDateForHuman(message.createdAt)}
        </div>
        <a className="card-link" href={"/messages/" + message.id}>
          <h2 className="h5 card-title">{message.title}</h2>
        </a>

        {message.teaserMessage ? (
          <p className="card-text text-teaser overflow-hidden">
            {message.content}
          </p>
        ) : (
          <p className="card-text">{message.content}</p>
        )}
      </div>
      <div className="card-footer">
         <button className="card-link">
            <ThumbUpIcon/> Like
          </button>
          <a href={"/messages/" + message.id} className="card-link">
          <AddCommentIcon/> Comment
          </a>
          <button className="card-link">
            <ShareIcon/> Share
          </button> 

        {message.canEdit === true && (
          <button
            href="/"
            className="card-link text-danger"
            onClick={onClickDeleteMessage}
          >
            <span className="supprimer"><ClearIcon /> Supprimer </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Message;
