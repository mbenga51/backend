import express from 'express';
import { createUser,login } from '../controllers/userController.js';
const router = express.Router();

// Define your user-related routes here
router.post('/register', createUser);
router.post('/login', login);

export {router as userRouter};