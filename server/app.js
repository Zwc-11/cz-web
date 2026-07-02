import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import corsMiddleware from './middleware/cors.js';
import profileRouter from './routes/profile.js';
import projectsRouter from './routes/projects.js';
import contactRouter from './routes/contact.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(corsMiddleware);
app.use(express.json({ limit: '32kb' }));

app.use('/api/profile', profileRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/contact', contactRouter);

const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(publicDir, 'index.html'), (err) => {
    if (err) res.status(404).json({ error: 'Not found' });
  });
});

export default app;
