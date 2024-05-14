import express from 'express';
import {
  getAllUsers,
  updateUser,
  deleteUser,
} from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/', verifyToken, getAllUsers);
router.put('/:userID', verifyToken, updateUser);
router.delete('/:userID', verifyToken, deleteUser);

export default router;
