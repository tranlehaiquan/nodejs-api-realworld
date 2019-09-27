import jwt from 'jsonwebtoken';
import addMilliseconds from 'date-fns/addMilliseconds';
import { milisecondOfDay } from './date';

const secondsOfDay = milisecondOfDay / 1000;

const options = {
  expiresIn: secondsOfDay,
};

export interface Token {
  token: string,
  exp: number,
};

/**
 * Sign jwt to get user access token
 * @param payload user info
 */
export const signJWT = async (payload: any):Promise<Token> => {
  return new Promise((res, rej) => {
    jwt.sign(payload, process.env.TOKEN_KEY, options, (err, token) => {
      if(err) rej(err);
      res({
        token,
        exp: Math.floor(addMilliseconds(new Date(), milisecondOfDay).getTime() / 1000),
      });
    });
  });
}

export const verifyJWT = (token: string): string | object => {
  return new Promise((res, rej) => {
    jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
      if(err) rej(err);
      res(decoded);
    });
  });
}
