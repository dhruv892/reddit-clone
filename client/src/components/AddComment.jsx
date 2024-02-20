import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

export default function AddComment({ post }) {
	const [content, setContent] = useState("");
	const [isLoggedIn, setIsLoggedIn] = useState(false);

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

	const submitHandler = async () => {
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
		<div>
			<input
				type="text"
				value={content}
				onChange={(e) => setContent(e.target.value)}
				placeholder="content"
			/>
			<button onClick={submitHandler}>Add comment</button>
		</div>
	);
}
const CommentPropTypes = {
	votes: PropTypes.shape({
		upVotes: PropTypes.number,
		downVotes: PropTypes.number,
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
};
