const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.static("./frontend"));

const port = process.env.PORT || 3000;

const pool = mysql.createPool({
  connectionLimit: 10,
  connectTimeout: 10000,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

app.get("/api/templates", (req, res) => {
  pool.query("SELECT * FROM templates", (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send(err.message);
    } else {
      res.json(rows);
    }
  });
});

const server = app
  .listen(port, () => {
    console.log(`SERVER: listening on port ${port}.`);
  })
  .on("error", (err) => {
    console.error("SERVER: Error starting server: ", err);
    process.exit(1);
  });

module.exports = server;
