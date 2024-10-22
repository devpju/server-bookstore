import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';
import { ROLE_NAMES } from '../constants/model.js';

const Role = sequelize.define('Role', {
  name: {
    type: DataTypes.ENUM,
    values: ROLE_NAMES,
    allowNull: false,
    unique: true,
    defaultValue: 'customer'
  }
});

export default Role;
