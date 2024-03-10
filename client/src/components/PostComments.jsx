import moment from "moment";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { VotingComponent } from "./VotingComponent";
import AddComment from "./AddComment";

export function PostComments({ comment, userId }) {
    axios.defaults.withCredentials = true;

    // const setRefreshPosts = useSetRecoilState(refreshPosts);
    const [doReply, setDoReply] = useState(false);
    // const [replyContent, setReplyContent] = useState("");
    const [replies, setReplies] = useState([]);

    useEffect(() => {
        console.log(comment.comments._id);
        if (!comment.comments) return;
        if (comment.replies.length > 0) setReplies(comment.replies);
        // setUpVoteUsers();
    }, [comment]);

    const setRepliesHandler = (newComment) => {
        setReplies((prev) => [...prev, newComment]);
    };

    return (
        <div className="flex gap-5 m-2 p-2">
            <div className="flex flex-col flex-initial align-center">
                <VotingComponent
                    votes={comment.comments.votes}
                    userId={userId}
                    type={"comment"}
                    itemId={comment.comments._id}
                />
            </div>
            <div className="flex-grow">
                <p className="mb-1">
                    <span className="font-bold">{comment.author} </span>
                    <span className="text-zinc-500 ml-1">
                        {moment(parseInt(comment.comments.createdAt)).fromNow()}{" "}
                    </span>
                </p>

                <p className="mb-1">{comment.comments.content}</p>
                {!doReply ? (
                    <span
                        style={{
                            color: "gray",
                        }}
                        onClick={() => {
                            setDoReply(true);
                        }}
                    >
                        reply
                    </span>
                ) : (
                    <div>
                        <AddComment
                            id={comment.comments._id}
                            setCommentsHandler={setRepliesHandler}
                        />
                    </div>
                )}
                <div className="border-l border-l-zinc-50">
                    {replies.length > 0
                        ? replies.map((reply) => (
                              <PostComments
                                  key={reply.comments._id}
                                  comment={reply}
                                  userId={userId}
                                  //   allComments={allComments}
                                  //   commentRefs={commentRefs}
                              />
                          ))
                        : null}
                </div>
            </div>
        </div>
    );
}

const CommentPropTypes = () => ({
    comment: {
        votes: PropTypes.shape({
            upVotes: PropTypes.shape({
                count: PropTypes.number,
                users: PropTypes.array,
            }),
            downVotes: PropTypes.shape({
                count: PropTypes.number,
                users: PropTypes.array,
            }),
        }),
        content: PropTypes.string,
        createdAt: PropTypes.string,
        author: PropTypes.string,
        _id: PropTypes.string,
    },
    replies: PropTypes.arrayOf(PropTypes.shape(CommentPropTypes)),
});

PostComments.propTypes = {
    comment: PropTypes.shape(CommentPropTypes),
    userId: PropTypes?.string,
    // allComments: PropTypes.arrayOf(PropTypes.shape(CommentPropTypes)),
    // commentRefs: PropTypes.arrayOf(PropTypes.object),
};
