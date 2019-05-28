import { Router } from 'express';
import user from './user';

const route = Router();

route.use('/user', user);

export default route;