import { Router } from 'express';
import user from './user';
import articles from './articles';
import tags from './tags';
import profile from './profile';
import { validateError } from '../../middlewares/validateError';

const route = Router();

route.use('/auth', user);
route.use('/articles', articles);
route.use('/tags', tags);
route.use('/profiles', profile);
route.use(validateError);

export default route;