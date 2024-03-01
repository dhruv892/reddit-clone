import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { refreshPosts } from "../store/atoms";
import { useSetRecoilState } from "recoil";

export default function AddComment({ post, setCommentsHandler }) {
	const [content, setContent] = useState("");
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const setRefreshPosts = useSetRecoilState(refreshPosts);

	const fetchSessionData = async () => {
		try {
			const response = await axios.get(
				"http://localhost:3000/api/user/session",
				{
					withCredentials: true,
				}
			);
			if (response.status === 200) {
				setIsLoggedIn(true);
			}
		} catch (error) {
			console.log("User is not authenticated");
		}
	};

	const submitHandler = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				`http://localhost:3000/api/post/addComment/${post._id}`,
				{
					content,
					createdAt: String(Date.now()),
				},
				{
					withCredentials: true,
				}
			);
			setRefreshPosts((prev) => !prev);
			setCommentsHandler(response.data.comments);
			console.log(response);
			setContent("");
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchSessionData();
	}, []);

	if (!isLoggedIn) {
		return <h4>Log in to comment</h4>;
	}

	return (
		<div className="bg-zinc-900 rounded-lg p-4 mt-5">
			<form className="flex gap-5" onSubmit={submitHandler}>
				<textarea
					className="bg-zinc-800 placeholder:text-zinc-500 flex-grow p-2 rounded-lg"
					type="text"
					value={content}
					onChange={(e) => setContent(e.target.value)}
					placeholder="Comment"
				/>
				<button
					className="py-2 px-4 flex-initial self-start rounded-lg bg-zinc-700"
					onClick={submitHandler}
				>
					Add comment
				</button>
			</form>
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

AddComment.propTypes = {
	post: PropTypes.shape(PostPropTypes),
	setCommentsHandler: PropTypes.func,
};
