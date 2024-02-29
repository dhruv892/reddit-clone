import { useState } from "react";
import moment from "moment";
import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { refreshPosts } from "../store/atoms";
import { toast } from "react-toastify";

// export default function Posts() {
//     const postsLoadable = useRecoilValueLoadable(postAtom);

//     switch (postsLoadable.state) {
//         case "hasValue":

//             return postsLoadable.contents.map((post) => (
//                 <RenderPost key={post._id} post={post} />
//             ));
//         case "loading":
//             return <div>Loading...</div>;
//         case "hasError":
//             return <div>Error: {postsLoadable.contents.message}</div>;
//         default:
//             return null;
//     }
// }

export function RenderPosts({ post }) {
	const [score, setScore] = useState(0);
	const navigate = useNavigate();
	const setRefreshPosts = useSetRecoilState(refreshPosts);

	const deleteHandler = async () => {
		try {
			await axios.delete(
				`http://localhost:3000/api/post/deletePost/${post._id}`
			);
			setRefreshPosts((prev) => !prev);
		} catch (error) {
			console.log(error);
		}
	};

	const shareHandler = () => {
		navigator.clipboard.writeText(`http://localhost:5173/post/${post._id}`);
		toast.info("Post link copied to clipboard!");
	};

	return (
		<>
			<div className="bg-zinc-900 mb-4 p-4 rounded-lg flex gap-1">
				<div>
					<div className="flex flex-col mr-2 flex-initial align-center">
						<button onClick={() => setScore(score + 1)}>&#11014;️</button>
						<span className="text-center">
							{post.votes.upVotes.count - post.votes.downVotes.count}
						</span>
						<button onClick={() => setScore(score - 1)}>️&#11015;</button>
					</div>
				</div>

				<div>
					<div>
						{post.thumbnail !== "self" && <img src={post.thumbnail} alt="" />}
					</div>
					<div>
						<div>
							<a
								className="text-xl font-bold cursor-pointer hover:underline"
								onClick={() => navigate(`/post/${post._id}`)}
							>
								<span>{post.title}</span>
							</a>
						</div>
					</div>
					<div>
						<span className="text-justify line-clamp-2 mt-2">
							{post.content}
						</span>
					</div>
					<div className="mt-2 text-gray-300 text-sm">
						Posted {moment(parseInt(post.createdAt)).fromNow()} by{" "}
						{post.author}
					</div>
					<div className="mt-2 text-gray-300 flex space-x-2 text-sm ">
						<a href={post.url}>
							{post.comments ? `${post.comments.length} comments` : "comment"}
						</a>
						<a
							className="cursor-pointer hover:underline"
							onClick={shareHandler}
						>
							share
						</a>
						<a className="cursor-pointer hover:underline">save</a>
						<a className="cursor-pointer hover:underline">hide</a>
						<a className="cursor-pointer hover:underline">report</a>
						<a className="cursor-pointer hover:underline">delete</a>
					</div>
				</div>
			</div>
		</>
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

const PostPropTypes = {
	_id: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	content: PropTypes.string,
	author: PropTypes.string.isRequired,
	createdAt: PropTypes.string.isRequired,
	comments: PropTypes.arrayOf(PropTypes.shape(CommentPropTypes)),
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
};

// Posts.propTypes = {
//     userId: PropTypes.string,
// };

RenderPosts.propTypes = {
	post: PropTypes.shape(PostPropTypes),
};
