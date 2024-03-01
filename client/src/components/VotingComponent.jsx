import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
    postVoteHandler,
    commentVoteHandler,
    replyVoteHandler,
} from "../util/VotingMethods";
import { UpVoteLogo } from "./UpVote";
import { DownVoteLogo } from "./DownVote";

export function VotingComponent({ votes, userId, type, itemId }) {
    const [postVotes, setPostVotes] = useState(0);
    const [upVoteUsers, setUpVoteUsers] = useState([]);
    const [downVoteUsers, setDownVoteUsers] = useState([]);

    useEffect(() => {
        if (!votes) return;
        const upVotes = votes.upVotes.count;
        const downVotes = votes.downVotes.count;
        setPostVotes(upVotes - downVotes);
        setUpVoteUsers(votes.upVotes.users);
        setDownVoteUsers(votes.downVotes.users);
    }, [votes]);

    const voteHandler = async (voteType) => {
        if (!userId) return;
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
                    setDownVoteUsers((prev) =>
                        prev.filter((id) => id !== userId)
                    );
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
                    // !checkUpVotes(post, userId) &&
                    voteHandler("up");
                }}
            >
                <UpVoteLogo />
            </button>
            <span className="text-center">{postVotes}</span>
            <button
                className="p-0"
                onClick={() =>
                    // !checkDownVotes(post, userId) &&
                    voteHandler("down")
                }
            >
                <DownVoteLogo />
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
