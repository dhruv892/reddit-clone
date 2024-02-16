import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

export function CreatePost({ handleRefreshPosts }) {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [author, setAuthor] = useState("");

	const onClickSubmitHandler = async () => {
		try {
			await axios.post(
				`http://localhost:3000/createPost`,
				{
					title: title,
					content: content,
					author: author,
					createdAt: Date.now().toString(),
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			handleRefreshPosts();
			setTitle("");
			setContent("");
			setAuthor("");
		} catch (error) {
			console.error("Error making POST request", error.message);
		}
	};
	return (
		<>
			<div>
				<input
					type="text"
					placeholder="Title"
					value={title}
					onChange={(e) => {
						setTitle(e.target.value);
					}}
				/>
				<input
					type="text"
					placeholder="content"
					value={content}
					onChange={(e) => {
						setContent(e.target.value);
					}}
				/>
				<input
					type="text"
					placeholder="author"
					value={author}
					onChange={(e) => {
						setAuthor(e.target.value);
					}}
				/>
				<button onClick={onClickSubmitHandler}>Submit</button>
			</div>
		</>
	);
}

CreatePost.propTypes = {
	handleRefreshPosts: PropTypes.func.isRequired,
};
