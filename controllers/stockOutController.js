import db from "../config/db.js";
export const getStockOut = async (req, res) => {
  try {
    const [results] = await db.query(`SELECT 
   stock_out.id,
    
    products.name AS product_name,
    
    users.fullName AS username,
    
    stock_out.quantity,
    stock_out.note,
    stock_out.transaction_type,
    stock_out.created_at

FROM stock_out

JOIN products
ON stock_out.product_id = products.id

JOIN users
ON stock_out.user_id = users.id

ORDER BY stock_out.created_at DESC`);
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const createStockOut = async (req, res) => {
  const { product_id, quantity, note } = req.body;
  const user_id = req.user.id;

  if (!product_id || !quantity) {
    return res.status(400).json({
      message: "Product and quantity are required",
    });
  }

  try {
    await db.query("START TRANSACTION");

    // 1. Check product
    const [product] = await db.query(
      "SELECT * FROM products WHERE id = ? FOR UPDATE",
      [product_id]
    );

    if (product.length === 0) {
      await db.query("ROLLBACK");
      return res.status(404).json({ message: "Product not found" });
    }

    // 2. Check stock
    if (product[0].quantity < quantity) {
      await db.query("ROLLBACK");
      return res.status(400).json({
        message: "Insufficient stock",
      });
    }

    // 3. Insert transaction
    const insertQuery = `
      INSERT INTO stock_out
      (product_id, user_id, quantity, note, transaction_type)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(insertQuery, [
      product_id,
      user_id,
      quantity,
      note || null,
      "stock_out",
    ]);

    // 4. Update stock
    await db.query(
      `UPDATE products SET quantity = quantity - ? WHERE id = ?`,
      [quantity, product_id]
    );

    await db.query("COMMIT");

    return res.status(201).json({
      message: "Stock out successful",
      transaction_id: result.insertId,
    });

  } catch (error) {
    await db.query("ROLLBACK");

    console.log(error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};