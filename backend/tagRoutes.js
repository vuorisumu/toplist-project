const database = require("./database");
const express = require("express");
const tagRouter = express.Router();

const databaseError = { msg: "Error retrieving data from database" };
const notfoundError = { msg: "Data not found" };
console.log("Tag router accessed");

// get all tags
tagRouter.get("/", async (req, res) => {
  try {
    let results;
    if (Object.keys(req.query).length !== 0) {
      // query has filters
      const { filteredQuery, queryParams } = await database.filteredTagQuery(
        req.query
      );
      results = await database.query(filteredQuery, queryParams);
    } else {
      // query does not have filters
      const query = `SELECT * FROM tags`;
      results = await database.query(query);
    }

    res.status(200).json(results);
  } catch (err) {
    res.status(500).send(databaseError);
  }
});

// add new tag
tagRouter.post("/", async (req, res) => {
  try {
    console.log("Adding new tag");
    // validate data
    const { error } = database.tagSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    const values = [];
    values.push(req.body.name);

    const query = "INSERT INTO tags (name) VALUES (?)";

    const result = await database.query(query, values);

    // successful insert
    res.status(201).json({
      msg: "Added new tag",
      id: result.insertId,
    });
  } catch (err) {
    res.status(500).send(databaseError);
  }
});

module.exports = tagRouter;
