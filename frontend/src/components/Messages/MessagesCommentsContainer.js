import React, { useState, useEffect, useCallback } from "react";
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

const MessagesCommentsContainer = ({ commentQuery, postComment }) => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [comments, setComments] = useState([]);
  const { id } = useParams();
  const [page, setPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [refetch, setRefetch] = useState(0);

  const fetchComment = useCallback(async () => {
    setIsLoaded(false);
    setError(null);

    try {
      let response;
      switch (commentQuery) {
        case "getOneComment":
          response = await getOneComment(id);
          setComments([response.data]);
          break;
        case "getMessageAllComments":
          response = await getMessageAllComments(id, page);
          setComments((prevComments) => [...prevComments, ...response.data.comments]);
          setTotalItems(response.data.totalItems);
          break;
        default:
          throw new Error("Invalid comment query");
      }
      setIsLoaded(true);
    } catch (error) {
      setError(error.response ? error.response.status : error.message);
      setIsLoaded(true);
    }
  }, [commentQuery, id, page]);

  useEffect(() => {
    fetchComment();
  }, [page, refetch, fetchComment]);

  const handleCommentPost = () => {
    setRefetch((prevRefetch) => prevRefetch + 1);
    setPage(0);
    setComments([]);
  };

  const handleErase = () => {
    setRefetch((prevRefetch) => prevRefetch + 1);
    setPage(0);
    setIsLoaded(false);
  };

  if (error) {
    if (error === 404) {
      return <NoCommentsFound />;
    }
    return <div>Erreur : {error}</div>;
  }

  if (!isLoaded) {
    return <div>Chargement...</div>;
  }

  if (comments && commentQuery === "getOneComment") {
    return (
      <section className="row justify-content-center">
        <div className="col-12 mb-3">
          <Comment {...comments[0]} onErase={handleErase} />
        </div>
      </section>
    );
  }

  if (comments && comments.length > 0 && commentQuery === "getMessageAllComments") {
    return (
      <React.Fragment>
        {postComment && <PostComment onPost={handleCommentPost} />}
        <InfiniteScroll
          dataLength={comments.length}
          next={() => setPage((prevPage) => prevPage + 1)}
          hasMore={comments.length < totalItems}
          loader={<div>Chargement...</div>}
        >
          <section className="row justify-content-center">
            {comments.map((comment) => (
              <FadeIn key={comment.id} className="col-11 mt-2" transitionDuration={2000}>
                <Comment {...comment} teaserComment={true} />
              </FadeIn>
            ))}
          </section>
        </InfiniteScroll>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      {postComment && <PostComment onPost={handleCommentPost} />}
      <div className="text-center">Aucun Commentaire</div>
    </React.Fragment>
  );
};

export default MessagesCommentsContainer;
