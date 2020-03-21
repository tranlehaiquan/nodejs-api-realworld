import { Router } from 'express';
import {
  login,
  registerValidation,
  register,
  getCurrentUserInfo,
  updateCurrentUserInfo,
  loginValidation,
  updateCurrentUserValidation,
} from '../../controllers/user';
import { AuthRequired } from '../../middlewares/jwt';

const route = Router();

// api/auth/
route.get('/', AuthRequired, getCurrentUserInfo);
route.put('/', AuthRequired, updateCurrentUserValidation, updateCurrentUserInfo);
route.post('/login', loginValidation, login);
route.post('/register', registerValidation, register);

export default route;
