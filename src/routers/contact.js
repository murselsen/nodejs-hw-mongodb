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

const router = express.Router();

router.get('/', getAllContactsController);

router.get('/:contactId', isValidId, getContactByIdController);

router.post('/', validateBody(createContactSchema), createContactController);

router.delete('/:contactId', isValidId, deleteContactController);

router.patch(
  '/:contactId',
  isValidId,
  validateBody(patchContactSchema),
  updateContactController
);

export default router;
