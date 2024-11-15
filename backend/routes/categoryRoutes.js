const database = require("../config/database");
const express = require("express");
const categoryRouter = express.Router();

const databaseError = { msg: "Error retrieving data from database" };
const notfoundError = { msg: "Data not found" };
console.log("Category router accessed");

/**
 * Get all categories
 */
categoryRouter.get("/", async (req, res) => {
  try {
    let results;
    if (Object.keys(req.query).length !== 0) {
      const { name } = req.query;
      if (!name) {
        return res.status(400).send({ msg: "No name provided" });
      }

      results = await database.query(
        `SELECT * FROM categories WHERE lower(name) = lower(:name)`,
        {
          name: name,
        }
      );
      console.log(results);
    } else {
      const query = `SELECT * FROM categories ORDER BY CASE WHEN name = 'Uncategorized' THEN 1 ELSE 0 END, name ASC`;
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
 * Gets a category from database with given ID
 */
categoryRouter.get("/:id([0-9]+)", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await database.query(
      `SELECT * FROM categories WHERE id = :id`,
      {
        id: id,
      }
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

module.exports = categoryRouter;
