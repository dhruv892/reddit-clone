export const checkUpVotes = (item, userId) => {
	console.log(item, userId);
	if (item.votes.upVotes.users.includes(userId)) return "upvoted";
};

export const checkDownVotes = (item, userId) => {
	console.log(item, userId);
	if (item.votes.downVotes.users.includes(userId)) return "downvoted";
};
