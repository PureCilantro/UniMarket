# Unimarket API v2

This is the backend API for the Unimarket v2 project.

### > [Documentation](documentation/API.md)

### > [DB dictionary](documentation/DB.md)

## Setup Instructions

### Clone the Repository

```sh
git clone https://github.com/PureCilantro/UniMarket.git
cd UniMarket
```
### Install dependencies

```sh
npm install
```

### Start the API service

```sh
npm start
```

### On a _MariaDB_ database execute the commands from the file [db.sql](db.sql)

```sql
CREATE TABLE IF NOT EXISTS categories (
  categoryID TINYINT NOT NULL PRIMARY KEY,
  name VARCHAR(25) NOT NULL
);

...

CREATE TABLE IF NOT EXISTS users (
  userID VARCHAR(32) NOT NULL PRIMARY KEY,
  userKey VARCHAR(32) NOT NULL,
  name VARCHAR(50) NOT NULL,
  lastname VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  password VARCHAR(64) NOT NULL
);
```