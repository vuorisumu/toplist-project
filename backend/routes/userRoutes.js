const oracledb = require("oracledb");
const database = require("../config/database");
const { filteredUserQuery } = require("../filteredQueries/userQueries");
const { userSchema, editUserSchema } = require("../schemas/userSchemas");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const verifyToken = require("../config/verifyToken");
const userRouter = express.Router();

const databaseError = { msg: "Error retrieving data from database" };
const notfoundError = { msg: "Data not found" };
console.log("User router accessed");

/**
 * Gets users from database
 * If a query is found, construct an SQL query with given filters
 */
userRouter.get("/", async (req, res) => {
    try {
        let results;
        if (Object.keys(req.query).length !== 0) {
            // query has filters
            const { filteredQuery, queryParams } = await filteredUserQuery(
                req.query
            );

            results = await database.query(filteredQuery, queryParams);
        } else {
            // query does not have filters
            const query = `SELECT user_name FROM users`;
            results = await database.query(query);
        }

        res.status(200).json(results);
    } catch (err) {
        res.status(500).send(databaseError);
    }
});

/**
 * Gets a user with given ID from the database
 */
userRouter.get("/:id([0-9]+)", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await database.query(
            `SELECT user_name, user_id FROM users WHERE user_id = :id`,
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
 * Validates data and adds a new user to database
 * Responds with a newly added user ID on successful insert
 */
userRouter.post("/", async (req, res) => {
    try {
        // validate data
        const { error } = userSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ msg: error.details });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const values = {
            user_name: req.body.user_name,
            email: req.body.email,
            password: hashedPassword,
            user_id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
        };

        const query =
            "INSERT INTO users (user_name, email, password) VALUES (:user_name, :email, :password) RETURNING user_id INTO :user_id";

        const result = await database.query(query, values);

        // successful insert
        res.status(201).json({
            msg: "Added new user",
            user_name: values.user_name,
            user_id: result.outBinds.user_id[0],
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

/**
 * Tries to log in with given credentials, returning user information on
 * successful login.
 */
userRouter.post("/login/", async (req, res) => {
    try {
        const { user, password } = req.body;
        const userData = await database.query(
            `SELECT * FROM users WHERE lower(user_name) = lower(:1) OR lower(email) = lower(:2)`,
            [user, user]
        );

        const simplifiedData = userData.rows.map((row) => {
            const dataRow = {};
            userData.metaData.forEach((column, index) => {
                const columnName = column.name.toLowerCase();
                dataRow[columnName] = row[index];
            });
            return dataRow;
        });

        if (simplifiedData.length > 0) {
            const storedPassword = simplifiedData[0].password;
            bcrypt.compare(password, storedPassword, (bcryptErr, bcryptRes) => {
                if (bcryptErr) {
                    throw bcryptErr;
                }

                if (bcryptRes) {
                    const isAdmin =
                        simplifiedData[0].user_name === process.env.ADMIN_USER;
                    const token = jwt.sign(
                        {
                            id: simplifiedData[0].user_id,
                            user_name: simplifiedData[0].user_name,
                            email: simplifiedData[0].email,
                            isAdmin: isAdmin,
                        },
                        process.env.JWT_SECRET_KEY,
                        { expiresIn: process.env.JWT_EXPIRES_IN }
                    );
                    res.status(200).json({
                        token,
                        user_id: simplifiedData[0].user_id,
                        user_name: simplifiedData[0].user_name,
                        email: simplifiedData[0].email,
                    });
                } else {
                    res.status(401).json({ error: "Invalid password" });
                }
            });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (err) {
        res.status(500).send(databaseError);
    }
});

userRouter.patch("/:id([0-9]+)", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const exists = await database.query(
            "SELECT user_name FROM users WHERE user_id = :id",
            { id: id }
        );
        if (exists.length === 0) {
            return res.status(404).json({ msg: "User not found" });
        }

        // validate data
        const { error } = editUserSchema.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            return res.status(400).json({ msg: error.details });
        }

        console.log(req.body);
        const values = {};
        const fields = [];

        if (req.body.user_name) {
            fields.push("user_name = :user_name");
            values["user_name"] = req.body.user_name;
        }

        if (req.body.email) {
            fields.push("email = :email");
            values["email"] = req.body.email;
        }

        if (req.body.password) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            fields.push("password = :password");
            values["password"] = hashedPassword;
        }

        // build the string
        const updateString = fields.join(", ");
        const query = `UPDATE users SET ${updateString} WHERE user_id = :id`;
        values["id"] = req.params.id;

        console.log(query, values);
        const result = await database.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(500).json({ msg: "Failed to update user" });
        }

        // successful insert
        res.status(201).json({
            msg: "user updated",
            id: req.params.id,
        });
    } catch (err) {
        console.log(err);
        res.status(500).send(databaseError);
    }
});

/**
 * Checks authorization using the given token, returns the user id and the
 * admin status of currently logged in user
 */
userRouter.get("/auth/", verifyToken, async (req, res) => {
    res.status(200).json({
        id: req.user_id,
        admin: req.isAdmin,
        email: req.email,
        user_name: req.user_name,
    });
});

userRouter.delete("/:id([0-9]+)", verifyToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (req.user_id !== id && req.isAdmin === false) {
            return res.status(403).send({ msg: "Unauthorized action" });
        }

        const result = await database.query(
            "DELETE FROM users WHERE user_id = :id",
            { id: id }
        );

        if (result.affectedRows === 0) {
            return res.status(404).send(notfoundError);
        }

        res.status(200).json({ msg: `Deleted user ${id} successfully` });
    } catch (err) {
        res.status(500).send(databaseError);
    }
});

module.exports = userRouter;
