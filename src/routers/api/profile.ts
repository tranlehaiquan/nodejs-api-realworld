import { Router } from 'express';
import { getProfile, followProfile, unFollowProfile, paramProfile } from '../../controllers/profile';
import { AuthRequired, AuthOptional } from '../../middlewares/jwt';

const route = Router();

// api/profiles/
route.get('/:username', AuthOptional, getProfile);
route.param('username', paramProfile);
route.post('/:username/follow', AuthRequired, followProfile);
route.delete('/:username/follow', AuthRequired, unFollowProfile);

export default route;
