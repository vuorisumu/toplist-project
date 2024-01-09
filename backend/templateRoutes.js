const database = require("./database");
const bcrypt = require("bcrypt");
const express = require("express");
const templateRouter = express.Router();

const databaseError = { msg: "Error retrieving data from database" };
const notfoundError = { msg: "Data not found" };
console.log("Template router accessed");

// get all templates
templateRouter.get("/", async (req, res) => {
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
templateRouter.get("/:id([0-9]+)", async (req, res) => {
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

// enter editkey to enter edit mode
templateRouter.post("/:id([0-9]+)/edit/", async (req, res) => {
  try {
    const { editkey } = req.body;
    const templateData = await database.query(
      `SELECT * FROM templates WHERE id = ?`,
      [req.params.id]
    );

    if (templateData.length > 0) {
      const hashedPassword = templateData[0].editkey;
      bcrypt.compare(editkey, hashedPassword, (bcryptErr, bcryptRes) => {
        if (bcryptErr) {
          throw bcryptErr;
        }

        if (bcryptRes) {
          res.status(200).json({ msg: "Login successful", data: templateData });
        } else {
          res.status(401).json({ msg: "Invalid editkey" });
        }
      });
    } else {
      res.status(401).json({ msg: "Invalid id" });
    }
  } catch (err) {
    res.status(500).send(databaseError);
  }
});

// add new template
templateRouter.post("/", async (req, res) => {
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
      const encryptedKey = await bcrypt.hash(req.body.editkey, 10);
      values.push(`${encryptedKey}`);
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

module.exports = templateRouter;
