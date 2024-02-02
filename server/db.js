const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const postsSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: String,
    createdAt: String,
    comments: [{
        content: String,
        createdAt: String,
        author: String,
        votes: {
            upVotes:{
                type: Number,
                default: 0
            },
            downVotes: {
                type: Number,
                default: 0
            }
        }
    }],
    upVotes:{
        type: Number,
        default: 0
    },
    downVotes: {
        type: Number,
        default: 0
    },
});

const Posts = mongoose.model('Posts', postsSchema);

module.exports = {
    Posts: Posts
};
