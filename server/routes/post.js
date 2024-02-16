const express = require("express");
const { Posts } = require("../db");
const zod = require("zod");
const { authMiddleware } = require("../middleware");

const createPostSchema = zod.object({
    title: zod.string().min(1),
    content: zod.string(),
    author: zod.string().min(1),
    createdAt: zod.string().min(1),
    comments: zod
        .array(
            zod.object({
                content: zod.string(),
                createdAt: zod.string(),
                author: zod.string(),
                votes: zod
                    .object({
                        upVotes: zod.number(),
                        downVotes: zod.number(),
                    })
                    .optional(),
            })
        )
        .optional(),
    votes: zod
        .object({
            upVotes: zod.number(),
            downVotes: zod.number(),
        })
        .optional(),
});

const addCommentSchema = zod.object({
    content: zod.string(),
    createdAt: zod.string(),
    author: zod.string(),
    votes: zod
        .object({
            upVotes: zod.number(),
            downVotes: zod.number(),
        })
        .optional(),
});

const router = express.Router();

// api/post/
router.get("/", async (req, res) => {
    try {
        const posts = await Posts.find({});
        res.json({ posts: posts });
    } catch (err) {
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

// api/post/createPost
router.post("/createPost", authMiddleware, async (req, res) => {
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
        res.json({ msg: "Post created" });
    } catch (err) {
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

router.post("/deletePost", async (req, res) => {
    const postId = req.params.id;
    try {
        await Posts.findByIdAndDelete(postId);
        res.json({ msg: "Post deleted" });
    } catch (err) {
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

router.post("/addComment", async (req, res) => {
    const createPayload = req.body;
    const parsedPayload = await this.addCommentSchema.safeParse(createPayload);

    if (!parsedPayload.success) {
        return res.status(411).json({
            msg: "Payload is not valid",
            errors: parsedPayload.error,
        });
    }

    const postId = req.params.id;
    const comment = parsedPayload.data;
    try {
        const post = await Posts.findById(postId);
        post.comments.push(comment);
        await post.save();
        res.json({ msg: "Comment added" });
    } catch (err) {
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

module.exports = router;
