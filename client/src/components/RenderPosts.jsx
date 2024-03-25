import React from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { VotingComponent } from "./VotingComponent";

function RenderPosts({ post, userId }) {
    const navigate = useNavigate();

    const shareHandler = () => {
        navigator.clipboard.writeText(`http://localhost:5173/post/${post._id}`);
        toast.info("Post link copied to clipboard!");
    };

    return (
        <>
            <div className="bg-zinc-900 mb-4 p-4 rounded-lg flex gap-1">
                <div>
                    <div className="flex flex-col mr-2 flex-initial align-center">
                        <VotingComponent
                            votes={post.votes}
                            userId={userId}
                            type={"post"}
                            itemId={post._id}
                        />
                    </div>
                </div>

                <div>
                    <div>
                        {post.thumbnail !== "self" && (
                            <img src={post.thumbnail} alt="" />
                        )}
                    </div>
                    <div>
                        <div>
                            <a
                                className="text-xl font-bold cursor-pointer hover:underline"
                                onClick={() => navigate(`/post/${post._id}`)}
                            >
                                <span>{post.title}</span>
                            </a>
                        </div>
                    </div>
                    <div>
                        <span className="text-justify line-clamp-2 mt-2">
                            {post.content}
                        </span>
                    </div>
                    <div className="mt-2 text-gray-300 text-sm">
                        Posted {moment(parseInt(post.createdAt)).fromNow()} by{" "}
                        <span className="font-semibold text-gray-100">
                            {post.author}
                        </span>
                    </div>
                    <div className="mt-2 text-gray-300 flex space-x-2 text-sm ">
                        <a href={post.url}>
                            {post.commentCount > 0
                                ? `${post.commentCount} comments`
                                : "comment"}
                        </a>
                        <a
                            className="cursor-pointer hover:underline"
                            onClick={shareHandler}
                        >
                            share
                        </a>
                        <a className="cursor-pointer hover:underline">save</a>
                        <a className="cursor-pointer hover:underline">hide</a>
                        <a className="cursor-pointer hover:underline">report</a>
                        <a className="cursor-pointer hover:underline">delete</a>
                    </div>
                </div>
            </div>
        </>
    );
}

export const MemoizedRenderPosts = React.memo(RenderPosts);

// const CommentPropTypes = {
//     votes: PropTypes.shape({
//         upVotes: PropTypes.shape({
//             count: PropTypes.number,
//             users: PropTypes.array,
//         }),
//         downVotes: PropTypes.shape({
//             count: PropTypes.number,
//             users: PropTypes.array,
//         }),
//     }),
//     content: PropTypes.string,
//     createdAt: PropTypes.string,
//     author: PropTypes.string,
//     _id: PropTypes.string,
// };

const PostPropTypes = {
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string,
    author: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    sort: PropTypes.string,
    commentCount: PropTypes.number,
    // comments: PropTypes.arrayOf(PropTypes.shape(CommentPropTypes)),
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

RenderPosts.propTypes = {
    post: PropTypes.shape(PostPropTypes),
    userId: PropTypes.string,
};
