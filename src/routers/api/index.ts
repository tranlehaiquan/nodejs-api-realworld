import { Router } from 'express';
import user from './user';
import articles from './articles';
import tags from './tags';
import { validateError } from '../../middlewares/validateError';

const route = Router();

route.use('/user', user);
route.use('/articles', articles);
route.use('/tags', tags);
route.use(validateError);

export default route;