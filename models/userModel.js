// CREATE TABLE users (
//     id INT PRIMARY KEY AUTO_INCREMENT,

//     full_name VARCHAR(100) NOT NULL,
//     business_name VARCHAR(150) NOT NULL,
//     business_type VARCHAR(100) NOT NULL,

//     phone VARCHAR(20) NOT NULL,
//     email VARCHAR(150) NOT NULL UNIQUE,

//     password VARCHAR(255) NOT NULL,

//     role ENUM('user') DEFAULT 'user',

//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// // )
import db from "../config/db.js";

const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      fullName VARCHAR(100) NOT NULL,
      businessName VARCHAR(150) NOT NULL,
      businessType VARCHAR(100) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('user','admin') DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  try {
    await db.query(query);
    console.log("Users table created or already exists.");
  } catch (err) {
    console.error("Error creating users table:", err);
  }
};

export default createUsersTable;
