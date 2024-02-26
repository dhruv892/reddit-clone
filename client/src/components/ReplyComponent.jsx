import moment from "moment";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

export function ReplyComponent({ reply, userId }) {
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
		<div key={reply._id} className="flex gap-5 mt-4 pl-4">
			<div className="flex flex-col flex-initial align-center gap-1">
				<button
					onClick={() => {
						// !checkUpVotes(reply, userId)
						rVoteHandler("up");
						// : null;
					}}
				>
					&#11014;️
				</button>
				<span className="text-center">{replyVotes}</span>
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
				<p className="mb-1">
					<span className="font-bold">{reply.author} </span>
					<span className="ml-1 text-zinc-500">
						{moment(parseInt(reply.createdAt)).fromNow()}{" "}
					</span>
				</p>
				<p className="mb-1">{reply.content}</p>
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

ReplyComponent.propTypes = {
	reply: PropTypes.shape(CommentPropTypes),
	userId: PropTypes?.string,
};
