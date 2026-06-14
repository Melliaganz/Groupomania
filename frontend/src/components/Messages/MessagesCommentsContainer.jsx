import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  getOneComment,
  getMessageAllComments,
} from "../../_utils/comments/comments.functions";
import { NoCommentsFound } from "../Infos/NotFound";
import Comment from "./Comment";
import FadeIn from "../../_utils/FadeIn";
import InfiniteScroll from "react-infinite-scroll-component";
import PostComment from "./PostComment";
import { useI18n } from "../../_utils/i18n/I18nContext";

const MessagesCommentsContainer = ({ commentQuery, postComment }) => {
  const { t } = useI18n();
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
    return <div className="text-center py-4">{t("common.error")}</div>;
  }

  if (!isLoaded) {
    return <div className="text-center py-4 text-muted">{t("common.loading")}</div>;
  }

  if (comments && commentQuery === "getOneComment") {
    return (
      <div className="mb-3">
        <Comment {...comments[0]} onErase={handleErase} />
      </div>
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
          loader={<div className="text-center py-3 text-muted">{t("common.loading")}</div>}
          style={{ overflow: "visible" }}
        >
          {comments.map((comment) => (
            <FadeIn key={comment.id} className="mb-3" transitionDuration={350}>
              <Comment {...comment} teaserComment={true} onErase={handleCommentPost} />
            </FadeIn>
          ))}
        </InfiniteScroll>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      {postComment && <PostComment onPost={handleCommentPost} />}
      <NoCommentsFound />
    </React.Fragment>
  );
};

export default MessagesCommentsContainer;
