const mysql = require('mysql2');

// MySQL connection configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Export promise-based connection for async/await usage
module.exports = pool.promise();