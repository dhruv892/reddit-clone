import moment from "moment";
import PropTypes from "prop-types";
import "./PostComments.css";
import axios from "axios";

export function PostComments({ post }) {
	const voteHandler = async (comment, voteType) => {
		// TODO: Write logic to check if the post is already up/down voted
		switch (voteType) {
			case "up":
				try {
					const response = await axios.post(
						`http://localhost:3000/api/post/upvoteComment/${comment._id}`
					);
					console.log(response);
				} catch (error) {
					console.log(error);
				}
				break;
			case "down":
				try {
					const response = await axios.post(
						`http://localhost:3000/api/post/downvoteComment/${comment._id}`
					);
					console.log(response);
				} catch (error) {
					console.log(error);
				}
				break;
		}
	};

	return (
		<div>
			<h4>Comments</h4>
			{post.comments.map((comment) => (
				<div key={comment._id} className="post-comment-wrapper">
					<div className="post-comment-score">
						<button onClick={() => voteHandler(comment, "up")}>
							&#11014;️
						</button>
						<span>{post.votes.upVotes.count - post.votes.downVotes.count}</span>
						<button onClick={() => voteHandler(comment, "down")}>
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
					</div>
				</div>
			))}
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
};
