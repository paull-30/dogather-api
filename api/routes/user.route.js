import express from 'express';
import {
  getAllUsers,
  updateUser,
  deleteUser,
  displayPostsBasedOnUserSkills,
  getAcceptedPosts,
  displayInvitations,
  acceptPost,
} from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/', verifyToken, getAllUsers);
router.get('/recommended', verifyToken, displayPostsBasedOnUserSkills);
router.get('/accepted', verifyToken, getAcceptedPosts);
router.get('/invitations', verifyToken, displayInvitations);

router.post('/accept/:postId', verifyToken, acceptPost);

router.put('/:userID', verifyToken, updateUser);

router.delete('/:userID', verifyToken, deleteUser);

export default router;
