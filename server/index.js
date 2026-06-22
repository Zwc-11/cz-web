import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import corsMiddleware from './middleware/cors.js';
import profileRouter from './routes/profile.js';
import projectsRouter from './routes/projects.js';
import contactRouter from './routes/contact.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

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

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `\nPort ${PORT} is already in use.\n` +
        `Stop the other process (Task Manager or: npx kill-port ${PORT}) and run npm run dev again.\n`
    );
    process.exit(1);
  }
  throw err;
});

function shutdown() {
  server.close(() => process.exit(0));
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
