const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const userRouter = require("./user");
const postRouter = require("./post");

const router = express.Router();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Initialize session middleware
router.use(
  session({
    name: "sessionForRedditClone",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // MS
      httpOnly: true, // prevent XSS attacks cross-site scripting attacks
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // CSRF attacks cross-site request forgery attacks
      secure: process.env.NODE_ENV !== "development",
    },
  })
);

router.use("/user", userRouter);
router.use("/post", postRouter);

module.exports = router;
