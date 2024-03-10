function findComments(id, allComments, commentRefs) {
    const itemCommentRefs = commentRefs.filter((item) => item.pRef === id);

    if (itemCommentRefs.length === 0) return [];

    const comments = itemCommentRefs.map((ref) => {
        const comment = { comments: {}, replies: [] };
        comment.comments = allComments.find(
            (c) => c._id.toString() === ref.currRef
        );
        comment.replies.push(
            ...findComments(ref.currRef, allComments, commentRefs)
        );
        // console.log("comment", comment);

        return comment;
    });
    return comments;
}

module.exports = findComments;
