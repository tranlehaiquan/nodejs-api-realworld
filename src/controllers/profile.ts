import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../models/Error/ErrorResponse';
import UserModel from '../models/User';

/**
 * Database desgin
 * 1 - Put Following list id inside user Modal
 * 2 - Create seperate Follow table to store
 */

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.params;
  let following = false;

  if (!username) {
    res.json({ data: {} });
    return;
  }
  const userProfile = await UserModel.findOne({ username });

  if (req.user) {
    const authUser = req.user;
    const isFollowing = authUser.listFollow.every(profileFollowing => {
      return profileFollowing.id === userProfile.id;
    });

    if (isFollowing && authUser.listFollow.length) following = true;
  }

  res.json({
    data: {
      ...userProfile.toObject(),
      following,
    },
  });
};

export const paramProfile = async (req: Request, res: Response, next: NextFunction, value: string): Promise<void> => {
  const profile = await UserModel.findOne({ username: value });

  if (!profile) {
    next(new ErrorResponse(404, "Can't find the profile"));
  } else {
    req.profile = profile;
    next();
  }
};

// Add profile to followList of User (auth)
// followList => List of profile follow by User (auth)
export const followProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { profile: profileTarget } = req;
  const userLogined = req.user;

  const indexOfProfile = userLogined.listFollow.findIndex(follower => follower.id === profileTarget.id);
  const profileIsIncluded = indexOfProfile >= 0;
  const isSameUser = userLogined.id === profileTarget.id;

  if (isSameUser) {
    next(new ErrorResponse(400, 'You can not follow yourself!'));
    return;
  }

  if (!profileIsIncluded) {
    userLogined.listFollow.push({
      id: profileTarget.id,
      username: profileTarget.username,
    });
    await userLogined.save();
  }

  res.json({
    data: userLogined.listFollow,
  });
};

export const unFollowProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { profile: profileTarget } = req;
  const userLogined = req.user;
  const indexOfProfile = userLogined.listFollow.findIndex(follower => follower.id === profileTarget.id);
  const profileIsIncluded = indexOfProfile >= 0;
  const isSameUser = userLogined.id === profileTarget.id;

  if (isSameUser) {
    next(new ErrorResponse(400, 'You can not unfollow yourself!'));
    return;
  }

  if (profileIsIncluded) {
    userLogined.listFollow.splice(indexOfProfile, 1);
    await userLogined.save();
  }

  res.json({
    data: userLogined.listFollow,
  });
};
