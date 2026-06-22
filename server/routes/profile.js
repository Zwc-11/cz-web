import { Router } from 'express';
import { profile } from '../data/profile.js';
import { experience } from '../data/experience.js';
import { skills } from '../data/skills.js';
import { hackathons } from '../data/hackathons.js';
import { education } from '../data/education.js';
import { awards } from '../data/awards.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ ...profile, experience, skills, hackathons, education, awards });
});

export default router;
