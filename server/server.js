require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

app.set("trust proxy", 1);
const rootRouter = require("./routes/index");

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
      process.env.PRODUCTION_URL,
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
app.use;
const path = require("path");
const __dirname = path.resolve();

app.use("/api", rootRouter);

// Serve the frontend for any other routes not handled by the API
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/dist/index.html"));
  });
}
// Use the PORT environment variable provided by Heroku, or default to 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
