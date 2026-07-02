import { Router } from 'express';
import { jsonRoute } from './jsonRoute.js';

const router = Router();

router.post('/', jsonRoute(async (req, res) => {
  const { validateContact } = await import('../middleware/validateContact.js');
  const result = validateContact(req.body);

  if (!result.valid) {
    return res.status(400).json({ ok: false, errors: result.errors });
  }

  console.log('[contact]', {
    time: new Date().toISOString(),
    ...result.data,
  });

  res.json({ ok: true, message: 'Message received.' });
}));

export default router;
