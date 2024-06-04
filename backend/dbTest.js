const database = require("./database");
const express = require("express");
const testRouter = express.Router();

const databaseError = { msg: "Error retrieving data from database" };

testRouter.post("/", async (req, res) => {
  try {
    const { first, second } = req.body;
    const data = await database.testQuery(
      `INSERT INTO nodetab VALUES (:1, :2)`, [first, second]
    );

    res.status(200).json(data);
  } catch (err) {
    res.status(500).send(databaseError);
  }
});

module.exports = testRouter;
