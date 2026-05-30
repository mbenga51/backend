import express from 'express';
import{ getLowStockProducts } from '../controllers/lowstockController.js';
import { getLowStockProductsByCategory } from '../controllers/lowstockController.js';
const router = express.Router();

// Define your low stock-related routes here
router.get('/', getLowStockProducts);
router.get('/category/:category', getLowStockProductsByCategory);
export {router as lowstockRouter}; 