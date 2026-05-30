import db from "../config/db.js";

export const getLowStockProducts = async (req, res) => {
  try {
    const results = await db.query(
      "SELECT * FROM products WHERE quantity < 10",
    );
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json(error);
  }
};
export const getLowStockProductsByCategory = (req, res) => {
  const category = req.params.category;
  const q = "SELECT * FROM products WHERE quantity < 10 AND category = ?"; // Adjust the threshold as needed
  db.query(q, [category], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};
try {
  const q = "SELECT * FROM products WHERE quantity < 10"; // Adjust the threshold as needed
  await db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
} catch (error) {}
