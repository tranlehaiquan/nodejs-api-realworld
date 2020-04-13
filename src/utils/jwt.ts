import jwt from 'jsonwebtoken';
import addMilliseconds from 'date-fns/addMilliseconds';

import { UserExport } from '../models/User';
import ErrorResponse from '../models/Error/ErrorResponse';
import { milisecondOfDay } from './date';

const secondsOfDay = milisecondOfDay / 1000;

const options = {
  expiresIn: secondsOfDay,
};

export interface Token {
  token: string;
  exp: number;
}

/**
 * Sign jwt to get user access token
 * @param payload user info
 */
export const signJWT = async (payload: UserExport): Promise<Token> => {
  return new Promise((res, rej) => {
    jwt.sign(payload, process.env.TOKEN_KEY, options, (err, token) => {
      if (err) rej(err);
      res({
        token,
        exp: addMilliseconds(new Date(), milisecondOfDay).getTime(),
      });
    });
  });
};

export const verifyJWT = (token: string): Promise<UserExport> => {
  return new Promise((res, rej) => {
    jwt.verify(token, process.env.TOKEN_KEY, (err, decoded: UserExport) => {
      if (err) {
        let { message } = err;
        if (err.name === 'TokenExpiredError') message = 'Token has been expired';
        rej(new ErrorResponse(401, message));
      }
      res(decoded);
    });
  });
};
