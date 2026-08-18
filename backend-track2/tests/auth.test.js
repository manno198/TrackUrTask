const { test, before, beforeEach, after } = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');
const request = require('supertest');

const { sequelize, resetDb } = require('./setup');
const app = require('../src/app');
const { User } = require('../src/models');

before(async () => {
  await resetDb();
});

beforeEach(async () => {
  await User.destroy({ where: {} });
  await User.create({ email: 'admin@company.com', password: await bcrypt.hash('admin123', 10) });
});

after(async () => {
  await sequelize.close();
});

test('login succeeds with correct credentials', async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@company.com', password: 'admin123' });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.ok(res.body.token);
});

test('login fails with wrong password', async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@company.com', password: 'wrong-password' });

  assert.equal(res.status, 401);
  assert.equal(res.body.success, false);
});

test('login fails with unknown email', async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'nobody@company.com', password: 'admin123' });

  assert.equal(res.status, 401);
});

test('login fails with missing fields and returns field-level errors', async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@company.com' });

  assert.equal(res.status, 400);
  assert.equal(res.body.success, false);
  assert.ok(Array.isArray(res.body.errors));
  assert.equal(res.body.errors[0].field, 'password');
});

test('protected route rejects a request with no token', async () => {
  const res = await request(app)
    .post('/api/employees')
    .send({ name: 'X', role: 'Y', email: 'x@y.com' });

  assert.equal(res.status, 401);
});

test('protected route rejects a garbage token', async () => {
  const res = await request(app)
    .post('/api/employees')
    .set('Authorization', 'Bearer not-a-real-token')
    .send({ name: 'X', role: 'Y', email: 'x@y.com' });

  assert.equal(res.status, 401);
});

test('protected route accepts a valid token from login', async () => {
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@company.com', password: 'admin123' });

  const res = await request(app)
    .post('/api/employees')
    .set('Authorization', `Bearer ${loginRes.body.token}`)
    .send({ name: 'Auth Test', role: 'QA', email: 'authtest@company.com' });

  assert.equal(res.status, 201);
  assert.equal(res.body.data.email, 'authtest@company.com');
});
