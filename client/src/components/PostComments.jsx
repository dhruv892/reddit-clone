import moment from "moment";
import PropTypes from "prop-types";
import "./PostComments.css";
import axios from "axios";
import { refreshPosts } from "../store/atoms";
import { useSetRecoilState } from "recoil";
import {
	checkUpVotes,
	checkDownVotes,
	commentVoteHandler,
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
								voteHandler(comment, "up");
							}}
						>
							&#11014;️
						</button>
						<span>
							{comment.votes.upVotes.count - comment.votes.downVotes.count}
						</span>
						<button
							className={checkDownVotes(comment, userId)}
							onClick={() => voteHandler(comment, "down")}
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
	userId: PropTypes?.string,
};
