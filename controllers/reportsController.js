import db from "../config/db.js";
export const getReports = (req, res) => {
  const q = 'SELECT * FROM products';
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
}
try {
    const q = 'SELECT * FROM products';
    await db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
} catch (error) {
    return res.status(500).json(error); 
}       