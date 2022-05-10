import React from "react";
import globalFunctions from "../../_utils/_functions";
import AccessTimeIcon from '@mui/icons-material/AccessTime';


const Comments = ({ ...comments}) => {
    return (
        <div className="card bg-transparent">
            <div className="card-header">
                <div className="justify-content-bwteen align-items-center">
                    <div className="justify-content-between align-items-center">
                        <div className="ml-2">
                            <a className="card-link" href={"/account/" + comments.User.id}>
                                <div className="h5 m-0"> @{comments.User.name}</div>
                                <div className="h7 text-muted">{comments.User.name} {comments.User.surname}</div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card-body">
                <div className="text-muted h7 mb-2">
                    {" "}
                    <AccessTimeIcon/>
                    {" " + globalFunctions.convertDateForHuman(comments.createdAt)}
                </div>
                {comments.teaserComment ? (
                    <p className="card-text text-teaser overflow-hidden">
                        {comments.text}
                    </p>
                ) : (
                    <p className="card-text">{comments.text}</p>
                )}
            </div>
        </div>
    )
}
export default Comments