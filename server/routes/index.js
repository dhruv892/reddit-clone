const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const userRouter = require("./user");
const postRouter = require("./post");

require("dotenv").config();

const router = express.Router();

mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("MongoDB connected"))
	.catch((err) => console.error("MongoDB connection error:", err));

console.log(
	"####################################################################"
);
console.log(process.env);
// Initialize session middleware
router.use(
	session({
		name: "sessionForRedditClone",
		secret: process.env.SESSION_SECRET,
		resave: false,
		sameSite: true,
		saveUninitialized: false,
		store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
		cookie: {
			secure: true,
			httpOnly: true,
			sameSite: "lax",
			maxAge: 1000 * 60 * 60 * 24,
		},
	})
);

router.use("/user", userRouter);
router.use("/post", postRouter);

module.exports = router;
