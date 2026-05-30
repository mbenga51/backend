import express from 'express';
import { getReports } from '../controllers/reportsController';
const router = express.Router();

// Define your report-related routes here
router.get('/', getReports);
export {router as reportsRouter}