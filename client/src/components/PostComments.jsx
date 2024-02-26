import moment from "moment";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { refreshPosts } from "../store/atoms";
import { useSetRecoilState } from "recoil";
import {
	checkUpVotes,
	checkDownVotes,
	// commentVoteHandler,
	// replyVoteHandler,
} from "../util/VotingMethods";
// import { set } from "mongoose";

export function PostComments({ comment, userId }) {
	axios.defaults.withCredentials = true;

	const setRefreshPosts = useSetRecoilState(refreshPosts);
	const [commentVotes, setCommentVotes] = useState(0);
	const [upVoteUsers, setUpVoteUsers] = useState([]);
	const [downVoteUsers, setDownVoteUsers] = useState([]);
	const [doReply, setDoReply] = useState(false);
	const [replyContent, setReplyContent] = useState("");
	const [replies, setReplies] = useState([]);

	useEffect(() => {
		if (!comment) return;
		// console.log(comment);
		const upVotes = comment.votes.upVotes.count;
		const downVotes = comment.votes.downVotes.count;
		setCommentVotes(upVotes - downVotes);
		setUpVoteUsers(comment.votes.upVotes.users);
		setDownVoteUsers(comment.votes.downVotes.users);
		setReplies(comment.replies);

		// setUpVoteUsers();
	}, [comment]);

	const voteHandler = async (voteType) => {
		if (!userId) return;
		// console.log(downVoteUsers);
		// console.log(upVoteUsers);
		if (voteType === "up" && upVoteUsers.includes(userId)) return;
		if (voteType === "down" && downVoteUsers.includes(userId)) return;
		try {
			await axios.post(
				`http://localhost:3000/api/post/${voteType}voteComment/${comment._id}`
			);
			switch (voteType) {
				case "up":
					console.log(userId);
					console.log(upVoteUsers);
					downVoteUsers.includes(userId)
						? setCommentVotes((prev) => prev + 2)
						: setCommentVotes((prev) => prev + 1);
					setUpVoteUsers((prev) => [...prev, userId]);
					setDownVoteUsers((prev) => prev.filter((id) => id !== userId));
					break;
				case "down":
					console.log(userId);
					// console.log(downVoteUsers);
					upVoteUsers.includes(userId)
						? setCommentVotes((prev) => prev - 2)
						: setCommentVotes((prev) => prev - 1);
					setDownVoteUsers((prev) => {
						return [...prev, userId];
						// console.log([...prev, userId]);
					});
					setUpVoteUsers((prev) => {
						return prev.filter((id) => id != userId);
					});
					break;
			}
		} catch (error) {
			console.log(error);
		}
		// await commentVoteHandler(comment, voteType, userId);
		// setRefreshPosts((prev) => !prev);
	};

	const replyClickHandler = async (comment) => {
		if (!replyContent) return;
		try {
			const res = await axios.post(
				`http://localhost:3000/api/post/comments/reply/${comment._id}`,
				{
					content: replyContent,
					createdAt: Date.now().toString(),
				}
			);

			setReplies(res.data.replies);
			setRefreshPosts((prev) => !prev);
			setReplyContent("");
			setDoReply(false);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
			<div >
				<div >
					<button
						onClick={() => {
							// !checkUpVotes(comment, userId)
							voteHandler("up");
							// : null;
						}}
					>
						&#11014;️
					</button>
					<span>{commentVotes}</span>
					<button
						onClick={() => {
							// !checkDownVotes(comment, userId)
							voteHandler("down");
							// : null;
						}}
					>
						️&#11015;
					</button>
				</div>
				<div>
					<p>
						<b>{comment.author} </b>
						<span >
							{moment(parseInt(comment.createdAt)).fromNow()}{" "}
						</span>
					</p>

					<p>{comment.content}</p>
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
							<button onClick={() => replyClickHandler(comment)}>Reply</button>
						</div>
					)}
					{replies.length > 0
						? replies.map((reply) => (
								<ReplyComponent key={reply._id} reply={reply} userId={userId} />
						  ))
						: null}
					{/* <ReplyComponent comment={comment} userId={userId} /> */}
				</div>
			</div>
		</div>
	);
}

function ReplyComponent({ reply, userId }) {
	const [replyVotes, setReplyVotes] = useState(0);
	const [upVoteUsers, setUpVoteUsers] = useState([]);
	const [downVoteUsers, setDownVoteUsers] = useState([]);

	// const setRefreshPosts = useSetRecoilState(refreshPosts);

	useEffect(() => {
		if (!reply) return;
		// console.log(reply);
		const upVotes = reply.votes.upVotes.count;
		const downVotes = reply.votes.downVotes.count;
		setReplyVotes(upVotes - downVotes);
		setUpVoteUsers(reply.votes.upVotes.users);
		setDownVoteUsers(reply.votes.downVotes.users);

		// setUpVoteUsers();
	}, [reply]);

	const rVoteHandler = async (voteType) => {
		if (!userId) return;

		if (voteType === "up" && upVoteUsers.includes(userId)) return;
		if (voteType === "down" && downVoteUsers.includes(userId)) return;
		try {
			await axios.post(
				`http://localhost:3000/api/post/${voteType}voteReply/${reply._id}`
			);
			switch (voteType) {
				case "up":
					console.log(userId);
					console.log(upVoteUsers);
					downVoteUsers.includes(userId)
						? setReplyVotes((prev) => prev + 2)
						: setReplyVotes((prev) => prev + 1);
					setUpVoteUsers((prev) => [...prev, userId]);
					setDownVoteUsers((prev) => prev.filter((id) => id !== userId));
					break;
				case "down":
					console.log(userId);
					// console.log(downVoteUsers);
					upVoteUsers.includes(userId)
						? setReplyVotes((prev) => prev - 2)
						: setReplyVotes((prev) => prev - 1);
					setDownVoteUsers((prev) => {
						return [...prev, userId];
						// console.log([...prev, userId]);
					});
					setUpVoteUsers((prev) => {
						return prev.filter((id) => id != userId);
					});
					break;
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<div key={reply._id} >
				<div >
					<button
						onClick={() => {
							// !checkUpVotes(reply, userId)
							rVoteHandler("up");
							// : null;
						}}
					>
						&#11014;️
					</button>
					<span>{replyVotes}</span>
					<button
						onClick={() => {
							// !checkDownVotes(reply, userId)
							rVoteHandler("down");
							// : null;
						}}
					>
						️&#11015;
					</button>
				</div>
				<div>
					<p>
						<b>{reply.author} </b>
						<span >
							{moment(parseInt(reply.createdAt)).fromNow()}{" "}
						</span>
					</p>
					<p>{reply.content}</p>
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

// const PostPropTypes = {
//     _id: PropTypes.string.isRequired,
//     title: PropTypes.string.isRequired,
//     content: PropTypes.string,
//     author: PropTypes.string.isRequired,
//     createdAt: PropTypes.string.isRequired,
//     comments: PropTypes.arrayOf(PropTypes.shape(CommentPropTypes)),
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
// };

PostComments.propTypes = {
	comment: PropTypes.shape(CommentPropTypes),
	userId: PropTypes?.string,
};

ReplyComponent.propTypes = {
	reply: PropTypes.shape(CommentPropTypes),
	userId: PropTypes?.string,
};
