import express from 'express';

export const setupServer = () => {


  const app = express();





const PORT = process.env.PORT || 3000;

  app.listen(PORT)

  console.log('Server setup complete');
};
