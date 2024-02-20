import { useParams } from "react-router";
import { postAtom } from "../store/atoms";
import { useRecoilValueLoadable } from "recoil";
import moment from "moment";
import "./PostPage.css";
import AddComment from "../components/AddComment";
import { PostComments } from "../components/PostComments";

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
			<PostComments post={post} />
		</div>
	);
}
