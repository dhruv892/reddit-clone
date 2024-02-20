import { useParams } from "react-router";
import { postAtom } from "../store/atoms";
import { useRecoilValueLoadable } from "recoil";
import moment from "moment";
import "./PostPage.css";

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

	console.log(post.comments);

	return (
		<div>
			<p className="post-title">{post.title}</p>
			<pre>
				<p className="post-content">{post.content}</p>
			</pre>
			<p>
				Post submitted {moment(parseInt(post.createdAt)).fromNow()} by{" "}
				{post.author}
			</p>

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
