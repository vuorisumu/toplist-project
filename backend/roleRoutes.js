const database = require("./database");
// const schemas = require("./schemas");
const express = require("express");
const roleRouter = express.Router();
const bcrypt = require("bcrypt");

const databaseError = { msg: "Error retrieving data from database" };
const notfoundError = { msg: "Data not found" };
console.log("Role router accessed");

/**
 * Sends login information to database
 * Responds with role data on successful login
 */
roleRouter.post("/:role", async (req, res) => {
  try {
    const { role, password } = req.body;
    
    const roleData = await database.query(
      `SELECT * FROM roles WHERE role_name = :1)`,
      [role]
    );

    if (roleData.length > 0) {
      const storedPassword = roleData[0].password
      bcrypt.compare(password, storedPassword, (bcryptErr, bcryptRes) => {
        if (bcryptErr) {
          throw bcryptErr;
        }

        if (bcryptRes) {
          res.status(200).json(roleData);
        } else {
          res.status(401).json({ error: "Invalid password" });
        }
      })
    }
  } catch (err) {
    res.status(500).send(databaseError);
  }
});

module.exports = roleRouter;
