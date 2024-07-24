const oracledb = require("oracledb");
const dotenv = require("dotenv");

dotenv.config();

oracledb.fetchAsBuffer = [oracledb.BLOB];

let pool;
/**
 * Initializes the connection pool with credentials found in .env file.
 */
async function init() {
  try {
    if (!pool) {
      await oracledb.createPool({
        user: process.env.ORACLE_USER,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_CONNSTR,
        poolMin: 2,
        poolMax: 10,
        poolTimeout: 60,
      });
      console.log("Pool created");
    }
  } catch (err) {
    console.log("Error creating oracle pool: ", err);
  }
}

/**
 * Makes an SQL query.
 * @param {string} sql - SQL query
 * @param {Array} args - parameters for the query
 * @returns a promise containing query response
 */
async function query(sql, args = {}) {
  const connection = await oracledb.getConnection();

  return new Promise((resolve, reject) => {
    connection.execute(sql, args, (err, rows) => {
      if (err) {
        return reject(err);
      }

      resolve(rows);
      connection.commit();
      connection.close();
    });
  });
}

/**
 * Closes the connection pool.
 */
async function close() {
  console.log("Closing connection");
  try {
    await oracledb.getPool().close(10);
    console.log("Pool closed");
    process.exit(0);
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
}

module.exports = {
  init,
  query,
  close,
};
