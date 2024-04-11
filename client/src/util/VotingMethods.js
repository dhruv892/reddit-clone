import axios from "axios";

axios.defaults.withCredentials = true;

export const checkUpVotes = (item, userId) => {
	if (item.votes.upVotes.users.includes(userId)) return "upvoted";
};

export const checkDownVotes = (item, userId) => {
	if (item.votes.downVotes.users.includes(userId)) return "downvoted";
};

export async function postVoteHandler(postId, voteType) {
	// if (!userId) return "notLoggedIn";
	// if (voteType === "up" && post.votes.upVotes.users.includes(userId))
	//     return "already upvoted";
	// if (voteType === "down" && post.votes.downVotes.users.includes(userId))
	//     return "already downvoted";

	try {
		await axios.post(
			`https://reddit-clone-dd-server-84d948f492df.herokuapp.com/api/post/${voteType}vote/${postId}`
		);
		return "done";
		// console.log(response);
	} catch (error) {
		console.log(error);
		return "error";
	}
}

export const commentVoteHandler = async (commentId, voteType) => {
	// if (!userId) return;
	// if (voteType === "up" && comment.votes.upVotes.users.includes(userId))
	//     return;
	// if (voteType === "down" && comment.votes.downVotes.users.includes(userId))
	//     return;
	try {
		await axios.post(
			`https://reddit-clone-dd-server-84d948f492df.herokuapp.com/api/post/${voteType}voteComment/${commentId}`
		);
		// console.log(response);
		// console.log(response.status);
		return "done";
	} catch (error) {
		console.log(error);
		return "error";
	}
};

export const replyVoteHandler = async (replyId, voteType) => {
	// if (!userId) return;
	// if (voteType === "up" && reply.votes.upVotes.users.includes(userId)) return;
	// if (voteType === "down" && reply.votes.downVotes.users.includes(userId))
	//     return;
	try {
		await axios.post(
			`https://reddit-clone-dd-server-84d948f492df.herokuapp.com/api/post/${voteType}voteReply/${replyId}`
		);
		return "done";
	} catch (error) {
		console.log(error);
		return "error";
	}
};
