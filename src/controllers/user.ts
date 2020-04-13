import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

import ErrorResponse from '../models/Error/ErrorResponse';
import ErrorsValidationResponse from '../models/Error/ErrorsValidationResponse';
import UserModel, { UserExport } from '../models/User';
import { signJWT } from '../utils/jwt';

const validations = {
  username: body('username')
    .not()
    .isEmpty()
    .withMessage('Vui lòng điền tên của bạn')
    .isLength({ min: 5 })
    .withMessage('Tên ít nhất 5 ký tự')
    .trim()
    .escape(),
  email: body('email')
    .isEmail()
    .withMessage('Email không hợp lệ!')
    .normalizeEmail({
      /* eslint-disable */
      gmail_remove_dots: false,
      gmail_remove_subaddress: false,
      /* eslint-enable */
    }),
  password: body('password')
    .not()
    .isEmpty()
    .withMessage('Vui lòng điền mật khẩu')
    .isLength({ min: 5 })
    .withMessage('Mật khẩu phải ít nhất 5 ký tự'),
  bio: body('bio')
    .trim()
    .escape(),
  image: body('image')
    .trim()
    .not()
    .isEmpty()
    .optional({ checkFalsy: true })
    .isURL(),
  middleWare: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      next(new ErrorsValidationResponse(errors, 400));
      return;
    }

    next();
  },
};

export const loginValidation = [validations.username, validations.password, validations.middleWare];

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });

  if (!user) {
    next(new ErrorResponse(401, 'Username or password is incorrect!'));
    return;
  }

  const isRightPassword = user.validatePassword(password);

  if (!isRightPassword) {
    next(new ErrorResponse(401, 'Username or password is incorrect!'));
    return;
  }
  const userInfo: UserExport = user.toObject();

  const token = await signJWT(userInfo);

  res.json({
    data: {
      ...userInfo,
      token,
    },
  });
}

export const registerValidation = [
  validations.username,
  validations.password,
  validations.email,
  validations.middleWare,
];

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { username, email, password } = req.body;
  const newUser = new UserModel({
    email,
    username,
  });

  try {
    newUser.setPassword(password);
    const user = await newUser.save();
    const userInfo: UserExport = user.toObject();
    const token = await signJWT(userInfo);

    res.json({
      data: {
        ...userInfo,
        token,
      },
    });
  } catch (err) {
    next(new ErrorResponse(400, err.message));
  }
}

/**
 * Get current user info
 * @param req
 * @param res
 */
export async function getCurrentUserInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id } = req.user;

  const user = await UserModel.findById(id);
  if (!user) {
    next(new ErrorResponse(404, 'Not found user'));
    return;
  }

  res.json({
    data: user.toObject(),
  });
}

export const updateCurrentUserValidation = [validations.bio, validations.image, validations.middleWare];

export async function updateCurrentUserInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { bio, image } = req.body;
  const { id } = req.user;

  const user = await UserModel.findById(id);
  if (!user) {
    next(new ErrorResponse(404, 'Not found user'));
    return;
  }

  try {
    if (bio) user.bio = bio;
    if (image) user.image = image;

    await user.save();

    res.json({
      data: user.toObject(),
    });
  } catch (err) {
    next(new ErrorResponse(400, err.message));
  }
}
