import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';
import { GENDER, VERIFY } from '../constants/model.js';

const User = sequelize.define(
  'User',
  {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM,
      values: GENDER,
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    urlAvatar: {
      type: DataTypes.STRING
    },
    verify: {
      type: DataTypes.ENUM,
      values: VERIFY,
      allowNull: false,
      defaultValue: 'unverified'
    },
    refreshToken: {
      type: DataTypes.STRING
    },
    expiredAt: {
      type: DataTypes.DATE
    },
    emailVerifyToken: {
      type: DataTypes.STRING
    },
    forgotPasswordToken: {
      type: DataTypes.STRING
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    timestamps: true
  }
);

export default User;
