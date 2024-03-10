export const votingMethod = async (item, voteType, userId) => {
    // const comment = await AllComments.findById(commentId);
    switch (voteType) {
        case "up":
            if (item.votes.upVotes.users.includes(userId.toString())) {
                return "Already upvoted";
            }

            if (item.votes.downVotes.users.includes(userId.toString())) {
                item.votes.downVotes.count -= 1;
                item.votes.downVotes.users = item.votes.downVotes.users.filter(
                    (id) => id !== userId.toString()
                );
            }

            item.votes.upVotes.count += 1;
            item.votes.upVotes.users.push(userId.toString());
            return "done";
        case "down":
            if (item.votes.downVotes.users.includes(userId.toString())) {
                return "Already downvoted";
            }

            if (item.votes.upVotes.users.includes(userId.toString())) {
                item.votes.upVotes.count -= 1;
                item.votes.upVotes.users = item.votes.upVotes.users.filter(
                    (id) => id !== userId.toString()
                );
            }

            item.votes.downVotes.count += 1;
            item.votes.downVotes.users.push(userId.toString());
            return "done";
    }
};
