import express from 'express';

import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  deleteContactController,
  updateContactController,
} from '../controllers/contacts.js';

import { isValidId } from '../middleware/isValidId.js';
import { validateBody } from '../middleware/validateBody.js';
import {
  createContactSchema,
  patchContactSchema,
} from '../validation/contact.js';
import { authenticate } from '../middleware/authenticate.js';
import { upload } from '../middleware/multer.js';
const router = express.Router();

router.get('/', authenticate, getAllContactsController);

router.get('/:contactId', authenticate, isValidId, getContactByIdController);

router.post(
  '/',
  authenticate,
  upload.single('photo'),
  validateBody(createContactSchema),
  createContactController
);

router.delete('/:contactId', authenticate, isValidId, deleteContactController);

router.patch(
  '/:contactId',
  authenticate,
  isValidId,
  upload.single('photo'),
  validateBody(patchContactSchema),
  updateContactController
);

export default router;
