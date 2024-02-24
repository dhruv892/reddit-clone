const express = require("express");
const { Posts } = require("../db");
const { User } = require("../db");
const zod = require("zod");
const { authMiddleware } = require("../middleware");
// const { ObjectId } = require("mongoose").Types;

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
                        upVotes: zod
                            .object({
                                count: zod.number().optional(),
                                users: zod.array(zod.string()).optional(),
                            })
                            .optional(),
                        downVotes: zod
                            .object({
                                count: zod.number(),
                                users: zod.array(zod.string()),
                            })
                            .optional(),
                    })
                    .optional(),
            })
        )
        .optional(),
    votes: zod
        .object({
            upVotes: zod
                .object({
                    count: zod.number().optional(),
                    users: zod.array(zod.string()).optional(),
                })
                .optional(),
            downVotes: zod
                .object({
                    count: zod.number(),
                    users: zod.array(zod.string()),
                })
                .optional(),
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
    // id = new ObjectId(req.session.userId);
    const user = await User.findById(req.session.userId);
    console.log(user, user.username);
    const createPayload = {
        title: req.body.title,
        content: req.body.content,
        author: user.username,
        createdAt: req.body.createdAt,
    };
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

// api/post/deletePost
router.delete("/deletePost/:id", async (req, res) => {
    const postId = req.params.id;
    try {
        await Posts.findByIdAndDelete(postId);
        res.json({ msg: "Post deleted" });
    } catch (err) {
        res.status(500).json({ msg: "Internal Server Error" });
    }
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
// api/post/addComment
router.post("/addComment/:id", authMiddleware, async (req, res) => {
    const user = await User.findById(req.session.userId);
    const createPayload = {
        content: req.body.content,
        createdAt: req.body.createdAt,
        author: user.username,
    };
    const parsedPayload = await addCommentSchema.safeParse(createPayload);

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
        console.log(post.comments);
        res.json({ msg: "Comment added" });
    } catch (err) {
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

// api/post/upvote/:id
router.post("/upvote/:id", authMiddleware, async (req, res) => {
    const postId = req.params.id;
    try {
        const post = await Posts.findById(postId);
        if (post.votes.upVotes.users.includes(req.session.userId.toString())) {
            return res.status(409).json({ msg: "Already upvoted" });
        }
        if (
            post.votes.downVotes.users.includes(req.session.userId.toString())
        ) {
            post.votes.downVotes.count -= 1;
            post.votes.downVotes.users = post.votes.downVotes.users.filter(
                (id) => id !== req.session.userId.toString()
            );
        }
        post.votes.upVotes.count += 1;
        post.votes.upVotes.users.push(req.session.userId.toString());
        await post.save();
        res.json({ msg: "Upvoted" });
    } catch (err) {
        res.status(500).json({ msg: "Internal Server Error", err });
    }
});

// api/post/downvote/:id
router.post("/downvote/:id", authMiddleware, async (req, res) => {
    const postId = req.params.id;
    try {
        const post = await Posts.findById(postId);
        if (
            post.votes.downVotes.users.includes(req.session.userId.toString())
        ) {
            return res.status(409).json({ msg: "Already downvoted" });
        }
        if (post.votes.upVotes.users.includes(req.session.userId.toString())) {
            post.votes.upVotes.count -= 1;
            post.votes.upVotes.users = post.votes.upVotes.users.filter(
                (id) => id !== req.session.userId.toString()
            );
        }
        post.votes.downVotes.count += 1;
        post.votes.downVotes.users.push(req.session.userId.toString());
        await post.save();
        res.json({ msg: "Downvoted" });
    } catch (err) {
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

// api/post/upvoteComment/:id
router.post("/upvoteComment/:id", authMiddleware, async (req, res) => {
    const commentId = req.params.id;
    try {
        const post = await Posts.findOne({ "comments._id": commentId });
        const comment = post.comments.id(commentId);

        if (
            comment.votes.upVotes.users.includes(req.session.userId.toString())
        ) {
            return res.status(409).json({ msg: "Already upvoted" });
        }
        if (
            comment.votes.downVotes.users.includes(
                req.session.userId.toString()
            )
        ) {
            comment.votes.downVotes.count -= 1;
            comment.votes.downVotes.users =
                comment.votes.downVotes.users.filter(
                    (id) => id !== req.session.userId.toString()
                );
        }

        comment.votes.upVotes.count += 1;
        comment.votes.upVotes.users.push(req.session.userId.toString());
        await post.save();
        res.json({ msg: "Upvoted" });
    } catch (err) {
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

// api/post/downvoteComment/:id
router.post("/downvoteComment/:id", authMiddleware, async (req, res) => {
    const commentId = req.params.id;
    try {
        const post = await Posts.findOne({ "comments._id": commentId });
        const comment = post.comments.id(commentId);

        if (
            comment.votes.downVotes.users.includes(
                req.session.userId.toString()
            )
        ) {
            return res.status(409).json({ msg: "Already downvoted" });
        }

        if (
            comment.votes.upVotes.users.includes(req.session.userId.toString())
        ) {
            comment.votes.upVotes.count -= 1;
            comment.votes.upVotes.users = comment.votes.upVotes.users.filter(
                (id) => id !== req.session.userId.toString()
            );
        }

        comment.votes.downVotes.count += 1;
        comment.votes.downVotes.users.push(req.session.userId.toString());
        await post.save();
        res.json({ msg: "Downvoted" });
    } catch (err) {
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

// api/post/upvoteReply/:id
router.post("/upvoteReply/:id", authMiddleware, async (req, res) => {
    const replyId = req.params.id;
    try {
        const post = await Posts.findOne({ "comments.replies._id": replyId });
        const comment = post.comments.find((comment) =>
            comment.replies.id(replyId)
        );
        const reply = comment.replies.id(replyId);

        if (
            reply.votes.downVotes.users.includes(req.session.userId.toString())
        ) {
            reply.votes.downVotes.count -= 1;
            reply.votes.downVotes.users = reply.votes.downVotes.users.filter(
                (id) => id !== req.session.userId.toString()
            );
        }

        reply.votes.upVotes.count += 1;
        reply.votes.upVotes.users.push(req.session.userId.toString());
        await post.save();
        res.json({ msg: "Upvoted" });
    } catch (err) {
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

// api/post/downvoteReply/:id
router.post("/downvoteReply/:id", authMiddleware, async (req, res) => {
    const replyId = req.params.id;
    try {
        const post = await Posts.findOne({ "comments.replies._id": replyId });
        const comment = post.comments.find((comment) =>
            comment.replies.id(replyId)
        );
        const reply = comment.replies.id(replyId);

        if (reply.votes.upVotes.users.includes(req.session.userId.toString())) {
            reply.votes.upVotes.count -= 1;
            reply.votes.upVotes.users = reply.votes.upVotes.users.filter(
                (id) => id !== req.session.userId.toString()
            );
        }

        reply.votes.downVotes.count += 1;
        reply.votes.downVotes.users.push(req.session.userId.toString());
        await post.save();
        res.json({ msg: "Upvoted" });
    } catch (err) {
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

// function findCommentById(comments, id) {
//     for (const comment of comments) {
//         if (comment._id.toString() === id.toString()) {
//             return comment;
//         }
//         if (comment.replies.length > 0) {
//             const found = findCommentById(comment.replies, id);
//             if (found) {
//                 return found;
//             }
//         }
//     }
//     return null;
// }

const replySchema = zod.object({
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

// api/post/comments/reply/:id
router.post("/comments/reply/:id", authMiddleware, async (req, res) => {
    const user = await User.findById(req.session.userId);
    const createPayload = {
        content: req.body.content,
        createdAt: req.body.createdAt,
        author: user.username,
    };
    const parsedPayload = await replySchema.safeParse(createPayload);

    if (!parsedPayload.success) {
        return res.status(411).json({
            msg: "Payload is not valid",
            errors: parsedPayload.error,
        });
    }
    const commentId = req.params.id;
    try {
        const post = await Posts.findOne({ "comments._id": commentId });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const comment = post.comments.id(commentId);
        // const comment = findCommentById(post.comments, commentId);
        // if (!comment) {
        //     return res.status(404).json({ message: "Comment not found" });
        // }
        // console.log("Comment found", comment);
        // const comment = post.comments.id(commentId);
        const reply = {
            content: req.body.content,
            createdAt: req.body.createdAt,
            author: req.session.userId,
            replyingTo: commentId,
        };

        comment.replies.push(reply);
        await post.save();
        res.json({ msg: "Replied" });
    } catch (err) {
        res.status(500).json({ msg: "Internal Server Error", error: err });
    }
});

module.exports = router;
