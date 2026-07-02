import { Router } from 'express';
import { jsonRoute } from './jsonRoute.js';

const router = Router();

router.get('/', jsonRoute(async (_req, res) => {
  const { projects } = await import('../data/projects.js');
  res.json(projects);
}));

export default router;
