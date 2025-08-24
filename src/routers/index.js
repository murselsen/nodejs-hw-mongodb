import express from 'express';

const appRouters = express.Router();

import contactRouter from './contact.js';
import authRouter from './auth.js';

import { authenticate } from '../middleware/authenticate.js';

appRouters.use('/auth', authRouter);
appRouters.use(authenticate);
appRouters.use('/contacts', contactRouter);

export default appRouters;
