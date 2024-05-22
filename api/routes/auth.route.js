import express from 'express';
import { register, login, logout } from '../controllers/auth.controller.js';
import { validateData } from '../middleware/validationMiddleware.js';
import {
  userLoginSchema,
  userRegistrationSchema,
} from '../schemas/validationSchemas.js';

const router = express.Router();

router.post('/register', validateData(userRegistrationSchema), register);
router.post('/login', validateData(userLoginSchema), login);
router.post('/logout', logout);

export default router;
