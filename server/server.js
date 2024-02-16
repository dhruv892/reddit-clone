const express = require("express");
const cors = require("cors");
const postsController = require("./controller/postsController");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/posts", postsController.getPosts);
app.post("/createPost", postsController.createPost);
app.delete("/deletePost/:id", postsController.deletePost);

app.listen(3000);
