import bcrypt from 'bcrypt';
import  db  from '../config/db.js';
import dotenv from "dotenv"

import jwt from "jsonwebtoken";

dotenv.config()

export const createUser = async (req, res) => {
    const { fullName,businessName,businessType,phone,email, password } = req.body;
    if (!fullName || !businessName || !businessType || !phone || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
        return res.status(409).json({ message: 'Email already in use' });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const sql = 'INSERT INTO users (fullName, businessName, businessType, phone, email, password) VALUES (?, ?, ?, ?, ?, ?)';
    // Logic to create a new user
    try {
        const [result] = await db.query(sql, [fullName, businessName, businessType, phone, email, hashedPassword]);
        res.status(201).json({ message: 'User created successfully', userId: result.insertId });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const login = async (req, res) => {

  const { email, password } = req.body;

  // =========================
  // VALIDATION
  // =========================

  if (!email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {

    // =========================
    // CHECK USER
    // =========================

    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const user = rows[0];

    // =========================
    // CHECK PASSWORD
    // =========================

    const isMatch = bcrypt.compareSync(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // =========================
    // CREATE TOKEN
    // =========================

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName:user.fullName
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // =========================
    // SUCCESS RESPONSE
    // =========================

    return res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        fullName: user.fullName
      },
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};