import { useParams } from "react-router";
import { postAtom } from "../store/atoms";
import { useRecoilValueLoadable } from "recoil";
import moment from "moment";

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

	return (
		<div>
			<p>{post.title}</p>
			<pre>
				<p>{post.content}</p>
			</pre>
			<p>
				Submitted {moment(parseInt(post.createdAt)).fromNow()} by {post.author}
			</p>

			<div>
				<p>Comments</p>
				{post.comments.map((comment) => comment)}
			</div>
		</div>
	);
}
