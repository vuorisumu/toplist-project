const express = require("express");
const rankRoutes = require("./rankingRoutes");
const roleRoutes = require("./roleRoutes");
const tagRoutes = require("./tagRoutes");
const templateRoutes = require("./templateRoutes");
const userRoutes = require("./userRoutes");
const { pool, oraclePool } = require("./database");
const cors = require("cors");
const dotenv = require("dotenv");
const testRoutes = require("./dbTest");
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

app.use((req, res, next) => {
  if (req.url.endsWith(".js") || req.url.endsWith(".jsx")) {
    res.type("application/javascript");
  }

  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(express.json());
app.use("/api/rankings", rankRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/login", roleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/test", testRoutes);

app.use(express.static("./frontend/dist"));

/**
 * Server instance listening on specified port
 */
const server = app
  .listen(port, () => {
    console.log(`SERVER: listening on port ${port}`);
    console.log(process.env);
  })
  .on("error", (err) => {
    console.log(`SERVER: Error starting server: ${err}`);
    process.exit(1);
  });

/**
 * Handles graceful shutdown of the connection
 */
const gracefulShutdown = () => {
  console.log("Starting graceful shutdown...");
  oraclePool.close()
  server.close(() => {
    console.log("Server closed");

    pool.end(() => {
      console.log("MySQL server closed");
      process.exit(0);
    });
  });

  console.log("Shutdown complete");
};

process.on("SIGTERM", gracefulShutdown); // Some other app requires shutdown.
process.on("SIGINT", gracefulShutdown); // ctrl-c
