import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import FadeIn from "../../_utils/FadeIn";

import Message from "../Messages/Message";
import { getAllUserMessages } from "../../_utils/messages/messages.functions";
import { NoMessageFound } from "../Infos/NotFound";
import { useI18n } from "../../_utils/i18n/I18nContext";

const AccountMessagesContainer = () => {
  const { t } = useI18n();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [messages, setMessages] = useState([]);
  const { id } = useParams();
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchMessages = useCallback(async () => {
    try {
      const result = await getAllUserMessages(id, page);
      if (result.messages.length === 0) {
        setHasMore(false);
      } else {
        setMessages((prevMessages) => [...prevMessages, ...result.messages]);
      }
      setIsLoaded(true);
    } catch (error) {
      setError(error);
      setIsLoaded(true);
    }
  }, [id, page]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleErase = () => {
    setMessages([]);
    setPage(0);
    setHasMore(true);
    setIsLoaded(false);
    setTimeout(() => {
      fetchMessages();
    }, 500);
  };

  if (error) {
    return error === 404 ? <NoMessageFound /> : <div className="text-center py-4">{t("common.error")}</div>;
  } else if (!isLoaded) {
    return <div className="text-center py-4 text-muted">{t("common.loading")}</div>;
  } else if (messages.length > 0) {
    return (
      <InfiniteScroll
        dataLength={messages.length}
        next={() => setPage((prevPage) => prevPage + 1)}
        hasMore={hasMore}
        loader={<div className="text-center py-3 text-muted">{t("common.loading")}</div>}
        style={{ overflow: "visible" }}
      >
        {messages.map((message) => (
          <FadeIn key={message.id} className="mb-3" transitionDuration={350}>
            <Message {...message} teaserMessage={true} onErase={handleErase} />
          </FadeIn>
        ))}
      </InfiniteScroll>
    );
  } else {
    return <NoMessageFound />;
  }
};

export default AccountMessagesContainer;
