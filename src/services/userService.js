import User from '../models/User.js';
import Role from '../models/Role.js';

export const findUserById = async (id) => {
  const user = await User.findByPk(id, {
    include: {
      model: Role,
      as: 'role',
      attributes: ['name']
    }
  });
  return user;
};

export const findUserByPhoneNumber = async (phoneNumber) => {
  const user = await User.findOne({
    where: { phoneNumber },
    include: {
      model: Role,
      as: 'role',
      attributes: ['name']
    }
  });
  return user;
};

export const findUserByEmail = async (email) => {
  const user = await User.findOne({
    where: { email },
    include: {
      model: Role,
      as: 'role',
      attributes: ['name']
    }
  });
  return user;
};

export const getRoleByRoleName = async (roleName) => {
  const role = await Role.findOne({
    where: { name: roleName }
  });
  return role;
};
