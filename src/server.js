import express from 'express';
import { env } from './utils/env.js';
import cors from 'cors';

import { getAllContacts, getContactById } from './services/contacts.js';
import {
  getAllContactsController,
  getContactByIdController,
} from './controllers/contacts.js';

const PORT = env('PORT') || 3000;

export const setupServer = async () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  // app.use(pino({
  //   transport: {
  //     target: 'pino-pretty',
  //     options: {
  //       colorize: true,
  //       translateTime: 'SYS:standard',
  //     },
  //   },
  // }));

  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Contacts API' });
  });

  app.get('/contacts', getAllContactsController);

  app.get('/contacts/:contactId', getContactByIdController);

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  app.listen(PORT, () => {
    console.log(`✅ | Server is running on port ${PORT}`);
  });
};
