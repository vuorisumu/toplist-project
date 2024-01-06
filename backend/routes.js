const database = require("./database");
const express = require("express");
const router = express.Router();

const databaseError = { msg: "Error retrieving data from database" };
const notfoundError = { msg: "Location not found" };
console.log("router accessed");

// get all templates
router.get("/templates", async (req, res) => {
  try {
    let results;
    if (Object.keys(req.query).length !== 0) {
      // query has filters
      const { filteredQuery } = await database.filteredTemplatesQuery(
        req.query
      );
      results = await database.query(filteredQuery);
    } else {
      // query does not have filters
      const query = `SELECT * FROM templates t LEFT JOIN users u ON t.creator_id = u.user_id`;
      results = await database.query(query);
    }

    res.status(200).json(results);
  } catch (err) {
    res.status(500).send(databaseError);
  }
});

// get template by id
router.get("/templates/:id([0-9]+)", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await database.query(
      `SELECT * FROM templates t LEFT JOIN users u ON t.creator_id = u.user_id WHERE id = ?`,
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

// get all rankings
router.get("/rankings", async (req, res) => {
  try {
    let results;
    if (Object.keys(req.query).length !== 0) {
      // query has filters
      const { filteredQuery } = await database.filteredRankingQuery(req.query);
      results = await database.query(filteredQuery);
    } else {
      // query does not have filters
      const query = `SELECT * FROM rankedlists r LEFT JOIN users u ON r.creator_id = u.user_id LEFT JOIN templates t ON r.template_id = t.id`;
      results = await database.query(query);
    }

    res.status(200).json(results);
  } catch (err) {
    res.status(500).send(databaseError);
  }
});

module.exports = router;
