const zod = require('zod');
const createPostSchema = zod.object({
    title: zod.string().min(1),
    content: zod.string(),
    author: zod.string().min(1),
    createdAt: zod.string().min(1),
    comments: zod.array(zod.object({
        content: zod.string().min(1),
        createdAt: zod.string().min(1),
        author: zod.string().min(1),
        votes: zod.object({
            upVotes: zod.number(),
            downVotes: zod.number(),
        }),
    })),
    votes: zod.object({
        upVotes: zod.number(),
        downVotes: zod.number(),
    }),
});


module.exports = {
    createPostSchema: createPostSchema
}