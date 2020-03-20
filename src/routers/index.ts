import { Router } from 'express';
import home from './home';
import api from './api';

const router = Router();

router.use('/', home);
router.use('/api', api);

export default router;
