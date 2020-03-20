import { Router } from 'express';
import { getTags } from '../../controllers/tag';

const route = Router();

// api/user/
route.get('/', getTags);

export default route;
