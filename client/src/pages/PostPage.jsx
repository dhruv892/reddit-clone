import { useParams } from "react-router";
import { postAtom } from "../store/atoms";
import { useRecoilValueLoadable } from "recoil";
import moment from "moment";
import "./PostPage.css";
import AddComment from "../components/AddComment";
import { PostComments } from "../components/PostComments";
import axios from "axios";
import { refreshPosts } from "../store/atoms";
import { useRecoilState, useRecoilRefresher_UNSTABLE } from "recoil";
import { fetchPost } from "../store/atoms";
import { useEffect, useState } from "react";

export function PostPage() {
	const postLoadable = useRecoilValueLoadable(postAtom);
	const params = useParams();
	axios.defaults.withCredentials = true;
	const [refresh, setRefreshPosts] = useRecoilState(refreshPosts);
	const refreshPostsAtom = useRecoilRefresher_UNSTABLE(fetchPost);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userId, setUserId] = useState("");

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
				setUserId(response.data.userId);
			}
		} catch (error) {
			console.log("User is not authenticated");
		}
	};

	const checkUpVotes = () => {
		if (post.votes.upVotes.users.includes(userId)) return "upvoted";
	};
	const checkDownVotes = () => {
		if (post.votes.downVotes.users.includes(userId)) return "downvoted";
	};

	useEffect(() => {
		refreshPostsAtom();
	}, [refreshPostsAtom, refresh]);
	useEffect(() => {
		fetchSessionData();
	}, [isLoggedIn]);

	let post;
	switch (postLoadable.state) {
		case "hasValue":
			post = postLoadable.contents.find((p) => p._id === params.id);
			break;
		case "loading":
			return <h1>Loading...</h1>;
		case "hasError":
			throw postLoadable.contents;
	}

	const voteHandler = async (post, voteType) => {
		if (!userId) return;
		if (voteType === "up" && post.votes.upVotes.users.includes(userId)) return;
		if (voteType === "down" && post.votes.downVotes.users.includes(userId))
			return;
		try {
			const response = await axios.post(
				`http://localhost:3000/api/post/${voteType}vote/${post._id}`
			);
			setRefreshPosts((prev) => !prev);
			console.log(response);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
			<div className="postpage-wrapper">
				<div className="postpage-score">
					<button
						className={checkUpVotes()}
						onClick={() => voteHandler(post, "up")}
					>
						&#11014;️
					</button>
					<span>{post.votes.upVotes.count - post.votes.downVotes.count}</span>
					<button
						className={checkDownVotes()}
						onClick={() => voteHandler(post, "down")}
					>
						️&#11015;
					</button>
				</div>
				<p className="post-title">{post.title}</p>
			</div>
			<p className="post-">
				{post.author} {moment(parseInt(post.createdAt)).fromNow()}
			</p>
			<pre>
				<p className="post-content">{post.content}</p>
			</pre>

			<AddComment post={post} />
			<PostComments post={post} userId={userId} />
		</div>
	);
}
