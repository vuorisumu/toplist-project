const database = require("./database");
const schemas = require("./schemas");
const express = require("express");
const rankRouter = express.Router();

const databaseError = { msg: "Error retrieving data from database" };
const notfoundError = { msg: "Data not found" };
console.log("Ranking router accessed");

/**
 * Gets rankings from database
 * If a query is found, construct an SQL query with given filters
 */
rankRouter.get("/", async (req, res) => {
  try {
    let results;
    if (Object.keys(req.query).length !== 0) {
      // query has filters
      const { filteredQuery, queryParams } =
        await database.filteredRankingQuery(req.query);
      results = await database.query(filteredQuery, queryParams);
    } else {
      // query does not have filters
      const query = `SELECT * FROM rankedlists r LEFT JOIN users u ON r.creator_id = u.user_id LEFT JOIN templates t ON r.template_id = t.id`;
      results = await database.query(query);
    }

    if (results.length === 0) {
      return res.status(404).send(notfoundError);
    }

    res.status(200).json(results);
  } catch (err) {
    res.status(500).send(databaseError);
  }
});

/**
 * Gets a ranking from database by given ID
 */
rankRouter.get("/:id([0-9]+)", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await database.query(
      `SELECT * FROM rankedlists r
      LEFT JOIN users u ON r.creator_id = u.user_id
      LEFT JOIN templates t ON r.template_id = t.id
      WHERE r.ranking_id = ?`,
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

/**
 * Validates given data and adds a new ranking to database
 * On successful insert, responds with an object including newly added ID
 */
rankRouter.post("/", async (req, res) => {
  try {
    // validate data
    const { error } = schemas.rankingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    console.log(req.body);

    const values = [];
    const fields = [];

    // mandatory values
    fields.push("ranking_name", "template_id", "ranked_items");
    values.push(
      req.body.ranking_name,
      req.body.template_id,
      JSON.stringify(req.body.ranked_items)
    );

    // optional creator info
    if (req.body.creator_id) {
      fields.push("creator_id");
      values.push(req.body.creator_id);
    }

    // optional description
    if (req.body.ranking_desc) {
      fields.push("ranking_desc");
      values.push(req.body.ranking_desc);
    }

    // optional creation time
    if (req.body.creation_time) {
      fields.push("creation_time");
      values.push(req.body.creation_time);
    }

    const placeholdersString = values.map(() => "?").join(", ");
    const query = `INSERT INTO rankedlists (${fields.join(
      ", "
    )}) VALUES (${placeholdersString})`;

    console.log(query);
    const result = await database.query(query, values);

    // successful insert
    res.status(201).json({
      msg: "Added new ranking",
      id: result.insertId,
    });
  } catch (err) {
    res.status(500).send(databaseError);
  }
});

/**
 * Deletes a ranking from database with a given ID
 */
rankRouter.delete("/:id([0-9]+)", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await database.query(
      "DELETE FROM rankedlists WHERE ranking_id = ?",
      id
    );

    if (result.affectedRows === 0) {
      return res.status(404).send(notfoundError);
    }

    res.status(200).json({ msg: `Deleted ranking ${id} successfully` });
  } catch (err) {
    res.status(500).send(databaseError);
  }
});

module.exports = rankRouter;
