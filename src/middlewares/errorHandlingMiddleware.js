import { StatusCodes } from 'http-status-codes';

export const errorHandlingMiddleware = (err, req, res) => {
  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

  const responseError = {
    statusCode: err.statusCode,
    message: err.message || StatusCodes[err.statusCode]
  };

  if (process.env.NODE_ENV === 'development') {
    responseError.stack = err.stack;
  }

  res.status(responseError.statusCode).json(responseError);
};
