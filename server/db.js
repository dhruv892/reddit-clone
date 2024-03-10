const mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcrypt");

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
        minLength: [6, "Password must be at least 6 characters long"],
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

userSchema.pre("save", async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified("password")) return next();
    try {
        // Hash the password with cost of 12
        this.password = await bcrypt.hash(this.password, 12);
    } catch (err) {
        console.log(err);
    }
    next();
});

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = new mongoose.model("User", userSchema);

const commentRefSchema = new mongoose.Schema({
    pRef: String,
    currRef: String,
    cRefs: [String],
});
const allCommentsSchema = new mongoose.Schema({
    content: String,
    createdAt: String,
    author: String,
    sort: String,
    votes: {
        upVotes: {
            count: { type: Number, default: 0 },
            users: { type: [String], default: [] },
        },
        downVotes: {
            count: { type: Number, default: 0 },
            users: { type: [String], default: [] },
        },
    },
});

const newPostsSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: String,
    createdAt: String,
    sort: String,
    votes: {
        upVotes: {
            count: { type: Number, default: 0 },
            users: { type: [String], default: [] },
        },
        downVotes: {
            count: { type: Number, default: 0 },
            users: { type: [String], default: [] },
        },
    },
});

const AllComments = mongoose.model("AllComments", allCommentsSchema);
const CommentRef = mongoose.model("CommentRef", commentRefSchema);
const NewPosts = mongoose.model("NewPosts", newPostsSchema);

module.exports = {
    User: User,
    CommentRef: CommentRef,
    AllComments: AllComments,
    NewPosts: NewPosts,
};
