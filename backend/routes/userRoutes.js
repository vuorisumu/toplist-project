const oracledb = require("oracledb");
const database = require("../config/database");
const { filteredUserQuery } = require("../filteredQueries");
const { userSchema } = require("../schemas");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const verifyToken = require("../config/verifyToken");
const userRouter = express.Router();

const databaseError = { msg: "Error retrieving data from database" };
const notfoundError = { msg: "Data not found" };
console.log("User router accessed");

/**
 * Gets users from database
 * If a query is found, construct an SQL query with given filters
 */
userRouter.get("/", async (req, res) => {
  try {
    let results;
    if (Object.keys(req.query).length !== 0) {
      // query has filters
      const { filteredQuery, queryParams } = await filteredUserQuery(req.query);

      results = await database.query(filteredQuery, queryParams);
    } else {
      // query does not have filters
      const query = `SELECT user_name FROM users`;
      results = await database.query(query);
    }

    res.status(200).json(results);
  } catch (err) {
    res.status(500).send(databaseError);
  }
});

/**
 * Gets a user with given ID from the database
 */
userRouter.get("/:id([0-9]+)", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await database.query(
      `SELECT user_name, user_id FROM users WHERE user_id = :id`,
      { id: id }
    );

    // id not found
    if (result.length === 0) {
      return res.status(404).send(notfoundError);
    }

    // all good
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send(databaseError);
  }
});

/**
 * Validates data and adds a new user to database
 * Responds with a newly added user ID on successful insert
 */
userRouter.post("/", async (req, res) => {
  try {
    // validate data
    const { error } = userSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ message: error.details });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const values = {
      user_name: req.body.user_name,
      email: req.body.email,
      password: hashedPassword,
      user_id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
    };

    const query =
      "INSERT INTO users (user_name, email, password) VALUES (:user_name, :email, :password) RETURNING user_id INTO :user_id";

    const result = await database.query(query, values);

    // successful insert
    res.status(201).json({
      msg: "Added new user",
      userId: result.outBinds.user_id[0],
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

userRouter.post("/login/", async (req, res) => {
  try {
    const { user, password } = req.body;
    const userData = await database.query(
      `SELECT * FROM users WHERE user_name = :1 OR email = :2`,
      [user, user]
    );

    const simplifiedData = userData.rows.map((row) => {
      const dataRow = {};
      userData.metaData.forEach((column, index) => {
        const columnName = column.name.toLowerCase();
        dataRow[columnName] = row[index];
      });
      return dataRow;
    });

    if (simplifiedData.length > 0) {
      const storedPassword = simplifiedData[0].password;
      bcrypt.compare(password, storedPassword, (bcryptErr, bcryptRes) => {
        if (bcryptErr) {
          throw bcryptErr;
        }

        if (bcryptRes) {
          const isAdmin =
            simplifiedData[0].user_name === process.env.ADMIN_USER;
          const token = jwt.sign(
            { id: simplifiedData[0].user_id, isAdmin: isAdmin },
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRES_IN }
          );
          res.status(200).json({
            token,
            user_id: simplifiedData[0].user_id,
            user_name: simplifiedData[0].user_name,
            email: simplifiedData[0].email,
          });
        } else {
          res.status(401).json({ error: "Invalid password" });
        }
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    res.status(500).send(databaseError);
  }
});

userRouter.get("/auth/", verifyToken, async (req, res) => {
  res.status(200).json({ id: req.user_id, admin: req.isAdmin });
});

module.exports = userRouter;
