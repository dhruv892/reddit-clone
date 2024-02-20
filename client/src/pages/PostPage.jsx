import { useParams } from "react-router";
import { postAtom } from "../store/atoms";
import { useRecoilValueLoadable } from "recoil";
import moment from "moment";
import "./PostPage.css";
import AddComment from "../components/AddComment";

export function PostPage() {
	const postLoadable = useRecoilValueLoadable(postAtom);
	const params = useParams();

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
	console.log(post);

	return (
		<div>
			<p className="post-title">{post.title}</p>
			<p className="post-">
				{post.author} {moment(parseInt(post.createdAt)).fromNow()}
			</p>
			<pre>
				<p className="post-content">{post.content}</p>
			</pre>

			<AddComment post={post} />

			<div>
				<p>Comments</p>
				{post.comments.map((comment) => (
					<div key={comment._id} className="post-comment">
						<p>
							{comment.author}{" "}
							<span className="post-comment-time">
								{moment(parseInt(comment.createdAt)).fromNow()}{" "}
							</span>
						</p>
						<p>{comment.content}</p>
						<span></span>
					</div>
				))}
			</div>
		</div>
	);
}
