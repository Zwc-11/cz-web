import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app.js';

test('GET /api/projects returns a non-empty project array', async () => {
  const res = await request(app)
    .get('/api/projects')
    .expect('Content-Type', /json/)
    .expect(200);

  assert.ok(Array.isArray(res.body));
  assert.ok(res.body.length > 0);
});
