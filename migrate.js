require('dotenv').config();
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  multipleStatements: true
};

// Connect without specifying database to create it if it doesn't exist
const connection = mysql.createConnection(dbConfig);

// Database and table name
const dbName = process.env.DB_NAME || 'crud_app';
const tableName = 'teams';

console.log(`Connecting to MySQL server...`);

// SQL to create database
const createDbQuery = `CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`;

// SQL to create table
const createTableQuery = `
  USE \`${dbName}\`;
  CREATE TABLE IF NOT EXISTS \`${tableName}\` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    members TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );
`;

// SQL to insert initial data from data.json
function getInsertQuery(data) {
  const values = data.map(item => `('${item.name.replace(/'/g, "''")}', '${item.members.replace(/'/g, "''")}')`).join(', ');
  return `INSERT IGNORE INTO \`${tableName}\` (name, members) VALUES ${values};`;
}

try {
  console.log(`Creating database: ${dbName}`);
  connection.query(createDbQuery, (err, result) => {
    if (err) {
      console.error('Error creating database:', err);
      connection.end();
      return;
    }

    console.log(`Creating table: ${tableName}`);
    connection.query(createTableQuery, (err, result) => {
      if (err) {
        console.error('Error creating table:', err);
        connection.end();
        return;
      }

      // Check if we should import data from data.json
      const dataFilePath = path.join(__dirname, 'data.json');
      if (fs.existsSync(dataFilePath)) {
        console.log('Importing data from data.json...');
        const jsonData = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
        
        if (jsonData.length > 0) {
          const insertQuery = getInsertQuery(jsonData);
          connection.query(insertQuery, (err, result) => {
            if (err) {
              console.error('Error inserting initial data:', err);
            } else {
              console.log(`Imported ${jsonData.length} records from data.json`);
            }
            connection.end();
            console.log('Migration completed successfully!');
          });
        } else {
          connection.end();
          console.log('Migration completed successfully!');
        }
      } else {
        connection.end();
        console.log('Migration completed successfully!');
      }
    });
  });
} catch (error) {
  console.error('Error during migration:', error);
  connection.end();
}