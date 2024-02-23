import moment from "moment";
import { useState } from "react";
import PropTypes from "prop-types";
import "./PostComments.css";
import axios from "axios";
import { refreshPosts } from "../store/atoms";
import { useSetRecoilState } from "recoil";
import {
    checkUpVotes,
    checkDownVotes,
    commentVoteHandler,
    replyVoteHandler,
} from "../util/VotingMethods";

export function PostComments({ post, userId }) {
    axios.defaults.withCredentials = true;

    const setRefreshPosts = useSetRecoilState(refreshPosts);

    const voteHandler = async (comment, voteType) => {
        await commentVoteHandler(comment, voteType, userId);
        setRefreshPosts((prev) => !prev);
    };

    return (
        <div>
            <h4>Comments</h4>
            {post.comments.map((comment) => (
                <div key={comment._id} className="post-comment-wrapper">
                    <div className="post-comment-score">
                        <button
                            className={checkUpVotes(comment, userId)}
                            onClick={() => {
                                !checkUpVotes(comment, userId)
                                    ? voteHandler(comment, "up")
                                    : null;
                            }}
                        >
                            &#11014;️
                        </button>
                        <span>
                            {comment.votes.upVotes.count -
                                comment.votes.downVotes.count}
                        </span>
                        <button
                            className={checkDownVotes(comment, userId)}
                            onClick={() => {
                                !checkDownVotes(comment, userId)
                                    ? voteHandler(comment, "down")
                                    : null;
                            }}
                        >
                            ️&#11015;
                        </button>
                    </div>
                    <div>
                        <p>
                            <b>{comment.author} </b>
                            <span className="post-comment-time">
                                {moment(parseInt(comment.createdAt)).fromNow()}{" "}
                            </span>
                        </p>

                        <p>{comment.content}</p>
                        <ReplyComponent comment={comment} userId={userId} />
                    </div>
                </div>
            ))}
        </div>
    );
}

function ReplyComponent({ comment, userId }) {
    const [doReply, setDoReply] = useState(false);
    const [replyContent, setReplyContent] = useState("");

    const setRefreshPosts = useSetRecoilState(refreshPosts);

    const rVoteHandler = async (reply, voteType) => {
        await replyVoteHandler(reply, voteType, userId);
        setRefreshPosts((prev) => !prev);
    };

    const replyClickHandler = async (comment) => {
        if (!replyContent) return;
        try {
            await axios.post(
                `http://localhost:3000/api/post/comments/reply/${comment._id}`,
                {
                    content: replyContent,
                    createdAt: Date.now().toString(),
                }
            );
            setRefreshPosts((prev) => !prev);
            setReplyContent("");
            setDoReply(false);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            {!doReply ? (
                <p
                    style={{
                        color: "gray",
                    }}
                    onClick={() => {
                        setDoReply(true);
                    }}
                >
                    reply
                </p>
            ) : (
                <div>
                    <input
                        type="text"
                        placeholder="Reply"
                        value={replyContent}
                        onChange={(e) => {
                            setReplyContent(e.target.value);
                        }}
                    />
                    <button onClick={() => replyClickHandler(comment)}>
                        Reply
                    </button>
                </div>
            )}
            {comment.replies.length > 0
                ? comment.replies.map((reply) => (
                      <div key={reply._id} className="post-comment-wrapper">
                          <div className="post-comment-score">
                              <button
                                  className={checkUpVotes(reply, userId)}
                                  onClick={() => {
                                      !checkUpVotes(reply, userId)
                                          ? rVoteHandler(reply, "up")
                                          : null;
                                  }}
                              >
                                  &#11014;️
                              </button>
                              <span>
                                  {reply.votes.upVotes.count -
                                      reply.votes.downVotes.count}
                              </span>
                              <button
                                  className={checkDownVotes(reply, userId)}
                                  onClick={() => {
                                      !checkDownVotes(reply, userId)
                                          ? rVoteHandler(reply, "down")
                                          : null;
                                  }}
                              >
                                  ️&#11015;
                              </button>
                          </div>
                          <div>
                              <p>
                                  <b>{reply.author} </b>
                                  <span className="post-comment-time">
                                      {moment(
                                          parseInt(reply.createdAt)
                                      ).fromNow()}{" "}
                                  </span>
                              </p>
                              <p>{reply.content}</p>
                          </div>
                      </div>
                  ))
                : null}
        </>
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

const PostPropTypes = {
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string,
    author: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    comments: PropTypes.arrayOf(PropTypes.shape(CommentPropTypes)),
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
};

PostComments.propTypes = {
    post: PropTypes.shape(PostPropTypes),
    userId: PropTypes?.string,
};

ReplyComponent.propTypes = {
    comment: PropTypes.shape(CommentPropTypes),
    userId: PropTypes?.string,
};
