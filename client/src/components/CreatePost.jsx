import { useState } from "react";
import axios from "axios";
// import { useSetRecoilState } from "recoil";
// import { refreshPosts } from "../store/atoms";
import PropTypes from "prop-types";

export function CreatePost({ setPostsHandler }) {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	// const setRefreshPosts = useSetRecoilState(refreshPosts);

	const onClickSubmitHandler = async () => {
		try {
			const res = await axios.post(
				`http://localhost:3000/api/post/createPost`,
				{
					title: title,
					content: content,
					createdAt: Date.now().toString(),
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
					withCredentials: true,
				}
			);
			console.log(res.data.post);
			setPostsHandler(res.data.post);
			// setRefreshPosts((prev) => !prev);
			setTitle("");
			setContent("");
		} catch (error) {
			console.log("Error making POST request", error);
		}
	};
	return (
		<>
			<div>
				<input
					className="bg-zinc-800 placeholder:text-zinc-500 p-2 rounded-lg"
					type="text"
					placeholder="Title"
					value={title}
					onChange={(e) => {
						setTitle(e.target.value);
					}}
				/>

				<textarea
					className="bg-zinc-800 placeholder:text-zinc-500 p-2 rounded-lg"
					type="text"
					placeholder="content"
					value={content}
					onChange={(e) => {
						setContent(e.target.value);
					}}
				/>

				<button
					className="p-3 flex-initial rounded-lg bg-zinc-700"
					onClick={onClickSubmitHandler}
				>
					Submit
				</button>
			</div>
		</>
	);
}

CreatePost.propTypes = {
	setPostsHandler: PropTypes.func,
};
