const oracledb = require("oracledb");
const database = require("../config/database");
const { filteredUserQuery } = require("../filteredQueries");
const { userSchema } = require("../schemas");
const bcrypt = require("bcrypt");
const express = require("express");
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
      const query = `SELECT * FROM users`;
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
      `SELECT * FROM users WHERE user_id = :id`,
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
    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
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

module.exports = userRouter;
