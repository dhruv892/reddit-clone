import { useParams } from "react-router";
import moment from "moment";
import AddComment from "../components/AddComment";
import { PostComments } from "../components/PostComments";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { VotingComponent } from "../components/VotingComponent";
import { UserContext } from "../App";

export function PostPage() {
	const [post, setPost] = useState({});
	const params = useParams();
	const [count, setCount] = useState(0);
	axios.defaults.withCredentials = true;

	const { user } = useContext(UserContext);

	const [comments, setComments] = useState([]);
	const [page, setPage] = useState(1);
	const [isFetching, setIsFetching] = useState(false);

	useEffect(() => {
		(async function () {
			console.log(params.id);
			const newPost = await fetchPost(params.id);
			setPost(newPost);
			setCount(newPost.commentCount);
			// console.log(newPost);
		})();
	}, [params.id]);

	const isScrollingToBottom = () => {
		return (
			window.innerHeight + document.documentElement.scrollTop ===
			document.documentElement.offsetHeight
		);
	};

	useEffect(() => {
		(async function () {
			const newComments = await fetchComments(page, params.id);
			if (newComments && page === 1) {
				setComments(newComments);
				// setPostAtom(newPosts);
				return;
			}
			if (newComments && isFetching) {
				console.log(page);
				setComments((prev) => [...prev, ...newComments]);
				// setPostAtom((prev) => [...prev, ...newPosts]);
				setIsFetching((prev) => !prev);
			}
		})();
	}, [isFetching, page, params.id]);

	useEffect(() => {
		const handleScroll = () => {
			if (isScrollingToBottom() && !isFetching) {
				setIsFetching(true);
				setPage((prev) => prev + 1);
			}
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [isFetching, page]);

	const setCountHandler = () => {
		setCount((prev) => prev + 1);
	};

	const setCommentsHandler = (newComment) => {
		// const tempComment = {
		//     comments: newComment,
		//     replies: [],
		// };
		setComments((prev) => [newComment, ...prev]);
		setCountHandler();
	};

	if (Object.keys(post).length === 0)
		return <div className="text-gray-300">Loading...</div>;

	return (
		<div className="mt-5 p-5 max-w-4xl mx-auto text-wrap text-gray-300 bg-zinc-900 pr-6">
			{post && (
				<div className="flex">
					<div className="flex flex-col mr-2 flex-initial align-center gap-1">
						<VotingComponent
							votes={post.votes}
							userId={user && user.userId}
							type={"post"}
							itemId={post._id}
						/>
					</div>
					<div className="ml-4">
						<div>
							<p className="text-gray-400 text-sm">
								Posted by{" "}
								<span className="font-semibold text-gray-100">
									{post.author}
								</span>{" "}
								{moment(parseInt(post.createdAt)).fromNow()}
							</p>
							<p className="text-gray-200 text-3xl">{post.title}</p>
						</div>

						<div>
							<p className="text-justify mt-2 whitespace-pre-line">
								{post.content}
							</p>
						</div>
						<br />
						<div className="flex text-zinc-500">
							<div>{count} comments</div>
							<div className="ml-2 hover:bg-zinc-800">share</div>
							<div className="ml-2 hover:bg-zinc-800">save</div>
							<div className="ml-2 hover:bg-zinc-800">...</div>
						</div>
						<br />
					</div>
				</div>
			)}

			<div className="bg-zinc-900 rounded-lg">
				{post && (
					<AddComment
						// id={post._id.toString()}
						id={params.id}
						setCommentsHandler={setCommentsHandler}
						setDoReply={() => {}}
					/>
				)}
				<p className="text-2xl pl-4">Comments</p>
				<div className="divide-y divide-slate-50 py-2">
					{comments.length > 0 ? (
						comments.map((comment) => (
							<PostComments
								key={comment._id}
								comment={comment}
								setCountHandler={setCountHandler}

								// allComments={comments}
								// commentRefs={commentRefs}
							/>
						))
					) : (
						<p className="ml-4 mt-2 font-bold">No Comments yet</p>
					)}
				</div>
			</div>
			{/* <PostComments post={post} userId={userId} /> */}
		</div>
	);
}
async function fetchComments(page, id) {
	try {
		const res = await axios.get(
			`http://localhost:3000/api/post/comments/${id}/10/${page}`
		);

		const newcomments = await res.data.comments;
		console.log(newcomments);
		return newcomments;
	} catch (error) {
		console.error(error);
		return;
	}
}

async function fetchPost(id) {
	try {
		const res = await axios.get(`http://localhost:3000/api/post/getPost/${id}`);
		const newPost = await res.data.post;
		// const count = await res.data.count;
		return newPost;
	} catch (error) {
		console.error(error);
		return;
	}
}
