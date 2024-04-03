const express = require("express");
const { User } = require("../db");
const { NewPosts } = require("../db");
const { AllComments } = require("../db");

const zod = require("zod");
const { authMiddleware } = require("../middleware");
const votingMethod = require("../util/votingMethod");

const router = express.Router();

////////////////// Get Content //////////////////////

// api/post/getPost/:id
router.get("/getPost/:id", async (req, res) => {
    const postId = req.params.id;
    try {
        const post = await NewPosts.findById(postId);
        // const ccounts = await CommentsCount.findOne({ pId: postId });
        // const count = ccounts.count;
        // console.log(post);
        res.json({ post: post });
    } catch (err) {
        res.status(500).json({
            msg: "Internal Server Error while getting post",
        });
    }
});

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

// api/post/:id/comments/:nComments/:currPage
router.get("/comments/:id/:nComments/:currPage", async (req, res) => {
    const postId = req.params.id;
    const nComments = parseInt(req.params.nComments);
    const currPage = parseInt(req.params.currPage);

    try {
        // prettier-ignore
        const findRComments = async (foundComments) => {
            if (foundComments.length === 0) return [];
          
            const commentPromises = foundComments.map(async (comment) => {
                // prettier-ignore
                const cReplies = await AllComments.find({pId: comment._id.toString()})
                    .sort({
                        "sort": -1,
                        "votes.upVotes.count": -1,
                        "votes.downVotes.count": 1,
                        "createdAt": -1,
                        "_id": 1,
                    })
                const replies = await findRComments(cReplies);
                const newComment = comment.toObject();
                newComment.replies = replies;
                return newComment;
            });
          
            const comments = await Promise.all(commentPromises);
            return comments;
        };
        // prettier-ignore
        const postIdComments = await AllComments.find({pId: postId})
            .sort({
                "sort": -1,
                "votes.upVotes.count": -1,
                "votes.downVotes.count": 1,
                "createdAt": -1,
                "_id": 1,
            })
            .skip(nComments * (currPage - 1))
            .limit(nComments);

        if (postIdComments.length === 0) {
            return res.json({ comments: [] });
        }

        const comments = await findRComments(postIdComments);

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
    // console.log("allComments");
    try {
        // console.log("before Comments");
        const comments = await AllComments.find({});
        // console.log("comments");
        const commentRefs = await CommentRef.find({});
        res.json({ comments: comments, commentRefs: commentRefs });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Internal Server Error while getting allcomments",
        });
    }
});

////////////////// Post Content //////////////////////

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
    // console.log(parsedPayload);
    if (!parsedPayload.success) {
        return res.status(411).json({
            msg: "Payload is not valid",
            errors: parsedPayload.error,
        });
    }

    try {
        const post = await NewPosts.create(parsedPayload.data);
        // await CommentsCount.create({ pId: post._id.toString(), count: 0 });
        res.json({ msg: "Post created", post: post });
    } catch (err) {
        res.status(500).json({
            msg: "Internal Server Error while in create post",
        });
    }
});

const addCommentSchema = zod.object({
    content: zod.string(),
    createdAt: zod.string(),
    author: zod.string(),
    sort: zod.string(),
    pId: zod.string(),
    votes: zod
        .object({
            upVotes: zod.number(),
            downVotes: zod.number(),
        })
        .optional(),
});
// api/post/addComment
router.post("/addComment/:id", authMiddleware, async (req, res) => {
    const pId = req.params.id;
    const user = await User.findById(req.session.userId);
    const forSorting = parseInt(
        Number(req.body.createdAt) / 1000 / 3600 / 24
    ).toString();
    const createPayload = {
        content: req.body.content,
        createdAt: req.body.createdAt,
        author: user.username,
        sort: forSorting,
        pId: pId,
    };
    const parsedPayload = addCommentSchema.safeParse(createPayload);

    if (!parsedPayload.success) {
        return res.status(411).json({
            msg: "Payload is not valid",
            errors: parsedPayload.error,
        });
    }
    const findTopParentId = async (id) => {
        const comment = await AllComments.findById(id);
        console.log(comment);
        console.log(id);
        // let

        if (comment && comment !== undefined && comment !== null) {
            return await findTopParentId(comment.pId);
        } else {
            return id;
        }
        // return id;
    };
    const comment = parsedPayload.data;
    try {
        const newComment = await AllComments.create(comment);

        const tempId = await findTopParentId(newComment._id.toString());
        console.log("tempId", tempId);
        // const commentsCount = await CommentsCount.findOne({ pId: tempId });
        const post = await NewPosts.findById(tempId);
        post.commentCount += 1;
        await post.save();
        // console.log(commentsCount);
        // const ccounts = await CommentsCount.findOne({ pId:
        // commentsCount.count += 1;
        // await commentsCount.save();

        res.json({
            msg: "Comment added",
            comment: newComment,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Internal Server Error add comment end point",
        });
    }
});

////////////////// Vote Content //////////////////////

// api/post/upvote/:id
router.post("/upvote/:id", authMiddleware, async (req, res) => {
    const postId = req.params.id;
    try {
        const post = await NewPosts.findById(postId);
        votingMethod(post, req, res, "up");

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

        votingMethod(post, req, res, "down");
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

        votingMethod(comment, req, res, "up");
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

        votingMethod(comment, req, res, "down");
        await comment.save();
        res.json({ msg: "Downvoted" });
    } catch (err) {
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

////////////////// Search Content //////////////////////

// api/post/bulk?filter=searchInput
router.get("/bulk", async (req, res) => {
    console.log("in search bulk");
    // console.log(req.query);
    const search = req.query.filter;
    const nposts = parseInt(req.query.nPosts) || 10;
    const currPage = parseInt(req.query.currPage) || 1;

    try {
        // prettier-ignore
        const posts = await NewPosts.find({
            $or: [
                {
                    title: {
                        $regex: search,
                    },
                },
                {
                    content: {
                        $regex: search,
                    },
                },
            ],
        })
            .sort({
                    
                "sort": -1,
                "votes.upVotes.count": -1,
                "votes.downVotes.count": 1,
                "createdAt": -1,
                "_id": 1
            })
            .skip(nposts * (currPage - 1))
            .limit(nposts);

        // console.log(posts);
        res.json({ posts: posts });
    } catch (err) {
        res.status(500).json({ msg: "Internal Server Error cd" });
    }
});

////////////////// Delete Content //////////////////////

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

module.exports = router;
