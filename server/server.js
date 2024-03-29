const express = require("express");
const cors = require("cors");
// const postsController = require("./controller/postsController");

const app = express();
const rootRouter = require("./routes/index");

const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://another-origin.com",
        ];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api", rootRouter);

app.listen(3000);
