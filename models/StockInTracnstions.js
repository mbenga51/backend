import db from "../config/db.js";

const createStock_transactions = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS stock_transactions (
      id INT PRIMARY KEY AUTO_INCREMENT,

    product_id INT NOT NULL,
    user_id INT NOT NULL,

    quantity INT NOT NULL,
    note TEXT,

    transaction_type ENUM('stock_in', 'stock_out') NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign Keys
    CONSTRAINT fk_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
    )
  `;
  try {
    await db.query(query);
    console.log("Stock_transactions table created or already exists.");
  } catch (err) {
    console.error("Error creating products table:", err);
  } 
  ;
};

export default createStock_transactions;