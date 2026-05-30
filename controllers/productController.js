import db from "../config/db.js";

export const getProducts = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM products");
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json(error);
  }
};
export const createProduct = async (req, res) => {
  const {
    name,
    product_number,
    category,
    quantity,
    minStock,
    price,
    supplier,
  } = req.body;

  const status = null;

  if (
    !name ||
    !product_number ||
    !category ||
    !quantity ||
    !minStock ||
    !price ||
    !supplier
  ) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    // CHECK DUPLICATE PRODUCT NUMBER
    const checkQuery =
      "SELECT * FROM products WHERE product_number = ?";

    const [checkResult] = await db.query(checkQuery, [
      product_number,
    ]);

    if (checkResult.length > 0) {
      return res.status(400).json({
        message: "Product number already exists",
      });
    }

    // INSERT PRODUCT
    const insertQuery = `
      INSERT INTO products
      (name, product_number, category, quantity, minStock, price, supplier, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(insertQuery, [
      name,
      product_number,
      category,
      quantity,
      minStock,
      price,
      supplier,
      status,
    ]);

    return res.status(201).json({
      message: "Product added successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
export const updateProduct = async (req, res) => {
  const {
    name,
    product_number,
    category,
    quantity,
    minStock,
    price,
    supplier,
  } = req.body;

  const { id } = req.params;

  try {
    // CHECK REQUIRED FIELDS
    if (
      !name ||
      !product_number ||
      !category ||
      !quantity ||
      !minStock ||
      !price ||
      !supplier
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // CHECK DUPLICATE PRODUCT NUMBER
    const duplicateQuery = `
      SELECT * FROM products
      WHERE product_number = ? AND id != ?
    `;

    const [duplicateResult] = await db.query(
      duplicateQuery,
      [product_number, id]
    );

    if (duplicateResult.length > 0) {
      return res.status(400).json({
        message: "Product number already exists",
      });
    }

    // UPDATE PRODUCT
    const sql = `
      UPDATE products 
      SET 
        name = ?, 
        product_number = ?, 
        category = ?, 
        quantity = ?, 
        minStock = ?,
        price = ?, 
        supplier = ?
      WHERE id = ?
    `;

    const [result] = await db.query(sql, [
      name,
      product_number,
      category,
      quantity,
      minStock,
      price,
      supplier,
      id,
    ]);

    // PRODUCT NOT FOUND
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product updated successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    // CHECK IF PRODUCT EXISTS
    const checkQuery = "SELECT * FROM products WHERE id = ?";

    const [product] = await db.query(checkQuery, [id]);

    if (product.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // DELETE PRODUCT
    const deleteQuery = "DELETE FROM products WHERE id = ?";

    await db.query(deleteQuery, [id]);

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};