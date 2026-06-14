import React, { useState, useEffect, useCallback } from "react";
import Message from "./Message";
import { useParams } from "react-router-dom";
import {
  getOneMessage,
  getAllUserMessages,
  getMessages,
} from "../../_utils/messages/messages.functions";
import { NoMessageFound } from "../Infos/NotFound";
import FadeIn from "../../_utils/FadeIn";
import InfiniteScroll from "react-infinite-scroll-component";
import PostMessage from "./PostMessage";
import { useI18n } from "../../_utils/i18n/I18nContext";

const MessageContainer = ({ messageQuery, postMessage }) => {
  const { t } = useI18n();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [messages, setMessages] = useState([]);
  const { id } = useParams();
  const [page, setPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [refetch, setRefetch] = useState(0);

  const fetchMessage = useCallback(async () => {
    setIsLoaded(false);
    setError(null);

    try {
      let response;
      switch (messageQuery) {
        case "getMessages":
          response = await getMessages(page);
          setMessages((prevMessages) => [...prevMessages, ...response.messages]);
          setTotalItems(response.totalItems);
          break;
        case "getOneMessage":
          response = await getOneMessage(id);
          setMessages([response]);
          break;
        case "getAllUserMessages":
          response = await getAllUserMessages(id, page);
          setMessages((prevMessages) => [...prevMessages, ...response.messages]);
          setTotalItems(response.totalItems);
          break;
        default:
          throw new Error("Invalid message query");
      }
      setIsLoaded(true);
    } catch (error) {
      setError(error.response ? error.response.status : error.message);
      setIsLoaded(true);
    }
  }, [messageQuery, page, id]);

  useEffect(() => {
    fetchMessage();
  }, [page, refetch, fetchMessage]);

  const handlePost = () => {
    setRefetch((prevRefetch) => prevRefetch + 1);
    setPage(0);
    setMessages([]);
  };

  const handleErase = () => {
    setRefetch((prevRefetch) => prevRefetch + 1);
    setPage(0);
    setIsLoaded(false);
  };

  if (error && error === 404) {
    return <NoMessageFound />;
  } else if (error) {
    return <div className="text-center py-4">{t("common.error")}</div>;
  } else if (!isLoaded) {
    return <div className="text-center py-4 text-muted">{t("common.loading")}</div>;
  } else if (messages && messageQuery === "getOneMessage") {
    return (
      <div className="mb-3">
        <Message {...messages[0]} onErase={handleErase} />
      </div>
    );
  } else if (messages && messages.length > 0) {
    return (
      <React.Fragment>
        {postMessage && <PostMessage onPost={handlePost} />}
        <InfiniteScroll
          dataLength={messages.length}
          next={() => setPage((prevPage) => prevPage + 1)}
          hasMore={messages.length < totalItems}
          loader={<div className="text-center py-3 text-muted">{t("common.loading")}</div>}
          style={{ overflow: "visible" }}
        >
          {messages.map((message) => (
            <FadeIn key={message.id} className="mb-3" transitionDuration={350}>
              <Message {...message} teaserMessage={true} />
            </FadeIn>
          ))}
        </InfiniteScroll>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        {postMessage && <PostMessage onPost={handlePost} />}
        <NoMessageFound />
      </React.Fragment>
    );
  }
};

export default MessageContainer;
