import { Request, Response, NextFunction } from 'express';
import { body, validationResult, sanitizeBody } from 'express-validator';

import { ErrorResponse } from '../models/Error';
import User from '../models/User';
import { signJWT } from '../utils/jwt';

const validations = {
  username: body('username')
    .not().isEmpty().withMessage('Vui lòng điền tên của bạn')
    .isLength({ min: 5 }).withMessage('Tên ít nhất 5 ký tự')
    .trim().escape(),
  email: body('email')
    .isEmail().withMessage('Email không hợp lệ!')
    .normalizeEmail(),
  password: body('password')
    .not().isEmpty().withMessage('Vui lòng điền mật khẩu')
    .isLength({ min: 5 }).withMessage('Mật khẩu phải ít nhất 5 ký tự'),
  bio: body('bio').trim().escape(),
  image: body('image').trim().isURL(),
  middleWare: async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
      next({
        name: 'validationError',
        errors,
      })
      return;
    }

    next();
  }
};

export const loginValidation = [
  validations.username,
  validations.password,
  validations.middleWare,
];

export async function login(req: Request, res: Response, next: NextFunction) {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if(!user) {
    next(new ErrorResponse(401, 'Username or password is incorrect!'));
    return;
  }

  const isRightPassword = user.validatePassword(password);

  if(!isRightPassword) {
    next(new ErrorResponse(401, 'Username or password is incorrect!'));
    return;
  }
  
  const token = await signJWT(user.toObject());

  res.json({
    data: {
      ...user.toObject(),
      token,
    },
  });
}

export const registerValidation = [
  validations.username,
  validations.password,
  validations.email,
  sanitizeBody('email').normalizeEmail({
    gmail_remove_dots: false,
    gmail_remove_subaddress: false
  }),
  validations.middleWare,
];

export async function register(req: Request, res: Response, next: NextFunction) {
  const { username, email, password } = req.body;
  const newUser = new User({
    email,
    username,
  });

  try {
    newUser.setPassword(password);
    const user = await newUser.save();
    const token = await signJWT(user.toObject());

    res.json({
      data: {
        ...user.toObject(),
        token,
      },
    });
  } catch(err) {
    next(new ErrorResponse(400, err.message));
  }
}

/**
 * Get current user info
 * @param req
 * @param res 
 */
export async function getCurrentUserInfo(req: Request, res: Response) {
  const { id } = req.user;

  const user = await User.findById(id);
  if(!user) {
    res.status(404);
    res.json(new ErrorResponse(404, 'Not found user'));
    return;
  }

  res.json({
    data: user.toObject(),
  });
} 

export const updateCurrentUserValidation = [
  validations.email,
  validations.bio,
  validations.middleWare,
];

export async function updateCurrentUserInfo(req: Request, res: Response, next: NextFunction) {
  const { email, bio, image } = req.body;
  const { id } = req.user;

  const user = await User.findById(id);
  if(!user) {
    next(new ErrorResponse(404, 'Not found user'));
    return;
  }

  try {
    if(email) user.email = email;
    if(bio) user.bio = bio;
    if(image) user.image = image;

    await user.save();

    res.json({
      data: user.toObject(),
    });
  } catch(err) {
    next(new ErrorResponse(400, err.message));
  }
}