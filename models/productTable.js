import db from "../config/db.js";

const createProductTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
    
    name VARCHAR(255) NOT NULL,
    
    product_number VARCHAR(100) NOT NULL UNIQUE,
    
    category VARCHAR(100) NOT NULL,
    
    quantity INT NOT NULL DEFAULT 0,
    
    minStock INT NOT NULL DEFAULT 0,
    
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    
    supplier VARCHAR(255) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
    ON UPDATE CURRENT_TIMESTAMP
    )
  `;
  try {
    await db.query(query);
    console.log("Products table created or already exists.");
  } catch (err) {
    console.error("Error creating products table:", err);
  } 
  ;
};

export default createProductTable;