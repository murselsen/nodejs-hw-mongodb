import express from 'express';
import {
  registerUserController,
  loginUserController,
  refreshUserSessionController,
  logoutUserController,
} from '../controllers/auth.js';
import { validateBody } from '../middleware/validateBody.js';

// Validation Schemas
import { loginUserSchema, registerUserSchema } from '../validation/auth.js';

const router = express.Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  registerUserController
);

router.post('/login', validateBody(loginUserSchema), loginUserController);
router.post('/logout', logoutUserController);
router.post('/refresh', refreshUserSessionController);

export default router;
