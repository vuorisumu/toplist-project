const database = require("./database");
const express = require("express");
const roleRouter = express.Router();

const databaseError = { msg: "Error retrieving data from database" };
const notfoundError = { msg: "Data not found" };
console.log("Role router accessed");

roleRouter.post("/:role", async (req, res) => {
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

module.exports = roleRouter;
