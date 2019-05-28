import { Request, Response } from 'express';
import UserModel from '../models/User';

export async function login(req: Request, res: Response) {
  res.send({
    data: 'success'
  });
}

export async function register(req: Request, res: Response) {
  res.send({
    data: 'success'
  });
}

/**
 * Get current user info
 * @param req
 * @param res 
 */
export async function getCurrentUserInfo(req: Request, res: Response) {
  res.send({
    data: 'success'
  });
}

export async function updateCurrentUserInfo(req: Request, res: Response) {
  res.send({
    data: 'success'
  });
}
