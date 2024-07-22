import axios from "axios";

axios.defaults.withCredentials = true;

export const checkUpVotes = (item, userId) => {
    if (item.votes.upVotes.users.includes(userId)) return "upvoted";
};

export const checkDownVotes = (item, userId) => {
    if (item.votes.downVotes.users.includes(userId)) return "downvoted";
};

export async function postVoteHandler(postId, voteType) {
    try {
        await axios.post(
            `https://red-srv.darshanv.dev/api/post/${voteType}vote/${postId}`
        );
        return "done";
        // console.log(response);
    } catch (error) {
        console.log(error);
        return "error";
    }
}

export const commentVoteHandler = async (commentId, voteType) => {
    try {
        await axios.post(
            `https://red-srv.darshanv.dev/api/post/${voteType}voteComment/${commentId}`
        );
        return "done";
    } catch (error) {
        console.log(error);
        return "error";
    }
};

export const replyVoteHandler = async (replyId, voteType) => {
    try {
        await axios.post(
            `https://red-srv.darshanv.dev/api/post/${voteType}voteReply/${replyId}`
        );
        return "done";
    } catch (error) {
        console.log(error);
        return "error";
    }
};
