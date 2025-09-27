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
import { UserContext } from "../contexts/SessionContext";

export function VotingComponent({ votes, type, itemId }) {
  const [postVotes, setPostVotes] = useState(0);
  const [upVoteUsers, setUpVoteUsers] = useState([]);
  const [downVoteUsers, setDownVoteUsers] = useState([]);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isDownVoted, setIsDownVoted] = useState(false);
  const { user } = useContext(UserContext);

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
    setIsUpvoted(votes.upVotes.users.includes(user && user.userId));
    setIsDownVoted(votes.downVotes.users.includes(user && user.userId));
  }, [user, votes]);

  const voteHandler = async (voteType) => {
    if (!user || !user.userId || user.userId === "") {
      setIsDownVoted(false);
      setIsUpvoted(false);
      toast.error("You need to be logged in to vote");
      return;
    }
    if (voteType === "up" && upVoteUsers.includes(user.userId)) return;
    if (voteType === "down" && downVoteUsers.includes(user.userId)) return;
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
    if (req === "done") {
      switch (voteType) {
        case "up":
          downVoteUsers.includes(user.userId)
            ? setPostVotes((prev) => prev + 2)
            : setPostVotes((prev) => prev + 1);
          setUpVoteUsers((prev) => [...prev, user.userId]);
          setDownVoteUsers((prev) => prev.filter((id) => id !== user.userId));
          setIsUpvoted(true);
          setIsDownVoted(false);
          break;
        case "down":
          // console.log(downVoteUsers);
          upVoteUsers.includes(user.userId)
            ? setPostVotes((prev) => prev - 2)
            : setPostVotes((prev) => prev - 1);
          setDownVoteUsers((prev) => {
            return [...prev, user.userId];
          });
          setUpVoteUsers((prev) => {
            return prev.filter((id) => id != user.userId);
          });
          setIsUpvoted(false);
          setIsDownVoted(true);
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
        onClick={(e) => {
          e.stopPropagation();
          voteHandler("up");
        }}
      >
        <UpVoteLogo voted={isUpvoted} />
      </button>
      <span className="text-center">{postVotes}</span>
      <button
        className="p-0"
        onClick={(e) => {
          e.stopPropagation();
          voteHandler("down");
        }}
      >
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
