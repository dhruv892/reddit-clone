const mongoose = require("mongoose");
require("dotenv").config();

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Database connected");
    })
    .catch((err) => {
        console.log("Database connection failed");
        console.log(err);
    });

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: [true, "Username already exists"],
        lowercase: true,
        minLength: 3,
        maxLength: 50,
    },
    password: {
        type: String,
        required: true,
        // minLength: 6,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50,
    },
});

const User = new mongoose.model("User", userSchema);

const postsSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: String,
    createdAt: String,
    comments: [
        {
            content: String,
            createdAt: String,
            author: String,
            votes: {
                upVotes: {
                    type: Number,
                    default: 0,
                },
                downVotes: {
                    type: Number,
                    default: 0,
                },
            },
        },
    ],
    upVotes: {
        type: Number,
        default: 0,
    },
    downVotes: {
        type: Number,
        default: 0,
    },
});

const Posts = mongoose.model("Posts", postsSchema);

module.exports = {
    Posts: Posts,
    User: User,
};
