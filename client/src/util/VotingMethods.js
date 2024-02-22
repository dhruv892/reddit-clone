import axios from "axios";

export const checkUpVotes = (item, userId) => {
	if (item.votes.upVotes.users.includes(userId)) return "upvoted";
};

export const checkDownVotes = (item, userId) => {
	if (item.votes.downVotes.users.includes(userId)) return "downvoted";
};

export const postVoteHandler = async (post, voteType, userId) => {
	if (!userId) return;
	if (voteType === "up" && post.votes.upVotes.users.includes(userId)) return;
	if (voteType === "down" && post.votes.downVotes.users.includes(userId))
		return;
	try {
		const response = await axios.post(
			`http://localhost:3000/api/post/${voteType}vote/${post._id}`
		);
		console.log(response);
	} catch (error) {
		console.log(error);
	}
};

export const commentVoteHandler = async (comment, voteType, userId) => {
	if (!userId) return;
	if (voteType === "up" && comment.votes.upVotes.users.includes(userId)) return;
	if (voteType === "down" && comment.votes.downVotes.users.includes(userId))
		return;
	try {
		const response = await axios.post(
			`http://localhost:3000/api/post/${voteType}voteComment/${comment._id}`
		);
		console.log(response);
	} catch (error) {
		console.log(error);
	}
};
