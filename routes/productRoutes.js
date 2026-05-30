import express from 'express';
import { createProduct, getProducts,updateProduct,deleteProduct  } from '../controllers/productController.js';
const router = express.Router();

// Define your product-related routes here
router.post('/', createProduct);
router.get('/', getProducts);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
export {router as productRouter};