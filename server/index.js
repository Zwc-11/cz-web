import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const app = express()
const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'public')
const port = Number(process.env.PORT) || 3001

app.disable('x-powered-by')
app.use(express.static(publicDir))
app.get('/healthz', (_request, response) => response.json({ ok: true }))
app.use('/api', (_request, response) => response.status(404).json({ error: 'No API is available on this static portfolio.' }))
app.get('*', (_request, response) => response.sendFile(path.join(publicDir, 'index.html')))

app.listen(port, '0.0.0.0', () => console.log(`Portfolio available on port ${port}`))
