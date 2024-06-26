const oracledb = require("oracledb");
const database = require("../config/database");
const { filteredTemplatesQuery } = require("../filteredQueries");
const { templateSchema, querySchema } = require("../schemas");
const bcrypt = require("bcrypt");
const express = require("express");
const templateRouter = express.Router();

const databaseError = { msg: "Error retrieving data from database" };
const notfoundError = { msg: "Data not found" };
console.log("Template router accessed");

/**
 * Gets templates from database
 * If a query is found, construct an SQL query with given filters
 */
templateRouter.get("/", async (req, res) => {
  try {
    let results;
    if (Object.keys(req.query).length !== 0) {
      if (req.query.count) {
        results = await database.query(
          `SELECT COUNT(id) AS count FROM templates`
        );
      } else if (req.query.distinct) {
        // fetch distinct names for suggestions
        results = await database.query(`SELECT DISTINCT name FROM templates`);
      } else {
        // query has filters
        const { filteredQuery, queryParams } = await filteredTemplatesQuery(
          req.query
        );
        results = await database.query(filteredQuery, queryParams);
      }
    } else {
      // query does not have filters
      const query = `SELECT t.id, t.name, t.description, u.user_name FROM templates t LEFT JOIN users u ON t.creator_id = u.user_id`;
      results = await database.query(query);
    }

    res.status(200).json(results);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(databaseError);
  }
});

/**
 * Gets a template from database with given ID
 */
templateRouter.get("/:id([0-9]+)", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let result;
    if (Object.keys(req.query).length !== 0) {
      const { error, value } = querySchema.validate(req.query);
      if (error) {
        throw error;
      }

      if (value.creatorId) {
        result = await database.query(
          `SELECT creator_id FROM templates WHERE id = :id`,
          { id: id }
        );
      }
    } else {
      result = await database.query(
        `SELECT t.id, t.name, t.description, t.items, t.tags, u.user_name, t.creator_id, t.category FROM templates t LEFT JOIN users u ON t.creator_id = u.user_id WHERE id = :id`,
        { id: id }
      );
    }
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
 * Sends edit key information to database with a specified ID
 * Responds with template data on successful query
 */
templateRouter.post("/:id([0-9]+)/edit/", async (req, res) => {
  try {
    const { editkey } = req.body;
    const id = parseInt(req.params.id);
    const templateData = await database.query(
      `SELECT * FROM templates WHERE id = :id`,
      { id: id }
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

/**
 * Validates data and adds new template to database
 * Responds with newly added template ID on successful insert
 */
templateRouter.post("/", async (req, res) => {
  try {
    // validate data
    const { error } = templateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    const placeholders = [];
    placeholders.push("name", "items");
    const values = {
      name: req.body.name,
      items: JSON.stringify(req.body.items),
      id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
    };

    // optional creator info
    if (req.body.creator_id) {
      placeholders.push("creator_id");
      values["creator_id"] = req.body.creator_id;
    }

    // optional description
    if (req.body.description) {
      placeholders.push("description");
      values["description"] = req.body.description;
    }

    // optional category
    if (req.body.category) {
      placeholders.push("category");
      values["category"] = req.body.category;
    }

    // optional tags
    if (req.body.tags) {
      placeholders.push("tags");
      values["tags"] = JSON.stringify(req.body.tags);
    }

    const placeholdersString = placeholders.map((t) => `:${t}`).join(", ");
    const query = `INSERT INTO templates (${placeholders.join(
      ", "
    )}) VALUES (${placeholdersString}) RETURNING id INTO :id`;

    const result = await database.query(query, values);

    // successful insert
    res.status(201).json({
      msg: "Added new template",
      id: result.outBinds.id[0],
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send(databaseError);
  }
});

/**
 * Validates data and edits a template with given ID
 */
templateRouter.patch("/:id([0-9]+)", async (req, res) => {
  try {
    // check if template exists
    const id = parseInt(req.params.id);
    const exists = await database.query(
      "SELECT * FROM templates WHERE id = :id",
      { id: id }
    );
    if (exists.length === 0) {
      return res.status(404).json({ msg: "Template not found" });
    }

    // validate data
    const { error } = templateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    console.log(req.body);

    const values = {};
    const fields = [];

    if (req.body.name) {
      fields.push("name = :name");
      values["name"] = req.body.name;
    }

    if (req.body.items) {
      fields.push("items = :items");
      values["items"] = JSON.stringify(req.body.items);
    }

    if (req.body.creator_id) {
      fields.push("creator_id = :creatorid");
      values["creatorid"] = req.body.creator_id;
    }

    if (req.body.description) {
      fields.push("description = :description");
      values["description"] = req.body.description;
    }

    if (req.body.category) {
      placeholders.push("category = :category");
      values["category"] = req.body.category;
    }

    if (req.body.tags) {
      fields.push("tags = :tags");
      values["tags"] = JSON.stringify(req.body.tags);
    }

    if (req.body.editkey) {
      fields.push("editkey = ?");
      const encryptedKey = await bcrypt.hash(req.body.editkey, 10);
      values.push(`${encryptedKey}`);
    }

    const updateString = fields.join(", ");
    const query = `UPDATE templates SET ${updateString} WHERE id = :id`;
    values["id"] = req.params.id;

    console.log(query);
    const result = await database.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(500).json({ msg: "Failed to update template" });
    }

    // successful insert
    res.status(201).json({
      msg: "Added new template",
      id: req.params.id,
    });
  } catch (err) {
    res.status(500).send(databaseError);
  }
});

/**
 * Deletes a template with given ID from the database
 */
templateRouter.delete("/:id([0-9]+)", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await database.query(
      "DELETE FROM templates WHERE id = :id",
      { id: id }
    );

    if (result.affectedRows === 0) {
      return res.status(404).send(notfoundError);
    }

    res.status(200).json({ msg: `Deleted template ${id} successfully` });
  } catch (err) {
    res.status(500).send(databaseError);
  }
});

module.exports = templateRouter;
