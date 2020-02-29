import { Router } from 'express';
import user from './user';
import articles from './articles';
import tags from './tags';
import profile from './profile';
import { middlewareExpressValidation, middlewareHandlerError } from '../../middlewares/validateError';

const route = Router();

route.use('/users', user);
route.use('/articles', articles);
route.use('/tags', tags);
route.use('/profiles', profile);
route.use(middlewareExpressValidation);
route.use(middlewareHandlerError);

export default route;