import { useParams } from "react-router";
import { postAtom } from "../store/atoms";
import { useRecoilValue } from "recoil";
import { useEffect, useState, useRef } from "react";

export function PostPage() {
	const isRendered = useRef();
	const [post, setPost] = useState();
	const posts = useRecoilValue(postAtom);
	const params = useParams();

	useEffect(() => {
		isRendered.current = true;
		const p = posts.find((p) => p._id === params.id);
		console.log(p);
		setPost(p);
	}, [params.id, posts]);

	if (!isRendered.current) {
		return <h1>Loading...</h1>;
	}

	return (
		<div>
			<p>{post.title}</p>
			<p>{post.content}</p>
		</div>
	);
}
