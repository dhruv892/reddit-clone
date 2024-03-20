import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import {
	postVoteHandler,
	commentVoteHandler,
	replyVoteHandler,
} from "../util/VotingMethods";
import { UpVoteLogo } from "./UpVote";
import { DownVoteLogo } from "./DownVote";
import { toast } from "react-toastify";
import { UserContext } from "../App";

export function VotingComponent({ votes, type, itemId }) {
	const [postVotes, setPostVotes] = useState(0);
	const [upVoteUsers, setUpVoteUsers] = useState([]);
	const [downVoteUsers, setDownVoteUsers] = useState([]);
	const [isUpvoted, setIsUpvoted] = useState(false);
	const [isDownVoted, setIsDownVoted] = useState(false);
	const { userId } = useContext(UserContext);

	useEffect(() => {
		if (!votes) {
			setIsDownVoted(false);
			setIsUpvoted(false);
		}
		const upVotes = votes.upVotes.count;
		const downVotes = votes.downVotes.count;
		setPostVotes(upVotes - downVotes);
		setUpVoteUsers(votes.upVotes.users);
		setDownVoteUsers(votes.downVotes.users);
		setIsUpvoted(votes.upVotes.users.includes(userId));
		setIsDownVoted(votes.downVotes.users.includes(userId));
	}, [userId, votes]);

	const voteHandler = async (voteType) => {
		if (!userId || userId === "") {
			setIsDownVoted(false);
			setIsUpvoted(false);
			toast.error("You need to be logged in to vote");
			return;
		}
		if (voteType === "up" && upVoteUsers.includes(userId)) return;
		if (voteType === "down" && downVoteUsers.includes(userId)) return;
		let req;
		if (type === "post") {
			req = await postVoteHandler(itemId, voteType);
		}
		if (type === "comment") {
			req = await commentVoteHandler(itemId, voteType);
		}
		if (type === "reply") {
			req = await replyVoteHandler(itemId, voteType);
		}
		// console.log(req);
		if (req === "done") {
			//     console.log("done");
			switch (voteType) {
				case "up":
					downVoteUsers.includes(userId)
						? setPostVotes((prev) => prev + 2)
						: setPostVotes((prev) => prev + 1);
					setUpVoteUsers((prev) => [...prev, userId]);
					setDownVoteUsers((prev) => prev.filter((id) => id !== userId));
					setIsUpvoted(true);
					setIsDownVoted(false);
					break;
				case "down":
					console.log(userId);
					// console.log(downVoteUsers);
					upVoteUsers.includes(userId)
						? setPostVotes((prev) => prev - 2)
						: setPostVotes((prev) => prev - 1);
					setDownVoteUsers((prev) => {
						return [...prev, userId];
						// console.log([...prev, userId]);
					});
					setUpVoteUsers((prev) => {
						return prev.filter((id) => id != userId);
					});
					setIsUpvoted(false);
					setIsDownVoted(true);
					// console.log(downVoteUsers);
					// post.votes.downVotes.users.push(userId);
					break;
			}
		} else {
			console.log(req);
		}
	};

	return (
		<>
			<button
				className="p-0"
				onClick={() => {
					voteHandler("up");
				}}
			>
				<UpVoteLogo voted={isUpvoted} />
			</button>
			<span className="text-center">{postVotes}</span>
			<button className="p-0" onClick={() => voteHandler("down")}>
				<DownVoteLogo voted={isDownVoted} />
			</button>
		</>
	);
}

VotingComponent.propTypes = {
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
	userId: PropTypes.string,
	type: PropTypes.string,
	itemId: PropTypes.string,
};
