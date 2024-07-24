require("dotenv").config({ path: ".env" });
const mysql = require("mysql2");

//DB Connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
  keepAliveInitialDelay: 10000,
});

const promisePool = pool.promise();

// Error handling
promisePool
  .getConnection()
  .then((connection) => {
    console.log(
      "Connected to database successfully with connection id ",
      connection.threadId
    );
    connection.release();
  })
  .catch((err) => {
    console.error("Error connecting to database", err.stack);
  });

module.exports = promisePool;
