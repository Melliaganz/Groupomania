import React, { useState, useEffect, useCallback } from "react";
import Message from "./Message";
import { useParams } from "react-router-dom";
import {
  getOneMessage,
  getAllUserMessages,
  getMessages,
} from "../../_utils/messages/messages.functions";
import { NoMessageFound } from "../Infos/NotFound";
import FadeIn from "react-fade-in";
import InfiniteScroll from "react-infinite-scroll-component";
import PostMessage from "./PostMessage";
import PostComment from "./PostComment";

const MessageContainer = ({ messageQuery, postMessage }) => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [messages, setMessages] = useState([]);
  const { id } = useParams();
  const [page, setPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [refetch, setRefetch] = useState(0);

  const fetchMessage = useCallback(() => {
    setIsLoaded(false);
    setError(null);

    const fetchFunction = {
      getMessages: () => getMessages(page),
      getOneMessage: () => getOneMessage(id),
      getAllUserMessages: () => getAllUserMessages(id, page),
    }[messageQuery];

    fetchFunction()
      .then((response) => {
        if (messageQuery === "getOneMessage") {
          setMessages([response]);
        } else {
          setMessages((prevMessages) => [...prevMessages, ...response.messages]);
          setTotalItems(response.totalItems);
        }
        setIsLoaded(true);
      })
      .catch((error) => {
        setError(error.response ? error.response.status : error.message);
        setIsLoaded(true);
      });
  }, [messageQuery, page, id]);

  useEffect(() => {
    fetchMessage();
  }, [page, refetch, fetchMessage]);

  const handlePost = () => {
    setRefetch((prevRefetch) => prevRefetch + 1);
    setPage(0);
    setMessages([]);
  };

  const handleCommentPost = () => {
    setRefetch((prevRefetch) => prevRefetch + 1);
    setPage(0);
  };

  const handleErase = () => {
    setRefetch((prevRefetch) => prevRefetch + 1);
    setPage(0);
    setIsLoaded(false);
  };

  if (error && error === 404) {
    return <NoMessageFound />;
  } else if (error) {
    return <div>Erreur : {error}</div>;
  } else if (!isLoaded) {
    return <div>Chargement...</div>;
  } else if (messages && messageQuery === "getOneMessage") {
    return (
      <section className="row justify-content-center">
        <div className="col-12 mb-3">
          <Message {...messages[0]} onErase={handleErase} />
        </div>
        <div>
          <PostComment onPost={handleCommentPost} />
        </div>
      </section>
    );
  } else if (
    messages &&
    messages.length > 0 &&
    (messageQuery === "getAllUserMessages" || messageQuery === "getMessages")
  ) {
    return (
      <React.Fragment>
        {postMessage && <PostMessage onPost={handlePost} />}
        <InfiniteScroll
          dataLength={messages.length}
          next={() => setPage((prevPage) => prevPage + 1)}
          hasMore={messages.length < totalItems}
        >
          <section className="row justify-content-center">
            {messages.map((message) => (
              <FadeIn key={message.id} className="col-11 mb-3" transitionDuration={2000}>
                <Message {...message} teaserMessage={true} />
              </FadeIn>
            ))}
          </section>
        </InfiniteScroll>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        {postMessage && <PostMessage onPost={handlePost} />}
        <div className="text-center">
          <NoMessageFound />
        </div>
      </React.Fragment>
    );
  }
};

export default MessageContainer;
