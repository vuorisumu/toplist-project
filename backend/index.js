const express = require("express");
const database = require("./config/database");
const rankRoutes = require("./routes/rankingRoutes");
const templateRoutes = require("./routes/templateRoutes");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const dotenv = require("dotenv");
const categoryRoutes = require("./routes/categoryRoutes");
const fileUpload = require("express-fileupload");
const imageRoutes = require("./routes/imageRoutes");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

app.use(fileUpload());

app.use((req, res, next) => {
  if (req.url.endsWith(".js") || req.url.endsWith(".jsx")) {
    res.type("application/javascript");
  }

  res.header("Access-Control-Allow-Origin", "*");
  next();
});

database.init().then(() => {
  app.use(express.json());
  app.use("/api/toplists", rankRoutes);
  app.use("/api/templates", templateRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/images", imageRoutes);
  app.use(express.static("./frontend/dist"));

  app
    .listen(port, () => {
      console.log(`SERVER: listening on port ${port}`);
      console.log(process.env);
    })
    .on("error", (err) => {
      console.log(`SERVER: Error starting server: ${err}`);
      process.exit(1);
    });
});

process.on("SIGTERM", database.close); // Some other app requires shutdown.
process.on("SIGINT", database.close); // ctrl-c
