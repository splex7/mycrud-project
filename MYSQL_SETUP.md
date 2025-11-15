# MySQL Setup Instructions

To run this application with MySQL, you'll need to:

1. Install MySQL on your system if not already installed
2. Start the MySQL server
3. Configure the database connection settings
4. Run the migration script to set up the database and tables

## Installation and Setup

### Install MySQL
On Ubuntu/Debian:
```bash
sudo apt update
sudo apt install mysql-server
```

On macOS:
```bash
brew install mysql
```

On Windows: Download from the official MySQL website or use a package manager like Chocolatey.

### Start MySQL Server
```bash
# On most systems
sudo service mysql start
# or
sudo systemctl start mysql

# On macOS with Homebrew
brew services start mysql
```

### Environment Configuration
The application uses a .env file to store database configuration. A .env file has been created with default settings:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=<use a strong password>
DB_NAME=crud_app
DB_PORT=3306
```

You can modify these values in the .env file according to your MySQL setup.

### Run Migration
Run the migration script to create the database and table:
```bash
npm run migrate
# or
node migrate.js
```

This will:
- Create the database if it doesn't exist
- Create the teams table if it doesn't exist
- Import data from data.json if it exists

### Run the Application
```bash
npm start
```

The application will now connect to MySQL instead of using the JSON file.

## API Endpoints

- `GET /teams` - Get all teams
- `POST /teams` - Create a new team
- `PUT /teams/:id` - Update a team by ID
- `DELETE /teams/:id` - Delete a team by ID