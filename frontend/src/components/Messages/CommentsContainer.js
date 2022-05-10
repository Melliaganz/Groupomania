import React, {useState, useEffect } from "react";
import Comments from "./Comments";
import { useParams } from "react-router-dom";
import { getMessageAllComments } from "../../_utils/messages/messages.functions";
import { NoCommentsFound } from "../Infos/NotFound";
import FadeIn from "react-fade-in";
import InfiniteScroll from "react-infinite-scroll-component";
import PostComment from "./PostComment";

const CommentsContainer = ({...params}) => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [comments, setComments] = useState([]);
    const { id } = useParams();
    const [page, setPage] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [refetch, setRefetch] = useState(0);

    const fetchComments = () => {
        if (params.commentsQuery === "getMessageAllComments") {
            getMessageAllComments(id, page).then(
                (res) => {
                    if (res.status === 200) {
                        res.json().then((result) => {
                            setComments([...comments, ...result.comments]);
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
        fetchComments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, refetch]);

    const handlePost = () => {
        setRefetch((refetch) => refetch + 1);
        setPage((page) => {
            page = 0;
        });
        setComments(comments.splice(0, comments.length));

    };

    if (error && error === 404) {
        return (
            <div>
                <NoCommentsFound />
            </div>
        );
    } else if (error) {
        return <div>Erreur : {error} </div>;
    } else if (!isLoaded) {
        return <div> Chargement...</div>;
    } else if (params.commentsQuery === "getMessageAllComments") {
        return (
            <React.Fragment>
            {params.PostComment ? <PostComment onPost={handlePost} /> : null}
            <InfiniteScroll
            dataLength={totalItems}
            next={() => setPage(+1)}
            hasMore={true}
          >
          <section className="row justify-content-center ">
              {comments.map((comment) => (
                  <React.Fragment key={comment.id}>
                      <FadeIn className="col-5 mb-3" transitionDuration={2000}>
                          <Comments {...comments} teaserComments={true} />
                      </FadeIn>
                  </React.Fragment>
              ))}
          </section>
          </InfiniteScroll>
            </React.Fragment>
        )
    }
}
export default CommentsContainer;