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
			<div>
				<div>
					<button onClick={() => setScore(score + 1)}>&#11014;️</button>
					<span>{post.votes.upVotes.count - post.votes.downVotes.count}</span>
					<button onClick={() => setScore(score - 1)}>️&#11015;</button>
				</div>

				<div>
					{post.thumbnail !== "self" && <img src={post.thumbnail} alt="" />}
				</div>

				<div>
					<div>
						<a onClick={() => navigate(`/post/${post._id}`)}>
							<span>{post.title}</span>
						</a>
					</div>

					<div>
						<span>{post.content}</span>
					</div>

					<div>
						Submitted {moment(parseInt(post.createdAt)).fromNow()} by{" "}
						{post.author}
					</div>

					<div>
						<a href={post.url}>
							{post.comments ? `${post.comments.length} comments` : "comment"}
						</a>
						<a onClick={shareHandler}>
							share
						</a>
						<a>save</a>
						<a>hide</a>
						<a>report</a>
						<a>delete</a>
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