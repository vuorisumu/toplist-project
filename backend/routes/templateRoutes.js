const oracledb = require("oracledb");
const database = require("../config/database");
const {
  filteredTemplatesQuery,
} = require("../filteredQueries/templateQueries");
const {
  templateSchema,
  specifiedIdSchema,
} = require("../schemas/templateSchemas");
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
      // query has filters
      try {
        const { filteredQuery, queryParams } = filteredTemplatesQuery(
          req.query
        );
        results = await database.query(filteredQuery, queryParams);
      } catch (err) {
        res.status(400).send(err.message);
      }
    } else {
      // query does not have filters
      const query = `SELECT t.id, t.name, t.description, u.user_name 
      FROM templates t 
      LEFT JOIN users u ON t.creator_id = u.user_id`;
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
      const { error, value } = specifiedIdSchema.validate(req.query);
      if (error) {
        res.status(400).send(error.message);
      }

      // get templates from a specified creator
      if (value.getCreatorId) {
        result = await database.query(
          `SELECT creator_id FROM templates WHERE id = :id`,
          { id: id }
        );
      }
    } else {
      // default query
      result = await database.query(
        `SELECT t.id, t.name, t.description, t.items, t.tags, u.user_name, t.creator_id, t.category, t.cover_image 
        FROM templates t 
        LEFT JOIN users u ON t.creator_id = u.user_id 
        WHERE id = :id`,
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
 * Validates data and adds new template to database
 * Responds with newly added template ID on successful insert
 */
templateRouter.post("/", async (req, res) => {
  try {
    // validate data
    const { error } = templateSchema.validate(req.body);
    if (error) {
      console.log(error);
      return res.status(400).json({ msg: error.details[0].message });
    }

    const placeholders = [];
    placeholders.push("name", "items");
    const values = {
      name: req.body.name,
      items: req.body.items,
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

    // optional cover image
    if (req.files?.cover_image) {
      placeholders.push("cover_image");
      values["cover_image"] = {
        val: req.files.cover_image.data,
        type: oracledb.BLOB,
      };
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
      "SELECT name FROM templates WHERE id = :id",
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

    const values = {};
    const fields = [];

    // template name
    if (req.body.name) {
      fields.push("name = :name");
      values["name"] = req.body.name;
    }

    // template items
    if (req.body.items) {
      fields.push("items = :items");
      values["items"] = req.body.items;
    }

    // template creator
    if (req.body.creator_id) {
      fields.push("creator_id = :creatorid");
      values["creatorid"] = req.body.creator_id;
    }

    // template description
    if (req.body.description) {
      fields.push("description = :description");
      values["description"] = req.body.description;
    } else {
      // set null if no description was found
      fields.push("description = NULL");
    }

    // template category
    if (req.body.category) {
      fields.push("category = :category");
      values["category"] = req.body.category;
    }

    // optional cover image
    if (req.files?.cover_image) {
      fields.push("cover_image = :cover_image");
      values["cover_image"] = {
        val: req.files.cover_image.data,
        type: oracledb.BLOB,
      };
    } else {
      if (req.body.cover_image) {
        fields.push("cover_image = :cover_image");
        values["cover_image"] = {
          val: null,
          type: oracledb.BLOB,
        };
      }
    }

    // build the string
    const updateString = fields.join(", ");
    const query = `UPDATE templates SET ${updateString} WHERE id = :id`;
    values["id"] = req.params.id;

    const result = await database.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(500).json({ msg: "Failed to update template" });
    }

    // successful insert
    res.status(201).json({
      msg: "Template updated",
      id: req.params.id,
    });
  } catch (err) {
    console.log(err);
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
