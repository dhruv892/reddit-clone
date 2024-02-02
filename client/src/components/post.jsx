import { useState } from "react";
import moment from "moment";
import "./post.css";

export default function Post() {
	const [score, setScore] = useState(0);
	const post = {
		url: "https://github.com/DarshanVaishya/reddit-exercise/blob/master/src/components/styles/Post.css",
		title:
			"[Darren Dreger] Trade call between the Jets and Canadiens happening soon. Sean Monahan to the Jets for a 1st and a conditional pick. ",
		description:
			"So, a very close relative of mine is a wedding planner and has spilled some tea on celebs and their demands before agreeing to perform at weddings. I 100% believe him because he’s least interested in spreading Bollywood “gossip” but still, believe at your own risk.  RS comes with a huge list of demands, including but not limited to, private jet ofc. Some mandatory white powder and female company. Specific brands of liquor, a number of bodyguards. He once also denied to come for a wedding AFTER getting his payment for which he was “reprimanded” by a certain Dubai Sheikh and the money was returned.  Vishal Shekhar do a set of about 2-3 hours out of which they hardly perform for 30 minutes together. They take turns and Shekhar is the one who performs better and longer. They are just milking their brand name but apparently do not get along.  Badshah brings along fellow singers who sing for him. You may as well put on a Badshah playlist instead of calling him and paying him a bomb.  There are more stories which I can share based on the response to this post (i.e. how much trouble i get into or not lol) Anyone else has any such wedding tea to spill?",
		author: "Dhruv Barot",
		time: 1648166400000,
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
				<div className="post-wrapper">
					<a href={post.url} className="post-link">
						<span className="post-title">{post.title}</span>
					</a>
				</div>

				<div className="post-wrapper">
					<span className="post-description">{post.description}</span>
				</div>

				<div className="post-wrapper">
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
