import React, { useState, useEffect } from "react";
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
  const [comments, setComments] = useState([]);

  const fetchMessage = () => {
    if (params.messageQuery === "getMessages") {
      getMessages(page).then(
        (res) => {
          if (res.status === 200) {
            res.json().then((result) => {
              setMessages([...messages, ...result.messages]);
              setTotalItems(result.totalItems);
              console.log(result);
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

        (error) => {
          setError(error);
          setIsLoaded(true);
        }
      );
    }
    if (params.messageQuery === "getOneMessage") {
      getOneMessage(id).then(
        (res) => {
          if (res.status === 200) {
            res.json().then((result) => {
              setMessages(result);
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

        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
    }

    if (params.messageQuery === "getAllUserMessages") {
      getAllUserMessages(id, page).then(
        (res) => {
          if (res.status === 200) {
            res.json().then((result) => {
              setMessages([...messages, ...result.messages]);
              setTotalItems(result.totalItems);
              console.log(result);
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

        (error) => {
          setError(error);
          setIsLoaded(true);
        }
      );
    }
  };

  useEffect(() => {
    fetchMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, refetch]);

  // Reset messages and pages on a new post.
  const handlePost = () => {
    setRefetch((refetch) => refetch + 1);
    setPage((page) => {
      page = 0;
    });
    setMessages(messages.splice(0, messages.length));
    
  };
  const handleCommentPost = () => {
    setRefetch((refetch) => refetch + 1);
    setPage((page) => {
      page= 0;
    });
    setComments(comments.splice(0, comments.length));
  }

  const handleErase = () => {
    setRefetch((refetch) => refetch + 1);
    setPage((page) => {
      page = 0;
    });
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
          <div><PostComment onPost={handleCommentPost}/></div>
        </section>
      </React.Fragment>
    );
  } else if (
    messages &&
    messages.length > 0 &&
    (params.messageQuery === "getAllUserMessages") |
      (params.messageQuery === "getMessages")
  ) {
    return (
      <React.Fragment>
        {params.postMessage ? <PostMessage onPost={handlePost} /> : null}
        <InfiniteScroll
          dataLength={totalItems}
          next={() => setPage(+1)}
          hasMore={true}
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
