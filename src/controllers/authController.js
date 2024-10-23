import { StatusCodes } from 'http-status-codes';
import {
  findUserByEmail,
  findUserByPhoneNumber,
  getRoleByRoleName
} from '../services/userService.js';
import ApiError from '../utils/ApiError.js';
import { hashPassword, isPasswordMatch } from '../utils/handlePassword.js';
import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateTokens.js';
import { REFRESH_TOKEN_TIME } from '../constants/tokenTime.js';

export const register = async (req, res, next) => {
  const { fullName, email, phoneNumber, password, dob, gender } = req.body;

  try {
    const userFoundByEmail = await findUserByEmail(email);
    if (userFoundByEmail) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email này đã được sử dụng');
    }

    const userFoundByPhoneNumber = await findUserByPhoneNumber(phoneNumber);
    if (userFoundByPhoneNumber) {
      throw new ApiError(StatusCodes.CONFLICT, 'Số điện thoại này đã được sử dụng');
    }

    const hashedPassword = await hashPassword(password);

    const role = await getRoleByRoleName('customer');
    await User.upsert({
      fullName,
      email,
      phoneNumber,
      dob,
      gender,
      password: hashedPassword,
      roleId: role.id
    });

    res.status(StatusCodes.OK).json({ status: 'success', message: 'Đăng ký tài khoản thành công' });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, phoneNumber, password } = req.body;

  try {
    const user = email
      ? await findUserByEmail(email)
      : phoneNumber
      ? await findUserByPhoneNumber(phoneNumber)
      : undefined;
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Tài khoản này không tồn tại');
    }

    const match = await isPasswordMatch(password, user.password);

    if (!match) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Mật khẩu không đúng');
    }

    const accessToken = generateAccessToken({ id: user.id, role: user.role.name });
    const refreshToken = generateRefreshToken({ id: user.id, role: user.role.name });

    user.refreshToken = refreshToken;
    user.expiredAt = REFRESH_TOKEN_TIME;
    await user.save();

    const userRes = user.get();

    delete userRes.id;
    delete userRes.password;
    delete userRes.verify;
    delete userRes.expiredAt;
    delete userRes.emailVerifyToken;
    delete userRes.forgotPasswordToken;
    delete userRes.isDeleted;
    delete userRes.createdAt;
    delete userRes.updatedAt;
    delete userRes.roleId;

    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Đăng nhập thành công',
      data: {
        user: {
          ...userRes,
          accessToken
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
