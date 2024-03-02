export function findComments(id, allComments, commentRefs) {
    const itemCommentRefs = commentRefs.filter((item) => item.pRef === id);
    if (itemCommentRefs.length === 0) return [];
    const comments = itemCommentRefs.map((ref) => {
        const comment = allComments.find((c) => c._id === ref.currRef);
        return comment;
    });
    return comments;
}
