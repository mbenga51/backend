import db from "../config/db.js";

export const getStockIns = async (req, res) => {
  try {
    const [results] = await db.query(`SELECT 
    stock_transactions.id,
    
    products.name AS product_name,
    
    users.fullName AS username,
    
    stock_transactions.quantity,
    stock_transactions.note,
    stock_transactions.transaction_type,
    stock_transactions.created_at

FROM stock_transactions

JOIN products
ON stock_transactions.product_id = products.id

JOIN users
ON stock_transactions.user_id = users.id

ORDER BY stock_transactions.created_at DESC`);
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json(error);
  }
};
export const createStockIn = async (req, res) => {
 
  const { product_id, quantity, note } = req.body;

  // Assuming user comes from auth middleware
  const user_id = req.user.id;
 

  if (!product_id || !quantity || !note) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {

    // =========================
    // 1. CHECK PRODUCT
    // =========================

    const [product] = await db.query(
      "SELECT * FROM products WHERE id = ?",
      [product_id]
    );

    if (product.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // =========================
    // 2. INSERT STOCK TRANSACTION
    // =========================

    const insertQuery = `
      INSERT INTO stock_transactions
      (product_id, user_id, quantity, note, transaction_type)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(insertQuery, [
      product_id,
      user_id,
      quantity,
      note,
      "stock_in",
    ]);

    // =========================
    // 3. UPDATE PRODUCT QUANTITY
    // =========================

    const updateQuery = `
      UPDATE products
      SET quantity = quantity + ?
      WHERE id = ?
    `;

    await db.query(updateQuery, [
      quantity,
      product_id,
    ]);

    // =========================
    // SUCCESS RESPONSE
    // =========================

    return res.status(201).json({
      message: "Stock added successfully",
      transaction_id: result.insertId,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};