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
import { validateData } from '../middleware/validationMiddleware.js';
import {
  taskCreateSchema,
  taskStatusUpdateSchema,
  taskUpdateSchema,
} from '../schemas/validationSchemas.js';

const router = express.Router({ mergeParams: true });

router.get('/', verifyToken, displayTasks);
router.get('/:taskId', verifyToken, getTask);

router.post('/new', validateData(taskCreateSchema), verifyToken, createTask);

router.put(
  '/update/:taskId',
  validateData(taskUpdateSchema),
  verifyToken,
  updateTask
);
router.put(
  '/update/:taskId/status',
  validateData(taskStatusUpdateSchema),
  verifyToken,
  updateTaskStatus
);

router.delete('/delete/:taskId', verifyToken, deleteTask);

export default router;
