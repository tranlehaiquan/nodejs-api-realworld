import { Router } from 'express';
import { login, register, getCurrentUserInfo, updateCurrentUserInfo } from '../../controllers/user';

const route = Router();

// api/user/
route.get('/', getCurrentUserInfo);
route.post('/', updateCurrentUserInfo);
route.post('/login', login);
route.post('/registers', register);

export default route;