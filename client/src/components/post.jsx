import { useState } from "react";
import moment from "moment";
import "./post.css";
import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { refreshPosts } from "../store/atoms";

export default function Post({ post }) {
    const [score, setScore] = useState(0);
    const navigate = useNavigate();
    const setRefreshPosts = useSetRecoilState(refreshPosts);

    const deleteHandler = async () => {
        try {
            await axios.delete(
                `http://localhost:3000/api/post/deletePost/${post._id}`
            );
            setRefreshPosts((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="post-container">
            <div className="post-score">
                <button onClick={() => setScore(score + 1)}>&#11014;️</button>
                <span>{post.votes}</span>
                <button onClick={() => setScore(score - 1)}>️&#11015;</button>
            </div>

            <div className="post-image">
                {post.thumbnail !== "self" && (
                    <img src={post.thumbnail} alt="" />
                )}
            </div>

            <div className="post-details">
                <div className="post-wrapper">
                    <a
                        onClick={() => navigate(`/post/${post._id}`)}
                        className="post-link"
                    >
                        <span className="post-title">{post.title}</span>
                    </a>
                </div>

                <div className="post-wrapper">
                    <span className="post-description">{post.content}</span>
                </div>

                <div className="post-wrapper">
                    Submitted {moment(parseInt(post.createdAt)).fromNow()} by{" "}
                    {post.author}
                </div>

                <div className="post-links-wrapper">
                    <a className="post-link" href={post.url}>
                        {post.comments
                            ? `${post.comments.length} comments`
                            : "comment"}
                    </a>
                    <a className="post-link-grey" href="/#">
                        share
                    </a>
                    <a className="post-link-grey" href="/#">
                        save
                    </a>
                    <a className="post-link-grey" href="/#">
                        hide
                    </a>
                    <a className="post-link-grey" href="/#">
                        report
                    </a>
                    <a
                        className="post-link-grey"
                        href="/#"
                        onClick={deleteHandler}
                    >
                        delete
                    </a>
                </div>
            </div>
        </div>
    );
}

const CommentPropTypes = {
    votes: PropTypes.shape({
        upVotes: PropTypes.number,
        downVotes: PropTypes.number,
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
    upVotes: PropTypes.number.isRequired,
    downVotes: PropTypes.number.isRequired,
    __v: PropTypes.number.isRequired,
};

Post.propTypes = {
    post: PropTypes.shape(PostPropTypes),
};
