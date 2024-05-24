import express from 'express';
import { getMessages, sendMessage } from '../controllers/message.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router({ mergeParams: true });

router.get('/', verifyToken, getMessages);
router.post('/send', verifyToken, sendMessage);

export default router;
