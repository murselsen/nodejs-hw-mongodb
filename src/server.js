import express from 'express';
import { env } from './utils/env.js';
import cors from 'cors';
import pino from 'pino-http';

const PORT = env('PORT') || 3000;

export const setupServer = async () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(pino());

  app.listen(PORT, () => {
    console.log(`✅ | Server is running on port ${PORT}`);
  });
};
