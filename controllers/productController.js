import db from "../config/db.js";
import PDFDocument from "pdfkit";
// import PDFDocument from "pdfkit";
// import db from "../config/db.js";

export const getProducts = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM products");
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json(error);
  }
};
export const createProduct = async (req, res) => {
  console.log("Received data:", req.body);
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


export const exportProductsPDF = async (req, res) => {
  try {
    // ===============================
    // 1. GET PRODUCTS
    // ===============================
    const [products] = await db.query("SELECT * FROM products");

    // ===============================
    // 2. SUMMARY DATA
    // ===============================
    const [summaryRows] = await db.query(`
      SELECT 
        COUNT(*) AS totalProducts,
        SUM(quantity * price) AS totalValue,
        COUNT(DISTINCT category) AS categories,
        SUM(CASE WHEN quantity <= minStock THEN 1 ELSE 0 END) AS lowStock
      FROM products
    `);

    // ===============================
    // 3. STOCK TRANSACTIONS (FIXED)
    // ===============================
    const [stockInRows] = await db.query(`
      SELECT SUM(quantity) AS stockIn 
      FROM stock_transactions 
      WHERE transaction_type = 'stock_in'
    `);

    const [stockOutRows] = await db.query(`
      SELECT SUM(quantity) AS stockOut 
      FROM stock_transactions 
      WHERE transaction_type = 'stock_out'
    `);

    // ===============================
    // 4. SUMMARY OBJECT
    // ===============================
    const summary = {
      totalProducts: summaryRows[0].totalProducts || 0,
      totalValue: summaryRows[0].totalValue || 0,
      categories: summaryRows[0].categories || 0,
      lowStock: summaryRows[0].lowStock || 0,
      stockIn: stockInRows[0].stockIn || 0,
      stockOut: stockOutRows[0].stockOut || 0,
    };

    // ===============================
    // 5. CREATE PDF
    // ===============================
    const doc = new PDFDocument({ margin: 30 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=inventory-report.pdf"
    );

    doc.pipe(res);

    // ===============================
    // 6. HEADER
    // ===============================
    doc.fontSize(18).text("Inventory Products Report", {
      align: "center",
    });

    doc.moveDown();

    // ===============================
    // 7. SUMMARY SECTION
    // ===============================
    doc.fontSize(12);
    doc.text(`Total Products: ${summary.totalProducts}`);
    doc.text(`Total Inventory Value: GMD ${summary.totalValue}`);
    doc.text(`Categories: ${summary.categories}`);
    doc.text(`Low Stock Items: ${summary.lowStock}`);
    doc.text(`Total Stock In: ${summary.stockIn}`);
    doc.text(`Total Stock Out: ${summary.stockOut}`);

    doc.moveDown();

    // ===============================
    // 8. TABLE HEADER
    // ===============================
    doc.fontSize(10);
    doc.text(
      "Name | Product No | Category | Qty | MinStock | Price | Supplier"
    );

    doc.moveDown(0.5);

    // ===============================
    // 9. TABLE ROWS
    // ===============================
    products.forEach((p) => {
      doc.text(
        `${p.name} | ${p.product_number} | ${p.category} | ${p.quantity} | ${p.minStock} | GMD ${p.price} | ${p.supplier}`
      );
    });

    // ===============================
    // 10. END PDF
    // ===============================
    doc.end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to generate PDF",
      error: error.message,
    });
  }
};