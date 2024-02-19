const express = require("express");
const zod = require("zod");
const { User } = require("../db");
const { authMiddleware } = require("../middleware");

require("dotenv").config();

const signUpBody = zod.object({
    username: zod.string(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string(),
});

const signInBody = zod.object({
    username: zod.string(),
    password: zod.string(),
});

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
});

const router = express.Router();

// Method: GET
// Route: /api/user/session
router.get("/session", authMiddleware, (req, res) => {
    res.status(200).json({
        message: "Session is active",
    });
});

// Method: POST
// Route: /api/user/signup
router.post("/signup", async (req, res) => {
    const { success } = signUpBody.safeParse(req.body);

    if (!success) {
        return res.status(411).json({
            message: "Already a user / Incorrect inputs",
        });
    }
    const existinUser = await User.findOne({
        username: req.body.username,
    });

    if (existinUser) {
        return res.status(411).json({
            message: "Already a user / Incorrect inputs",
        });
    }
    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    });
    const userId = user._id;
    req.session.userId = userId;

    res.status(200).json({
        message: "User created",
        // token
    });
});

// Method: POST
// Route: /api/user/signin
router.post("/signin", async (req, res) => {
    const { success } = signInBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs",
        });
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password,
    });
    if (user) {
        req.session.userId = user._id;
        console.log(req.session.userId);
        // req.session.authorized = true;
        return res.json({
            message: "Logged in",
            // token: token
        });
    }

    res.status(411).json({
        message: "Error while logging in",
    });
});

router.get("/signout", (req, res) => {
    req.session.destroy();
    res.json({
        message: "Logged out",
    });
});

// Method: PUT
// Route: /api/user
router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body);
    if (!success) {
        res.status(411).json({
            message: "Error while updating information",
        });
    }

    await User.updateOne(
        {
            _id: req.userId,
        },
        req.body
    );

    res.json({
        message: "Updated successfully",
    });
    return;
});

module.exports = router;
