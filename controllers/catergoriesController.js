import db from "../config/db.js";

export const getStockIns = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM stock_ins");
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const createStockIn = async (req, res) => {
  const { product_id, quantity, date } = req.body;

  if (!product_id || !quantity || !date) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const q = `
      INSERT INTO stock_ins
      (product_id, quantity, date)
      VALUES (?, ?, ?)
    `;

    db.query(q, [product_id, quantity, date], (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to add stock in record",
        });
      }

      return res.status(201).json({
        message: "Stock in record added successfully",
        id: result.insertId,
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

export const updateStockIn = async (req, res) => {
  const { id } = req.params;
  const { product_id, quantity, date } = req.body;

  if (!product_id || !quantity || !date) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const q = `
      UPDATE stock_ins
      SET product_id = ?, quantity = ?, date = ?
      WHERE id = ?
    `;

    db.query(q, [product_id, quantity, date, id], (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to update stock in record",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Stock in record not found",
        });
      }

      return res.status(200).json({
        message: "Stock in record updated successfully",
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

export const deleteStockIn = async (req, res) => {
  const { id } = req.params;

  try {
    const q = `
      DELETE FROM stock_ins
      WHERE id = ?
    `;

    db.query(q, [id], (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to delete stock in record",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Stock in record not found",
        });
      }

      return res.status(200).json({
        message: "Stock in record deleted successfully",
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
    });
  }
};