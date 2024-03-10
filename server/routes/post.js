const express = require("express");
const { User } = require("../db");
const { NewPosts } = require("../db");
const { AllComments } = require("../db");
const { CommentRef } = require("../db");
const zod = require("zod");
const { authMiddleware } = require("../middleware");
const findComments = require("../util/findComments");

const newCreatePostSchema = zod.object({
    title: zod.string().min(1),
    content: zod.string(),
    author: zod.string().min(1),
    createdAt: zod.string().min(1),
    sort: zod.string().min(1),
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
router.get("/:nPosts/:currPage", async (req, res) => {
    try {
        // const posts = await Posts.find({});
        const nposts = parseInt(req.params.nPosts);
        const currPage = parseInt(req.params.currPage);
        // prettier-ignore
        const posts = await NewPosts.find({})
            .sort({
                
                "sort": -1,
                "votes.upVotes.count": -1,
                "votes.downVotes.count": 1,
                "createdAt": -1,
                "_id": 1
            })
            .skip(nposts * (currPage - 1))
            .limit(nposts);
        res.json({ posts: posts });
    } catch (err) {
        res.status(500).json({ msg: "Internal Server Error in getting posts" });
    }
});

// api/post/:id
router.get("/getPost/:id", async (req, res) => {
    const postId = req.params.id;
    try {
        const post = await NewPosts.findById(postId);
        res.json({ post: post });
    } catch (err) {
        res.status(500).json({
            msg: "Internal Server Error while getting post",
        });
    }
});

// api/post/:id/comments/:nComments/:currPage
router.get("/:id/comments/:nComments/:currPage", async (req, res) => {
    const postId = req.params.id;
    const nComments = parseInt(req.params.nComments);
    const currPage = parseInt(req.params.currPage);
    try {
        const allComments = await AllComments.find({})
            .sort({
                sort: -1,
                "votes.upVotes.count": -1,
                "votes.downVotes.count": 1,
                createdAt: -1,
                _id: 1,
            })
            .skip(nComments * (currPage - 1))
            .limit(nComments);
        const commentRefs = await CommentRef.find({});
        console.log("before");
        const comments = findComments(postId, allComments, commentRefs);
        console.log("after");

        res.json({ comments: comments });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Internal Server Error while getting comments",
        });
    }
});

// api/post/allComments
router.get("/allComments", async (req, res) => {
    console.log("allComments");
    try {
        console.log("before Comments");
        const comments = await AllComments.find({});
        console.log("comments");
        const commentRefs = await CommentRef.find({});
        res.json({ comments: comments, commentRefs: commentRefs });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Internal Server Error while getting allcomments",
        });
    }
});

// api/post/createPost
router.post("/createPost", authMiddleware, async (req, res) => {
    // id = new ObjectId(req.session.userId);
    const user = await User.findById(req.session.userId);
    const forSorting = parseInt(
        Number(req.body.createdAt) / 1000 / 3600 / 24
    ).toString();
    // console.log(user, user.username);
    const createPayload = {
        title: req.body.title,
        content: req.body.content,
        author: user.username,
        createdAt: req.body.createdAt,
        sort: forSorting,
    };
    //const parsedPayload = await createPostSchema.safeParse(createPayload);
    const parsedPayload = newCreatePostSchema.safeParse(createPayload);
    console.log(parsedPayload);
    if (!parsedPayload.success) {
        return res.status(411).json({
            msg: "Payload is not valid",
            errors: parsedPayload.error,
        });
    }

    try {
        // const post = await Posts.create(parsedPayload.data);
        // const posts = await Posts.find({});
        const post = await NewPosts.create(parsedPayload.data);
        // const posts = await NewPosts.find({});
        res.json({ msg: "Post created", post: post });
    } catch (err) {
        res.status(500).json({
            msg: "Internal Server Error while in create post",
        });
    }
});

// api/post/deletePost
router.delete("/deletePost/:id", async (req, res) => {
    const postId = req.params.id;
    try {
        await NewPosts.findByIdAndDelete(postId);
        res.json({ msg: "Post deleted" });
    } catch (err) {
        res.status(500).json({
            msg: "Internal Server Error delete post endpoint",
        });
    }
});

const addCommentSchema = zod.object({
    content: zod.string(),
    createdAt: zod.string(),
    author: zod.string(),
    sort: zod.string(),
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
    const forSorting = parseInt(
        Number(req.body.createdAt) / 1000 / 3600 / 24
    ).toString();
    const createPayload = {
        content: req.body.content,
        createdAt: req.body.createdAt,
        author: user.username,
        sort: forSorting,
    };
    const parsedPayload = addCommentSchema.safeParse(createPayload);

    if (!parsedPayload.success) {
        return res.status(411).json({
            msg: "Payload is not valid",
            errors: parsedPayload.error,
        });
    }

    const pId = req.params.id;
    const comment = parsedPayload.data;
    try {
        // const post = await Posts.findById(postId);
        // post.comments.push(comment);
        // await post.save();
        // console.log(post.comments);
        const newComment = await AllComments.create(comment);
        // const commentRef = await CommentRef.create({ pRef: pId, cRefs: newComment._id });
        const parentItem = await CommentRef.findOne({
            currRef: pId.toString(),
        });
        console.log(parentItem);
        if (parentItem) {
            console.log("Parent item found");
            parentItem.cRefs.push(newComment._id.toString());
            console.log(parentItem);
            await parentItem.save();
        }
        const newCommentRef = await CommentRef.create({
            pRef: pId,
            currRef: newComment._id.toString(),
        });

        // await parentItem.save();
        res.json({
            msg: "Comment added",
            comment: newComment,
            commentRef: newCommentRef,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Internal Server Error add comment end point",
        });
    }
});

// api/post/upvote/:id
router.post("/upvote/:id", authMiddleware, async (req, res) => {
    const postId = req.params.id;
    try {
        const post = await NewPosts.findById(postId);
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
        const post = await NewPosts.findById(postId);
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
        res.status(500).json({ msg: "Internal Server Error pd" });
    }
});

// api/post/upvoteComment/:id
router.post("/upvoteComment/:id", authMiddleware, async (req, res) => {
    const commentId = req.params.id;
    try {
        const comment = await AllComments.findById(commentId);
        // const comment = post.comments.id(commentId);

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
        await comment.save();
        res.json({ msg: "Upvoted" });
    } catch (err) {
        res.status(500).json({ msg: "Internal Server Error cu" });
    }
});

// api/post/downvoteComment/:id
router.post("/downvoteComment/:id", authMiddleware, async (req, res) => {
    const commentId = req.params.id;
    try {
        const comment = await AllComments.findById(commentId);

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
        await comment.save();
        res.json({ msg: "Downvoted" });
    } catch (err) {
        res.status(500).json({ msg: "Internal Server Error cd" });
    }
});

module.exports = router;
