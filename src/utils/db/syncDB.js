import sequelize from '../../config/sequelize.js';

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('------- Database synced successfully.');
  } catch (error) {
    throw new Error(`Error syncing database: ${error?.message}`);
  }
};

export default syncDatabase;
