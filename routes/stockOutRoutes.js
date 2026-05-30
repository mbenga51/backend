import express from "express";
import {
  createStockOut,
  getStockOut,
} from "../controllers/stockOutController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
const router = express.Router();

// Define your stock out-related routes here
// router.get('/', getStockOutProducts);
router.post("/", verifyToken, createStockOut);
router.get("/transactions", verifyToken, getStockOut);
// router.get('/category/:category', getStockOutProductsByCatego++ry);
export { router as stockOutRouter };
