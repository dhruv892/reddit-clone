import "./App.css";
import Post from "./components/post";

// id,
// title,
// description,
// author,
// time,
// comments;
// votes;

function App() {
	const posts = [
		{
			id: 1,
			title:
				"[Darren Dreger] Trade call between the Jets and Canadiens happening soon. Sean Monahan to the Jets for a 1st and a conditional pick. ",
			description:
				"So, a very close relative of mine is a wedding planner and has spilled some tea on celebs and their demands before agreeing to perform at weddings. I 100% believe him because he’s least interested in spreading Bollywood “gossip” but still, believe at your own risk.  RS comes with a huge list of demands, including but not limited to, private jet ofc. Some mandatory white powder and female company. Specific brands of liquor, a number of bodyguards. He once also denied to come for a wedding AFTER getting his payment for which he was “reprimanded” by a certain Dubai Sheikh and the money was returned.  Vishal Shekhar do a set of about 2-3 hours out of which they hardly perform for 30 minutes together. They take turns and Shekhar is the one who performs better and longer. They are just milking their brand name but apparently do not get along.  Badshah brings along fellow singers who sing for him. You may as well put on a Badshah playlist instead of calling him and paying him a bomb.  There are more stories which I can share based on the response to this post (i.e. how much trouble i get into or not lol) Anyone else has any such wedding tea to spill?",
			author: "DhruvBarot123",
			time: Date.now(),
			comments: 12,
			votes: 78,
		},
		{
			id: 2,
			title: "How to create a reddit clone? Any help is greatly appreciated",
			description:
				"As the title suggests, need help with choosing a tech stack and tips.",
			author: "DarshanChutiyo",
			time: Date.now(),
			comments: 3,
			votes: -21,
		},
		{
			id: 3,
			title: "How to learn DSA effectively",
			description: "",
			author: "LalitRathod",
			time: Date.now(),
			comments: 8,
			votes: 34,
		},
	];

	return (
		<>
			{posts.map((post) => (
				<Post post={post} />
			))}
		</>
	);
}

export default App;
