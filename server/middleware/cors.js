import cors from 'cors';

const corsMiddleware = cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST'],
});

export default corsMiddleware;
