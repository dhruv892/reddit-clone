const zod = require('zod');
const createPostSchema = zod.object({
    title: zod.string().min(1),
    content: zod.string(),
    author: zod.string().min(1),
    createdAt: zod.string().min(1),
    comments: zod.array(zod.object({
        content: zod.string(),
        createdAt: zod.string(),
        author: zod.string(),
        votes: zod.object({
            upVotes: zod.number(),
            downVotes: zod.number(),
        }).optional(),
    })).optional(),
    votes: zod.object({
        upVotes: zod.number(),
        downVotes: zod.number(),
    }).optional(),
});

module.exports = {
    createPostSchema: createPostSchema
}