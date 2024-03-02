import moment from "moment";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { VotingComponent } from "./VotingComponent";
import { findComments } from "../util/findComments";
import AddComment from "./AddComment";

export function PostComments({ comment, userId, allComments, commentRefs }) {
    axios.defaults.withCredentials = true;

    // const setRefreshPosts = useSetRecoilState(refreshPosts);
    const [doReply, setDoReply] = useState(false);
    // const [replyContent, setReplyContent] = useState("");
    const [replies, setReplies] = useState([]);

    useEffect(() => {
        if (!comment) return;
        // console.log(comment);
        const commentReplies = findComments(
            comment._id,
            allComments,
            commentRefs
        );
        setReplies(commentReplies);
        // setUpVoteUsers();
    }, [allComments, comment, commentRefs]);

    // const replyClickHandler = async (comment) => {
    //     if (!replyContent) return;

    //     try {
    //         const res = await axios.post(
    //             `http://localhost:3000/api/post/comments/reply/${comment._id}`,
    //             {
    //                 content: replyContent,
    //                 createdAt: Date.now().toString(),
    //             }
    //         );

    //         // setReplies(res.data.replies);
    //         // setRefreshPosts((prev) => !prev);
    //         setReplyContent("");
    //         setDoReply(false);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    const setRepliesHandler = (newComment) => {
        setReplies((prev) => [...prev, newComment]);
    };

    return (
        <div className="flex gap-5 m-2 p-2">
            <div className="flex flex-col flex-initial align-center">
                <VotingComponent
                    votes={comment.votes}
                    userId={userId}
                    type={"comment"}
                    itemId={comment._id}
                />
            </div>
            <div className="flex-grow">
                <p className="mb-1">
                    <span className="font-bold">{comment.author} </span>
                    <span className="text-zinc-500 ml-1">
                        {moment(parseInt(comment.createdAt)).fromNow()}{" "}
                    </span>
                </p>

                <p className="mb-1">{comment.content}</p>
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
                        {/* <input
                            type="text"
                            placeholder="Reply"
                            value={replyContent}
                            onChange={(e) => {
                                setReplyContent(e.target.value);
                            }}
                        />
                        <button onClick={() => replyClickHandler(comment)}>
                            Reply
                        </button> */}
                        <AddComment
                            id={comment._id}
                            setCommentsHandler={setRepliesHandler}
                        />
                    </div>
                )}
                <div className="border-l border-l-zinc-50">
                    {replies.length > 0
                        ? replies.map((reply) => (
                              <PostComments
                                  key={reply._id}
                                  comment={reply}
                                  userId={userId}
                                  allComments={allComments}
                                  commentRefs={commentRefs}
                              />
                          ))
                        : null}
                    {/* <ReplyComponent comment={comment} userId={userId} /> */}
                </div>
            </div>
        </div>
    );
}

const CommentPropTypes = {
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
};

PostComments.propTypes = {
    comment: PropTypes.shape(CommentPropTypes),
    userId: PropTypes?.string,
    allComments: PropTypes.arrayOf(PropTypes.shape(CommentPropTypes)),
    commentRefs: PropTypes.arrayOf(PropTypes.object),
};
