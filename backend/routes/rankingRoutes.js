const oracledb = require("oracledb");
const database = require("../config/database");
const { filteredRankingQuery } = require("../filteredQueries");
const { rankingSchema } = require("../schemas");
const express = require("express");
const rankRouter = express.Router();

const databaseError = { msg: "Error retrieving data from database" };
const notfoundError = { msg: "Data not found" };
console.log("Toplist router accessed");

/**
 * Gets rankings from database
 * If a query is found, construct an SQL query with given filters
 */
rankRouter.get("/", async (req, res) => {
  try {
    let results;
    if (Object.keys(req.query).length !== 0) {
      if (req.query.count) {
        let countQuery = `SELECT COUNT(toplist_id) AS count
          FROM toplists`;

        if (req.query.tempId && req.query.tempId !== 0) {
          countQuery += ` WHERE template_id = :tempId`;
          results = await database.query(countQuery, {
            tempId: req.query.tempId,
          });
        } else {
          results = await database.query(countQuery);
        }
      } else {
        // query has filters
        const { filteredQuery, queryParams } = await filteredRankingQuery(
          req.query
        );
        results = await database.query(filteredQuery, queryParams);
      }
    } else {
      // query does not have filters
      const query = `SELECT * FROM toplists top LEFT JOIN users u ON top.creator_id = u.user_id LEFT JOIN templates t ON top.template_id = t.id`;
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
      `SELECT * FROM toplists top
      LEFT JOIN users u ON top.creator_id = u.user_id
      LEFT JOIN templates t ON top.template_id = t.id
      WHERE top.toplist_id = :id`,
      { id: id }
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
    const { error } = rankingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    console.log(req.body);

    const placeholders = [];
    placeholders.push("toplist_name", "template_id", "ranked_items");
    const values = {
      toplist_name: req.body.toplist_name,
      template_id: req.body.template_id,
      ranked_items: JSON.stringify(req.body.ranked_items),
      toplist_id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
    };

    // optional creator info
    if (req.body.creator_id) {
      placeholders.push("creator_id");
      values["creator_id"] = req.body.creator_id;
    }

    // optional description
    if (req.body.toplist_desc) {
      placeholders.push("toplist_desc");
      values["toplist_desc"] = req.body.toplist_desc;
    }

    // optional creation time
    if (req.body.creation_time) {
      const creationTime = new Date(req.body.creation_time);
      placeholders.push("creation_time");
      values["creation_time"] = creationTime;
    }

    const placeholdersString = placeholders.map((t) => `:${t}`).join(", ");
    const query = `INSERT INTO toplists (${placeholders.join(
      ", "
    )}) VALUES (${placeholdersString}) RETURNING toplist_id INTO :toplist_id`;

    const result = await database.query(query, values);

    // successful insert
    res.status(201).json({
      msg: "Added new toplist",
      toplist_id: result.outBinds.toplist_id[0],
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
      "DELETE FROM toplists WHERE toplist_id = :id",
      { id: id }
    );

    if (result.affectedRows === 0) {
      return res.status(404).send(notfoundError);
    }

    res.status(200).json({ msg: `Deleted toplist ${id} successfully` });
  } catch (err) {
    res.status(500).send(databaseError);
  }
});

module.exports = rankRouter;
