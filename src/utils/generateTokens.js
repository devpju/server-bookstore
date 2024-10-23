import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_TIME, REFRESH_TOKEN_TIME } from '../constants/tokenTime.js';
import dotenv from 'dotenv';
dotenv.config();
export const generateAccessToken = ({ id, role }) => {
  return jwt.sign({ id, role }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_TIME
  });
};

export const generateRefreshToken = ({ id, role, remainingTime = REFRESH_TOKEN_TIME }) => {
  return jwt.sign({ id, role }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: remainingTime
  });
};
