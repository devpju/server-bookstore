import sequelize from '../../config/sequelize.js';

const authenticateDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('🎯 Connection to the database has been established successfully.');
  } catch (error) {
    throw new Error(`🥲 Unable to connect to the database: ${error?.message}`);
  }
};

export default authenticateDatabase;
