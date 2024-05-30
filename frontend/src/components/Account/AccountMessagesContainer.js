import React, { useState, useEffect } from "react";
import Message from "../Messages/Message";
import { useParams } from "react-router-dom";
import { getAllUserMessages } from "../../_utils/messages/messages.functions";
import { NoMessageFound } from "../Infos/NotFound";
import FadeIn from "react-fade-in";
import InfiniteScroll from "react-infinite-scroll-component";

const AccountMessagesContainer = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [messages, setMessages] = useState([]);
  const { id } = useParams();
  const [page, setPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchMessages = (page) => {
    getAllUserMessages(id, page).then(
      (res) => {
        if (res.status === 200) {
          res.json().then((result) => {
            setMessages((prevMessages) => [...prevMessages, ...result.messages]);
            setTotalItems(result.totalItems);
            setIsLoaded(true);
            if (result.messages.length === 0) {
              setHasMore(false);
            }
          });
        } else if (res.status === 404) {
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
  };

  useEffect(() => {
    fetchMessages(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleErase = () => {
    setMessages([]);
    setPage(0);
    setHasMore(true);
    setIsLoaded(false);
    setTimeout(() => {
      setPage((prevPage) => prevPage + 1);
    }, 500); // Add a slight delay to ensure state reset before fetching new messages
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
  } else if (messages && messages.length > 0) {
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
              <React.Fragment key={message.id}>
                <FadeIn className="col-11 mb-3" transitionDuration={2000}>
                  <Message {...message} teaserMessage={true} onErase={handleErase} />
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
        <div className="text-center">Aucun message</div>
      </React.Fragment>
    );
  }
};

export default AccountMessagesContainer;
