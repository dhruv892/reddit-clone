function votingMethod(item, req, res, voteType) {
    // const comment = await AllComments.findById(commentId);
    const userId = req.session.userId.toString();
    switch (voteType) {
        case "up":
            if (item.votes.upVotes.users.includes(userId)) {
                return res.status(409).json({ msg: "Already upvoted" });
            }
            if (item.votes.downVotes.users.includes(userId)) {
                item.votes.downVotes.count -= 1;
                item.votes.downVotes.users = item.votes.downVotes.users.filter(
                    (id) => id !== userId
                );
            }
            item.votes.upVotes.count += 1;
            item.votes.upVotes.users.push(userId);
            break;
        case "down":
            if (item.votes.downVotes.users.includes(userId.toString())) {
                return res.status(409).json({ msg: "Already downvoted" });
            }

            if (item.votes.upVotes.users.includes(userId.toString())) {
                item.votes.upVotes.count -= 1;
                item.votes.upVotes.users = item.votes.upVotes.users.filter(
                    (id) => id !== userId.toString()
                );
            }

            item.votes.downVotes.count += 1;
            item.votes.downVotes.users.push(userId.toString());
            break;
    }
}

module.exports = votingMethod;
