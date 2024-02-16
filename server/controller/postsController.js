const { Posts } = require("../db");
const { createPostSchema } = require("../type");

exports.getPosts = async (req, res) => {
	try {
		const posts = await Posts.find({});
		res.json({ posts: posts });
	} catch (err) {
		res.status(500).json({ msg: "Internal Server Error" });
	}
};

exports.createPost = async (req, res) => {
	const createPayload = req.body;
	const parsedPayload = await createPostSchema.safeParse(createPayload);
	console.log(parsedPayload);
	if (!parsedPayload.success) {
		return res
			.status(411)
			.json({ msg: "Payload is not valid", errors: parsedPayload.error });
	}

	try {
		Posts.create(parsedPayload.data);
		// await newPost.save();
		res.json({ msg: "Post created" });
	} catch (err) {
		res.status(500).json({ msg: "Internal Server Error" });
	}
};

exports.deletePost = async (req, res) => {
	const postId = req.params.id;
	try {
		await Posts.findByIdAndDelete(postId);
		res.json({ msg: "Post deleted" });
	} catch (err) {
		res.status(500).json({ msg: "Internal Server Error" });
	}
};
