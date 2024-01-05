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
      const { filteredQuery } = await database.filteredQuery(req.query);
      results = await database.query(filteredQuery);
    } else {
      // query does not have filters
      const query = "SELECT * FROM templates";
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
      "SELECT * FROM templates WHERE id = ?",
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

module.exports = router;
