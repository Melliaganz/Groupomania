import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import FadeIn from "react-fade-in";

import Message from "../Messages/Message";
import { getAllUserMessages } from "../../_utils/messages/messages.functions";
import { NoMessageFound } from "../Infos/NotFound";

const AccountMessagesContainer = () => {
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
        setIsLoaded(true);
      }
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
    }, 500); // Add a slight delay to ensure state reset before fetching new messages
  };

  if (error) {
    return error === 404 ? <NoMessageFound /> : <div>Erreur : {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Chargement...</div>;
  } else if (messages.length > 0) {
    return (
      <React.Fragment>
        <InfiniteScroll
          dataLength={messages.length}
          next={() => setPage((prevPage) => prevPage + 1)}
          hasMore={hasMore}
          loader={<div>Chargement...</div>}
        >
          <section className="row justify-content-center">
            {messages.map((message) => (
              <FadeIn key={message.id} className="col-11 mb-3" transitionDuration={2000}>
                <Message {...message} teaserMessage={true} onErase={handleErase} />
              </FadeIn>
            ))}
          </section>
        </InfiniteScroll>
      </React.Fragment>
    );
  } else {
    return <div className="text-center">Aucun message</div>;
  }
};

export default AccountMessagesContainer;
