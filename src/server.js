import express from 'express';
import { env } from './utils/env.js';
export const setupServer = async () => {
  const app = express();

  const PORT = env('PORT') || 3000;

  await app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  console.log('Server setup complete');
};
