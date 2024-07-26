/* eslint-disable camelcase */
const Joi = require("joi");
const oracledb = require("oracledb");
const database = require("../config/database");
const express = require("express");
const imageRouter = express.Router();

const databaseError = { msg: "Error retrieving data from database" };
const notfoundError = { msg: "Data not found" };
console.log("Category router accessed");

const imageSchema = Joi.object({
  id: Joi.string().required(),
});

/**
 * Gets an image from the database with the given id
 */
imageRouter.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await database.query(`SELECT * FROM images WHERE id = :id`, {
      id: id,
    });

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
 * Adds a new image to the database
 */
imageRouter.post("/", async (req, res) => {
  try {
    // validate data
    const { error } = imageSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ message: error.details });
    }

    if (!req.files) {
      return res.status(400).json({ msg: "No images provided" });
    }

    const values = {
      img: {
        val: req.files.img.data,
        type: oracledb.BLOB,
      },
      id: req.body.id,
    };

    const query = "INSERT INTO images (id, img) VALUES (:id, :img)";

    // const result = await database.query(query, values);

    // successful insert
    res.status(201).json({
      msg: "Added new image",
      id: values.id,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = imageRouter;
