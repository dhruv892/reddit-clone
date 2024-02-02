import { useState } from "react";
import moment from "moment";
import "./post.css";

export default function Post() {
	const [score, setScore] = useState(0);
	const post = {
		url: "https://github.com/DarshanVaishya/reddit-exercise/blob/master/src/components/styles/Post.css",
		title: "Hello world",
		author: "Dhruv Barot",
		time: 1706905390338,
		num_comments: 5,
	};

	return (
		<div className="post-container">
			<div className="post-score">
				<button onClick={() => setScore(score + 1)}>&#11014;️</button>
				<span>{score}</span>
				<button onClick={() => setScore(score - 1)}>️&#11015;</button>
			</div>

			<div className="post-image">
				{post.thumbnail !== "self" && <img src={post.thumbnail} alt="" />}
			</div>

			<div className="post-details">
				<div className="wrapper">
					<a href={post.url} className="post-link">
						<span className="post-title">{post.title}</span>
					</a>
				</div>

				<div className="wrapper">
					Submitted {moment(post.time).fromNow()} by {post.author}
				</div>

				<div className="post-links-wrapper">
					<a className="post-link" href={post.url}>
						{post.num_comments ? `${post.num_comments} comments` : "comment"}
					</a>
					<a className="post-link-grey" href="/#">
						share
					</a>
					<a className="post-link-grey" href="/#">
						save
					</a>
					<a className="post-link-grey" href="/#">
						hide
					</a>
					<a className="post-link-grey" href="/#">
						report
					</a>
				</div>
			</div>
		</div>
	);
}
