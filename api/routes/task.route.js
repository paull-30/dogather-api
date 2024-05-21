import express from 'express';
import {
  createTask,
  deleteTask,
  displayTasks,
  getTask,
  updateTask,
  updateTaskStatus,
} from '../controllers/task.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router({ mergeParams: true });

router.get('/', verifyToken, displayTasks);
router.get('/:taskId', verifyToken, getTask);

router.post('/new', verifyToken, createTask);

router.put('/update/:taskId', verifyToken, updateTask);
router.put('/update/:taskId/status', verifyToken, updateTaskStatus);

router.delete('/delete/:taskId', verifyToken, deleteTask);

export default router;
