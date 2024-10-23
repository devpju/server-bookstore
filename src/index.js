// server.js (or app.js)
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import sequelize from './config/sequelize.js';
import setAssociations from './models/associations.js';
import generateRoles from './utils/db/generateRoles.js';
import authenticateDatabase from './utils/db/authenticateDB.js';
import syncDatabase from './utils/db/syncDB.js';
import authRoute from './routes/authRoute.js';
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware.js';

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
const handleDB = async () => {
  try {
    await authenticateDatabase();
    setAssociations();
    await syncDatabase();
    await generateRoles();
  } catch (error) {
    console.error('Error in database handling:', error.message);
    throw error;
  }
};

app.use('/auth', authRoute);

//router

app.use(errorHandlingMiddleware);

const startServer = async () => {
  try {
    await handleDB();
    app.listen(port, () => {
      console.log(`🚀 Server is starting on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error.message);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  await sequelize.close();
  console.log('🛑 Server closed');
  process.exit(0);
});

startServer();
