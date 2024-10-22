import { ROLE_NAMES } from '../../constants/model.js';
import Role from '../../models/Role.js';

const generateRoles = async () => {
  try {
    for (const roleName of ROLE_NAMES) {
      await Role.findOrCreate({
        where: { name: roleName },
        defaults: { name: roleName }
      });
    }
    console.log('------- Roles is created successfully');
  } catch (error) {
    console.log(`Error creating roles: ${error?.message}`);
  }
};

export default generateRoles;
