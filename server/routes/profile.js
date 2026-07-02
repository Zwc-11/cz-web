import { Router } from 'express';
import { jsonRoute } from './jsonRoute.js';

const router = Router();

router.get('/', jsonRoute(async (_req, res) => {
  const [
    { profile },
    { experience },
    { skills },
    { hackathons },
    { education },
    { awards },
  ] = await Promise.all([
    import('../data/profile.js'),
    import('../data/experience.js'),
    import('../data/skills.js'),
    import('../data/hackathons.js'),
    import('../data/education.js'),
    import('../data/awards.js'),
  ]);

  res.json({ ...profile, experience, skills, hackathons, education, awards });
}));

export default router;
