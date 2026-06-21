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
    stock_out.unit_price,
    stock_out.total_amount,
    stock_out.payment_method,
    stock_out.payment_status,
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
  const {
    product_id,
    quantity,
    payment_method,
    payment_status,
    note,
  } = req.body;

  const user_id = req.user.id;

  if (
    !product_id ||
    !quantity ||
    !payment_method ||
    !payment_status
  ) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    await db.query("START TRANSACTION");

    // Check product
    const [product] = await db.query(
      "SELECT * FROM products WHERE id = ? FOR UPDATE",
      [product_id]
    );

    if (product.length === 0) {
      await db.query("ROLLBACK");

      return res.status(404).json({
        message: "Product not found",
      });
    }

    const selectedProduct = product[0];

    // Check stock
    if (selectedProduct.quantity < quantity) {
      await db.query("ROLLBACK");

      return res.status(400).json({
        message: "Insufficient stock",
      });
    }

    // Calculate amount
    const unit_price = selectedProduct.price;
    const total_amount = unit_price * quantity;

    // Insert transaction
    const insertQuery = `
      INSERT INTO stock_out
      (
        product_id,
        user_id,
        quantity,
        unit_price,
        total_amount,
        payment_method,
        payment_status,
        note,
        transaction_type
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(insertQuery, [
      product_id,
      user_id,
      quantity,
      unit_price,
      total_amount,
      payment_method,
      payment_status,
      note || null,
      "stock_out",
    ]);

    // Update stock quantity
    await db.query(
      "UPDATE products SET quantity = quantity - ? WHERE id = ?",
      [quantity, product_id]
    );

    await db.query("COMMIT");

    return res.status(201).json({
      message: "Stock out successful",
      transaction_id: result.insertId,
      total_amount,
    });

  } catch (error) {
    await db.query("ROLLBACK");

    console.log(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};
export const deleteStockOut = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("START TRANSACTION");

    // Get stock out transaction
    const [transaction] = await db.query(
      "SELECT * FROM stock_out WHERE id = ? FOR UPDATE",
      [id]
    );

    if (transaction.length === 0) {
      await db.query("ROLLBACK");

      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    const stockOut = transaction[0];

    // Restore stock quantity
    await db.query(
      `
      UPDATE products
      SET quantity = quantity + ?
      WHERE id = ?
      `,
      [stockOut.quantity, stockOut.product_id]
    );

    // Delete transaction
    await db.query(
      "DELETE FROM stock_out WHERE id = ?",
      [id]
    );

    await db.query("COMMIT");

    return res.status(200).json({
      message: "Stock out transaction deleted successfully",
    });

  } catch (error) {
    await db.query("ROLLBACK");

    console.log(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};