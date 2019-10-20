import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../models/Error';
import User from '../models/User';

/**
 * Database desgin
 * 1 - Put Following list id inside user Modal
 * 2 - Create seperate Follow table to store 
 */

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.params;
  const { user } = req;
  let following = false;

  if(!username) {
    res.json({data: {}});
    return;
  }

  if(user) {}

  const userProfile = await User.findOne({ username });
  res.json({
    data: {
      ...userProfile.toObject(),
      following,
    },
  });
}

export const paramProfile = async (req: Request, res: Response, next: NextFunction, value: string) => {
  const profile = await User.findOne({ username: value });

  if(!profile) {
    res.status(404);
    res.json(new ErrorResponse('Can\'t find the article', 404));
    return;
  } else {
    req.profile = profile;
    next();
  }
}

export const followProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { profile } = req;
  const user = await User.findById(req.user.id);

  if(!user) {
    res.status(404);
    res.json(new ErrorResponse('Can\'t find the user', 404));
    return;
  }

  if(!user.listFollow.includes(profile.id) && user.id !== profile.id) {
    user.listFollow.push(profile.id);
    await user.save();
  }

  res.json({
    data: [...user.listFollow],
  });
}

export const unFollowProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { profile } = req;
  const user = await User.findById(req.user.id);

  if(!user) {
    res.status(404);
    res.json(new ErrorResponse('Can\'t find the user', 404));
    return;
  }

  if(user.listFollow.includes(profile.id)) {
    const profileIndex = user.listFollow.indexOf(profile.id);
    user.listFollow.splice(profileIndex, 1);
    await user.save();
  }

  res.json({
    data: [...user.listFollow],
  });
}
