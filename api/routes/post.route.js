import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  inviteUser,
  updatePost,
} from '../controllers/post.controller.js';

const router = express.Router();

router.get('/', verifyToken, getAllPosts);
router.get('/:id', verifyToken, getPostById);
router.post('/create', verifyToken, createPost);
router.post('/:id/invite/:username', verifyToken, inviteUser);
router.put('/:id', verifyToken, updatePost);
router.delete('/:id', verifyToken, deletePost);

export default router;
