import globalFunctions from "../../_utils/_functions";
import ClearIcon from '@mui/icons-material/Clear';
import { deleteOneComment } from "../../_utils/comments/comments.functions";
import React from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import ThumbUpIcon from "@mui/icons-material/ThumbUp";



const Comment = ({...comment}) => {
    const onClickDeleteComment = (e) => {
        e.preventDefault();
        if(window.confirm(" Voulez vous vraiment supprimer ce commentaire ?")){
            deleteOneComment(comment.id)
            comment.onErase()
        }
    };

    return (
        <div className="card bg-transparent">
            <div className="card-header">
                <div className="justify-content-between align-items-center">
                    <div className="justify-content-between align-items-center">
                        <div className="ml-2">
                            <a className="card-link" href={"/account/" + comment.User.id}>
                                <div className="h5 m-0">@{comment.User.name}</div>
                                <div className="h7 text-muted"> {comment.User.name} {comment.User.surname}</div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card-body">
                <div className="text-muted h7 mb-2">
                    {" "}
                    <AccessTimeIcon />
                    {" " + globalFunctions.convertDateForHuman(comment.createdAt)}
                </div>
                <p className="card-text">{comment.text}</p>
            </div>
            <div className="card-footer">
                <button className="card-link">
                    <ThumbUpIcon />Like
                </button>

                {comment.canEdit === true && (
                    <button
                    href="/"
                    className="card-link text-danger"
                    onClick={onClickDeleteComment}
                    >
                    </button>
                )}
            </div>
        </div>
    );
};
export default Comment;