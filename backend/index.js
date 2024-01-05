const express = require("express");
const routes = require("./routes");
const { pool } = require("./database");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(express.json());
app.use("/api", routes);

app.use(express.static("./frontend"));

const server = app
  .listen(port, () => {
    console.log(`SERVER: listening on port ${port}`);
    console.log(process.env);
  })
  .on("error", (err) => {
    console.log(`SERVER: Error starting server: ${err}`);
    process.exit(1);
  });

const gracefulShutdown = () => {
  console.log("Starting graceful shutdown...");
  server.close(() => {
    console.log("Server closed");

    pool.end(() => {
      console.log("MySQL server closed");
      process.exit(0);
    });
  });

  console.log("Shutdown complete");
};

process.on("SIGTERM", gracefulShutdown); // Some other app requirest shutdown.
process.on("SIGINT", gracefulShutdown); // ctrl-c
