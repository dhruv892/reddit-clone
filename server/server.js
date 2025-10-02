const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "../.env") });
const express = require("express");
const cors = require("cors");
const app = express();

app.set("trust proxy", 1);
const rootRouter = require("./routes/index");

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.CLIENT_URL1,
      process.env.CLIENT_URL2,
      process.env.CLIENT_URL3,
      process.env.CLIENT_URL4,
      process.env.CLIENT_URL5,
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

app.use("/api", rootRouter);

// Serve the frontend for any other routes not handled by the API
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
  });
}
// Use the PORT environment variable provided by Heroku, or default to 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
