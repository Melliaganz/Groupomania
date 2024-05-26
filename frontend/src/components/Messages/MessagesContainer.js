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

const MessageContainer = ({ ...params }) => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [messages, setMessages] = useState([]);
  const { id } = useParams();
  const [page, setPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [refetch, setRefetch] = useState(0);

  const fetchMessage = useCallback(() => {
    if (params.messageQuery === "getMessages") {
      getMessages(page)
        .then((response) => {
          const result = response.data;
          setMessages((prevMessages) => [...prevMessages, ...result.messages]);
          setTotalItems(result.totalItems);
          console.log(result);
          setIsLoaded(true);
        })
        .catch((error) => {
          setError(error.response ? error.response.status : error.message);
          setIsLoaded(true);
        });
    } else if (params.messageQuery === "getOneMessage") {
      getOneMessage(id)
        .then((response) => {
          setMessages(response.data);
          setIsLoaded(true);
        })
        .catch((error) => {
          setError(error.response ? error.response.status : error.message);
          setIsLoaded(true);
        });
    } else if (params.messageQuery === "getAllUserMessages") {
      getAllUserMessages(id, page)
        .then((response) => {
          const result = response.data;
          setMessages((prevMessages) => [...prevMessages, ...result.messages]);
          setTotalItems(result.totalItems);
          console.log(result);
          setIsLoaded(true);
        })
        .catch((error) => {
          setError(error.response ? error.response.status : error.message);
          setIsLoaded(true);
        });
    }
  }, [params.messageQuery, page, id]);

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
    return (
      <div>
        <NoMessageFound />
      </div>
    );
  } else if (error) {
    return <div>Erreur : {error}</div>;
  } else if (!isLoaded) {
    return <div>Chargement...</div>;
  } else if (messages && params.messageQuery === "getOneMessage") {
    return (
      <React.Fragment>
        <section className="row justify-content-center  ">
          <div className="col-12 mb-3  ">
            <Message {...messages} onErase={handleErase} />
          </div>
          <div><PostComment onPost={handleCommentPost} /></div>
        </section>
      </React.Fragment>
    );
  } else if (
    messages &&
    messages.length > 0 &&
    (params.messageQuery === "getAllUserMessages" || params.messageQuery === "getMessages")
  ) {
    return (
      <React.Fragment>
        {params.postMessage ? <PostMessage onPost={handlePost} /> : null}
        <InfiniteScroll
          dataLength={messages.length}
          next={() => setPage((prevPage) => prevPage + 1)}
          hasMore={messages.length < totalItems}
        >
          <section className="row justify-content-center ">
            {messages.map((message) => (
              <React.Fragment key={message.id}>
                <FadeIn className="col-11 mb-3" transitionDuration={2000}>
                  <Message {...message} teaserMessage={true} />
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
        {params.postMessage ? <PostMessage onPost={handlePost} /> : null}
        <div className="text-center"><NoMessageFound /></div>
      </React.Fragment>
    );
  }
};

export default MessageContainer;
