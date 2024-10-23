import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import { StatusCodes } from 'http-status-codes';
import dotenv from 'dotenv';
import { findUserById } from '../services/userService.js';

dotenv.config();

const authMiddleware = (requiredRole) => {
  return async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Token bị thiếu'));
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await findUserById(decoded.id);

      if (decoded.role === 'admin') {
        next();
        return;
      }

      if (
        user &&
        user.role.name !== decoded.role &&
        (!requiredRole || requiredRole !== user.role.name)
      ) {
        return next(
          new ApiError(StatusCodes.FORBIDDEN, 'Bạn không có quyền truy cập tài nguyên này')
        );
      }

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Token đã hết hạn'));
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Token không hợp lệ'));
      }
      next(error);
    }
  };
};

export default authMiddleware;
