import moment from "moment";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { refreshPosts } from "../store/atoms";
import { useSetRecoilState } from "recoil";
import { ReplyComponent } from "./ReplyComponent";
import { UpVoteLogo } from "./UpVote";
import { DownVoteLogo } from "./DownVote";

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
		<div className="flex gap-5 m-2 p-2">
			<div className="flex flex-col flex-initial align-center">
				<button
					className="p-1"
					onClick={() => {
						// !checkUpVotes(comment, userId)
						voteHandler("up");
						// : null;
					}}
				>
					<UpVoteLogo />
				</button>
				<span className="text-center">{commentVotes}</span>
				<button
					className="p-1"
					onClick={() => {
						// !checkDownVotes(comment, userId)
						voteHandler("down");
						// : null;
					}}
				>
					<DownVoteLogo />
				</button>
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
				<div className="border-l border-l-zinc-50">
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
};
