const database = require("./database");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

const databaseError = { msg: "Error retrieving data from database" };
const notfoundError = { msg: "Data not found" };
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

// add new template
router.post("/templates/", async (req, res) => {
  try {
    // validate data
    const { error } = database.templateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    console.log(req.body);

    const values = [];
    const fields = [];

    // mandatory values
    fields.push("name", "items");
    values.push(req.body.name, JSON.stringify(req.body.items));

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

    // optional tags
    if (req.body.tags) {
      fields.push("tags");
      values.push(JSON.stringify(req.body.tags));
    }

    // optional creation time
    if (req.body.editkey) {
      fields.push("editkey");
      values.push(`PASSWORD(${req.body.editkey})`);
    }

    const placeholdersString = values.map(() => "?").join(", ");
    const query = `INSERT INTO templates (${fields.join(
      ", "
    )}) VALUES (${placeholdersString})`;

    console.log(query);
    const result = await database.query(query, values);

    // successful insert
    res.status(201).json({
      msg: "Added new template",
      id: result.insertId,
    });
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

// --- TAGS ---

// get all tags
router.get("/tags", async (req, res) => {
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
router.post("/tags/", async (req, res) => {
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

// add new user
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

// --- ROLES ---

router.post("/login/:role", async (req, res) => {
  try {
    const { password } = req.body;
    const roleData = await database.query(
      `SELECT * FROM roles WHERE role_name = '${req.params.role}' AND password = PASSWORD('${password}')`
    );

    if (roleData.length === 0) {
      return res.status(401).json({ error: "Invalid password" });
    }

    res.status(200).json(roleData);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
