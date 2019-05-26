import { Request, Response } from 'express';

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
