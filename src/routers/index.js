import express from 'express';

const appRouters = express.Router();

import contactRouter from './contact.js';
import authRouter from './auth.js';



appRouters.use('/auth', authRouter);

appRouters.use('/contacts',contactRouter);

export default appRouters;
