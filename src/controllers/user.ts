import { Request, Response, NextFunction } from 'express';
import { body, validationResult, sanitizeBody } from 'express-validator';
import omit from 'lodash/omit';

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
    const error = validationResult(req);

    if(!error.isEmpty()) {
      const errorMsg = error.array().map((error) => error.msg);
      
      res.send(new ErrorResponse(errorMsg));
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

export async function login(req: Request, res: Response) {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if(!user) {
    res.status(401);
    res.send(new ErrorResponse('Unauthorized', 401));  
  }

  const isRightPassword = user.validatePassword(password);

  if(!isRightPassword) {
    res.status(401);
    res.send(new ErrorResponse('Unauthorized', 401));
  }
  
  const token = await signJWT(user.toObject());

  res.send({
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
  async (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req);

    if(!error.isEmpty()) {
      const errorMsg = error.array().map((error) => error.msg);
      
      res.send(new ErrorResponse(errorMsg));
      return;
    }

    next();
  }
];

export async function register(req: Request, res: Response) {
  const { username, email, password } = req.body;
  const newUser = new User({
    email,
    username,
  });

  try {
    newUser.setPassword(password);
    const user = await newUser.save();
    const token = await signJWT(user.toObject());

    res.send({
      data: {
        ...user.toObject(),
        token,
      },
    });
  } catch(err) {
    if(err.code === 11000) {
      const [name] = Object.keys(err.keyValue);

      res.send(new ErrorResponse(`${name} đã được sử dụng`));
      return;
    }

    res.send(process.env.IS_DEV ? err.message : 'Một số lỗi xãy ra vui lòng hiên hệ để biết thêm');
  }
}

/**
 * Get current user info
 * @param req
 * @param res 
 */
export async function getCurrentUserInfo(req: Request, res: Response) {
  res.send({
    data: omit(req.user, ['exp', 'iat']),
  });
} 

export const updateCurrentUserValidation = [
  validations.email,
  validations.bio,
  validations.middleWare,
];

export async function updateCurrentUserInfo(req: Request, res: Response) {
  const { email, bio, image } = req.body;
  const { id } = req.user;

  const user = await User.findById(id);
  if(!user) {
    res.status(404);
    res.json(new ErrorResponse('Not found user', 404));
    return;
  }

  user.email = email;
  user.bio = bio;
  user.image = image;

  await user.save();

  res.json({
    data: user.toObject(),
  });
}