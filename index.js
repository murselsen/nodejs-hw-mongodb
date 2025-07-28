import { setupServer } from './src/server.js';
import initMongoConnection from './src/db/initMongoConnection.js';
const startServer = async () => {
  await initMongoConnection();
  setupServer();
};

startServer();
