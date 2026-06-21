import db from "../config/db.js";

const createStock_transactions_out = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS stock_out (
      id INT PRIMARY KEY AUTO_INCREMENT,

      product_id INT NOT NULL,
      user_id INT NOT NULL,

      quantity INT NOT NULL,
      note TEXT,
      unit_price DECIMAL(10,2),
      total_amount DECIMAL(10,2),
      payment_method ENUM('cash','mobile_money','bank'),
      payment_status ENUM('paid','pending'),

      transaction_type ENUM('stock_in', 'stock_out') NOT NULL,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      -- Foreign Keys
      CONSTRAINT fk_stockout_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE,

      CONSTRAINT fk_stockout_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
    )
  `;

  try {
    await db.query(query);
    console.log("stock out table created or already exists.");
  } catch (err) {
    console.error("Error creating stock_out table:", err);
  }
};

export default createStock_transactions_out;
