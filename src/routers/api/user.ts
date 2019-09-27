import { Router } from 'express';
import { login, registerValidation ,register, getCurrentUserInfo, updateCurrentUserInfo, loginValidation, updateCurrentUserValidation } from '../../controllers/user';
import { authenticate } from '../../middlewares/jwt';

const route = Router();

// api/user/
route.get('/getUserInfo', authenticate, getCurrentUserInfo);
route.put('/updateUserInfo', authenticate, updateCurrentUserValidation, updateCurrentUserInfo);
route.post('/login', loginValidation, login);
route.post('/register', registerValidation, register);

export default route;