const OracleDB = require("oracledb");
const database = require("../config/database");
const { filteredTagQuery } = require("../filteredQueries");
const { tagSchema } = require("../schemas");
const express = require("express");
const tagRouter = express.Router();

const databaseError = { msg: "Error retrieving data from database" };
const notfoundError = { msg: "Data not found" };
console.log("Tag router accessed");

/**
 * Gets tags from database
 * If a query is found, construct an SQL query with given filters
 */
tagRouter.get("/", async (req, res) => {
  try {
    let results;
    if (Object.keys(req.query).length !== 0) {
      // query has filters
      const { filteredQuery, queryParams } = await filteredTagQuery(req.query);
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

/**
 * Gets a tag from database with given ID
 */
tagRouter.get("/:id([0-9]+)", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await database.query(`SELECT * FROM tags WHERE id = :id`, {
      id: id,
    });

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
 * Adds a new tag to database
 * Responds with newly added tag ID on successful insert
 */
tagRouter.post("/", async (req, res) => {
  try {
    console.log("Adding new tag");
    // validate data
    const { error } = tagSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    const values = {
      name: req.body.name,
      id: { type: OracleDB.NUMBER, dir: OracleDB.BIND_OUT },
    };

    const query =
      "INSERT INTO tags (name) VALUES (:name) RETURNING id into :id";

    const result = await database.query(query, values);

    // successful insert
    res.status(201).json({
      msg: "Added new tag",
      id: result.outBinds.id[0],
    });
  } catch (err) {
    res.status(500).send(databaseError);
  }
});

module.exports = tagRouter;
