import {
  Router
} from 'express';
import {
  login,
  registerValidation,
  register,
  getCurrentUserInfo,
  updateCurrentUserInfo,
  loginValidation,
  updateCurrentUserValidation
} from '../../controllers/user';
import {
  AuthRequired,
} from '../../middlewares/jwt';

const route = Router();

// api/user/
route.get('/getUserInfo', AuthRequired, getCurrentUserInfo);
route.put('/updateUserInfo', AuthRequired, updateCurrentUserValidation, updateCurrentUserInfo);
route.post('/login', loginValidation, login);
route.post('/register', registerValidation, register);

export default route;