import { useParams } from "react-router";
import { postAtom, refreshPosts, fetchPost } from "../store/atoms";
import moment from "moment";
import "./PostPage.css";
import AddComment from "../components/AddComment";
import { PostComments } from "../components/PostComments";
import axios from "axios";
import {
	useRecoilState,
	useRecoilRefresher_UNSTABLE,
	useRecoilValueLoadable,
} from "recoil";
import { useEffect, useState } from "react";
import {
	checkDownVotes,
	checkUpVotes,
	postVoteHandler,
} from "../util/VotingMethods";

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
		await postVoteHandler(post, voteType, userId);
		setRefreshPosts((prev) => !prev);
	};

	return (
		<div>
			<div className="postpage-wrapper">
				<div className="postpage-score">
					<button
						className={checkUpVotes(post, userId)}
						onClick={() => voteHandler(post, "up")}
					>
						&#11014;️
					</button>
					<span>{post.votes.upVotes.count - post.votes.downVotes.count}</span>
					<button
						className={checkDownVotes(post, userId)}
						onClick={() => voteHandler(post, "down")}
					>
						️&#11015;
					</button>
				</div>
				<div className="postpage-title-wrapper">
					<p className="post-title">{post.title}</p>
					<p className="post-">
						{post.author} {moment(parseInt(post.createdAt)).fromNow()}
					</p>
				</div>
			</div>
			<pre>
				<p className="post-content">{post.content}</p>
			</pre>

			<AddComment post={post} />
			<PostComments post={post} userId={userId} />
		</div>
	);
}
