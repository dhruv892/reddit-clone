const express = require("express");
const cors = require("cors");
// const postsController = require("./controller/postsController");

const app = express();
const rootRouter = require("./routes/index");

app.use(cors());
app.use(express.json());
app.use("/api", rootRouter);

// app.get("/posts", postsController.getPosts);
// app.post("/createPost", postsController.createPost);
// app.delete("/deletePost/:id", postsController.deletePost);

// app.get("/addComment/:id", postsController.addComment);

app.listen(3000);
