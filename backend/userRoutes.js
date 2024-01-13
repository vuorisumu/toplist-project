const database = require("./database");
const schemas = require("./schemas");
const express = require("express");
const userRouter = express.Router();

const databaseError = { msg: "Error retrieving data from database" };
const notfoundError = { msg: "Data not found" };
console.log("User router accessed");

// get all users
userRouter.get("/", async (req, res) => {
  try {
    let results;
    if (Object.keys(req.query).length !== 0) {
      // query has filters
      const { filteredQuery, queryParams } = await database.filteredUserQuery(
        req.query
      );

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

// get user by id
userRouter.get("/:id([0-9]+)", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await database.query(
      `SELECT * FROM users WHERE user_id = ?`,
      id
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

// add new user
userRouter.post("/", async (req, res) => {
  try {
    // validate data
    const { error } = schemas.userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    const values = [];
    values.push(req.body.user_name);

    const query = "INSERT INTO users (user_name) VALUES (?)";

    const result = await database.query(query, values);

    // successful insert
    res.status(201).json({
      msg: "Added new user",
      id: result.insertId,
    });
  } catch (err) {
    res.status(500).send(databaseError);
  }
});

module.exports = userRouter;
