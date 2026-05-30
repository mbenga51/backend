import express from 'express';
import { getCategories } from '../controllers/catergoriesController';
const router = express.Router();

// Define your category-related routes here
router.get('/', getCategories);
export {router as categoriesRouter};

