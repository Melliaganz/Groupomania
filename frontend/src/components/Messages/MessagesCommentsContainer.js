import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import {
    getOneComment,
    getMessageAllComments,
} from "../../_utils/comments/comments.functions";
import { NoCommentsFound } from "../Infos/NotFound";
import Comment from "./Comment";
import FadeIn from "react-fade-in";
import InfiniteScroll from "react-infinite-scroll-component";
import PostComment from "./PostComment";

const MessagesCommentsContainer = ({ ...params}) => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [comments, setComments] = useState([]);
    const { id } = useParams();
    const [page, setPage] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [refetch, setRefetch] = useState(0);

    const fetchComment = () => {
        if (params.commentQuery === "getOneComment") {
            getOneComment(id).then(
                (res) => {
                    if (res.status === 200) {
                        res.json().then((result) => {
                            setComments(result);
                            setIsLoaded(true);
                        });
                    } else if (res.status === 404) {
                        setError(404);
                        setIsLoaded(true);
                    } else {
                        setError(res.statusText);
                        setIsLoaded(true);
                    }
                },
                (error => {
                    setIsLoaded(true);
                    setError(error);
                })
            );
        }
        if (params.commentQuery === "getMessageAllComments") {
            getMessageAllComments(id, page).then(
                (res) => {
                    if (res.status === 200) {
                        res.json().then((result) => {
                            setComments([...comments, ...result.comments]);
                            setTotalItems(result.totalItems);
                            console.log(result);
                            setIsLoaded(true);
                        });
                    } else if(res.status === 404) {
                        setError(404);
                        setIsLoaded(true);
                    } else {
                        setError(res.statusText);
                        setIsLoaded(true);
                    }
                },
                (error) => {
                    setError(error);
                    setIsLoaded(true);
                }
            );
        }
    };
    useEffect(() => {
        fetchComment();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, refetch]);

    const handlePost = () => {
        setRefetch(( refetch ) => refetch + 1);
        setPage((page) => {
            page = 0;
        });
        setComments(comments.splice(0, comments.length))
    }
    const handleErase = () => {
        setRefetch((refetch) => refetch +1);
        setPage((page) => {
            page = 0;
        });
        setIsLoaded(false);
    };

    if (error && error === 404){
        return (
            <div>
                <NoCommentsFound />
            </div>
        );
    } else if (error) {
        return <div> Erreur: {error} </div>
    } else if (!isLoaded) {
        return <div> Chargement...</div>;
    } else if (comments && params.commentQuery === "getOneComment") {
        return (
            <React.Fragment>
                <section className="row justify-content-center">
                    <div className="col-12 mb-3">
                        <Comment {...comments} onErase={handleErase} />
                    </div>
                </section>
            </React.Fragment>
        )
    } else if (
        comments && comments.length > 0 &&
        (params.commentQuery === "getMessageAllComments")
    ) {
        return (
            <React.Fragment>
                {params.PostComment ? < PostComment onPost={handlePost} /> : null}
                <InfiniteScroll
                dataLength={totalItems}
                next={() => setPage(+1)}
                hasMore={true}
                >
                    <section className="row justify-content-center">
                        {comments.map((comment) => (
                            <React.Fragment key= {comment.id}>
                                <FadeIn className="coll-11 mb-3" transitionDuration={2000}>
                                    <Comment {...comment} teaserComment={true} />
                                </FadeIn>
                            </React.Fragment>
                        ))}
                    </section>
                </InfiniteScroll>
            </React.Fragment>
        );
    } else {
        return (
            <React.Fragment>
                {params.postComment ? <PostComment onPost={handlePost} /> : null}
                <div className="text-center">Aucun Commentaire</div>
            </React.Fragment>
        );
    }
};
export default MessagesCommentsContainer;