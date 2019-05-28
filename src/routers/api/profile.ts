import { Router } from 'express';

const route = Router();

// api/profiles/
route.get('/:username', () => {});
route.post('/:username/follow', () => {});
route.delete('/:username/follow', () => {});
route.delete('/:username/follow', () => {});

export default route;