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

const commentSchema = new mongoose.Schema({
    content: String,
    createdAt: String,
    author: String,
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
    replyingTo: { type: String, default: "" },
    // replies: [this],
});
commentSchema.add({
    replies: [commentSchema],
});

const postsSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: String,
    createdAt: String,
    comments: [commentSchema],
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

const Posts = mongoose.model("Posts", postsSchema);

module.exports = {
    Posts: Posts,
    User: User,
};
