import { Router } from 'express';
import { validateContact } from '../middleware/validateContact.js';

const router = Router();

router.post('/', (req, res) => {
  const result = validateContact(req.body);

  if (!result.valid) {
    return res.status(400).json({ ok: false, errors: result.errors });
  }

  console.log('[contact]', {
    time: new Date().toISOString(),
    ...result.data,
  });

  res.json({ ok: true, message: 'Message received.' });
});

export default router;
