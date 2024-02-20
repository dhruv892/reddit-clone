import { useState } from "react";
import moment from "moment";
import "./posts.css";
import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState, useRecoilValueLoadable } from "recoil";
import { postAtom } from "../store/atoms";
import { refreshPosts } from "../store/atoms";

export default function Posts() {
	const postsLoadable = useRecoilValueLoadable(postAtom);

	switch (postsLoadable.state) {
		case "hasValue":
			return postsLoadable.contents.map((post) => (
				<RenderPost key={post._id} post={post} />
			));
		case "loading":
			return <div>Loading...</div>;
		case "hasError":
			return <div>Error: {postsLoadable.contents.message}</div>;
		default:
			return null;
	}
}

function RenderPost({ post }) {
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
		<>
			<div className="posts-container">
				<div className="posts-score">
					<button onClick={() => setScore(score + 1)}>&#11014;️</button>
					<span>{post.votes.upVotes.count - post.votes.downVotes.count}</span>
					<button onClick={() => setScore(score - 1)}>️&#11015;</button>
				</div>

				<div className="posts-image">
					{post.thumbnail !== "self" && <img src={post.thumbnail} alt="" />}
				</div>

				<div className="posts-details">
					<div className="posts-wrapper">
						<a
							onClick={() => navigate(`/post/${post._id}`)}
							className="posts-link"
						>
							<span className="posts-title">{post.title}</span>
						</a>
					</div>

					<div className="posts-wrapper">
						<span className="posts-description">{post.content}</span>
					</div>

					<div className="posts-wrapper">
						Submitted {moment(parseInt(post.createdAt)).fromNow()} by{" "}
						{post.author}
					</div>

					<div className="posts-links-wrapper">
						<a className="posts-link" href={post.url}>
							{post.comments ? `${post.comments.length} comments` : "comment"}
						</a>
						<a className="posts-link-grey">share</a>
						<a className="posts-link-grey">save</a>
						<a className="posts-link-grey">hide</a>
						<a className="posts-link-grey">report</a>
						<a className="posts-link-grey" onClick={deleteHandler}>
							delete
						</a>
					</div>
				</div>
			</div>
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

// Post.propTypes = {
//     post: PropTypes.shape(PostPropTypes),
// };

RenderPost.propTypes = {
	post: PropTypes.shape(PostPropTypes),
};
