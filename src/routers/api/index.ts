import { Router } from 'express';
import user from './user';
import articles from './articles';
import tags from './tags';
import profile from './profile';
import { validateError, handlerError } from '../../middlewares/validateError';

const route = Router();

route.use('/users', user);
route.use('/articles', articles);
route.use('/tags', tags);
route.use('/profiles', profile);
route.use(validateError);
route.use(handlerError);

export default route;