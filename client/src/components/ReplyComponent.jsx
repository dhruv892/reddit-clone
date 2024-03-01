import moment from "moment";
import PropTypes from "prop-types";

import { VotingComponent } from "./VotingComponent";

export function ReplyComponent({ reply, userId }) {
    return (
        <div key={reply._id} className="flex gap-5 mt-4 pl-4">
            <div className="flex flex-col flex-initial align-center">
                <VotingComponent
                    votes={reply.votes}
                    userId={userId}
                    type={"reply"}
                    itemId={reply._id}
                />
            </div>
            <div>
                <p className="mb-1">
                    <span className="font-bold">{reply.author} </span>
                    <span className="ml-1 text-zinc-500">
                        {moment(parseInt(reply.createdAt)).fromNow()}{" "}
                    </span>
                </p>
                <p className="mb-1">{reply.content}</p>
            </div>
        </div>
    );
}
const CommentPropTypes = {
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
    content: PropTypes.string,
    createdAt: PropTypes.string,
    author: PropTypes.string,
    _id: PropTypes.string,
};

ReplyComponent.propTypes = {
    reply: PropTypes.shape(CommentPropTypes),
    userId: PropTypes?.string,
};
