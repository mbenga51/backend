import express from 'express';
import { createStockIn, getStockIns,} from '../controllers/stockInController.js';
import { verifyToken } from '../middlewares/verifyToken.js';
const router = express.Router();

// Define your stock-in related routes here
router.post('/',verifyToken, createStockIn);
router.get('/transactions',verifyToken, getStockIns);
export { router as stockInRouter };