const database = require("./database");
const express = require("express");
const router = express.Router();

const databaseError = { msg: "Error retrieving data from database" };
const notfoundError = { msg: "Location not found" };
console.log("router accessed");

// --- TEMPLATES ---

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

// --- RANKINGS ---

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

// get ranking by id
router.get("/rankings/:id([0-9]+)", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await database.query(
      `SELECT * FROM rankedlists r LEFT JOIN users u ON r.creator_id = u.user_id LEFT JOIN templates t ON r.template_id = t.id`,
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

// add new ranking
router.post("/rankings/", async (req, res) => {
  try {
    // validate data
    const { error } = database.rankingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    console.log(req.body);

    const values = [];
    const fields = [];

    // mandatory values
    fields.push("ranking_name", "template_id", "items");
    values.push(
      req.body.ranking_name,
      req.body.template_id,
      JSON.stringify(req.body.items)
    );

    // optional creator info
    if (req.body.creator_id) {
      fields.push("creator_id");
      values.push(req.body.creator_id);
    }

    // optional description
    if (req.body.description) {
      fields.push("description");
      values.push(req.body.description);
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

// --- USERS ---

// get all users
router.get("/users", async (req, res) => {
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
router.get("/users/:id([0-9]+)", async (req, res) => {
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

// add new ranking
router.post("/users/", async (req, res) => {
  try {
    // validate data
    const { error } = database.userSchema.validate(req.body);
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

module.exports = router;
