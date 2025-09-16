import express from 'express';
import { env } from './utils/env.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import path from 'path';
// Routers
import appRouters from './routers/index.js';

const PORT = env('PORT') || 3000;
const swaggerDocument = yaml.load(path.join(process.cwd(), 'swagger.yaml'));

export const setupServer = async () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Contacts API' });
  });

  app.use(appRouters);

  // Error Handling Middleware
  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`✅ | Express | Server is running on port ${PORT}`);
  });
};
