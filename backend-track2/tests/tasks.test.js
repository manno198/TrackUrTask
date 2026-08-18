const { test, before, beforeEach, after } = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');
const request = require('supertest');

const { sequelize, resetDb } = require('./setup');
const app = require('../src/app');
const { User, Employee, Task } = require('../src/models');

let token;
let employee;

before(async () => {
  await resetDb();
});

beforeEach(async () => {
  await Task.destroy({ where: {} });
  await Employee.destroy({ where: {} });
  await User.destroy({ where: {} });

  await User.create({ email: 'admin@company.com', password: await bcrypt.hash('admin123', 10) });
  employee = await Employee.create({
    name: 'Test Employee',
    role: 'Engineer',
    email: 'test.employee@company.com',
  });

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@company.com', password: 'admin123' });
  token = loginRes.body.token;
});

after(async () => {
  await sequelize.close();
});

test('rejects task creation without auth', async () => {
  const res = await request(app)
    .post('/api/tasks')
    .send({ title: 'No auth task', employeeId: employee.id });

  assert.equal(res.status, 401);
});

test('rejects task creation with a too-short title', async () => {
  const res = await request(app)
    .post('/api/tasks')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Hi', employeeId: employee.id });

  assert.equal(res.status, 400);
  assert.equal(res.body.errors[0].field, 'title');
});

test('rejects task creation for an unknown employee', async () => {
  const res = await request(app)
    .post('/api/tasks')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Ghost task', employeeId: 999999 });

  assert.equal(res.status, 404);
});

test('creates a task when authenticated with valid data', async () => {
  const res = await request(app)
    .post('/api/tasks')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Write tests', employeeId: employee.id, priority: 'High' });

  assert.equal(res.status, 201);
  assert.equal(res.body.data.title, 'Write tests');
  assert.equal(res.body.data.priority, 'High');
  assert.equal(res.body.data.employee.id, employee.id);
});

test('updates a task status and the change persists on re-fetch', async () => {
  const createRes = await request(app)
    .post('/api/tasks')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Status flow task', employeeId: employee.id });
  const taskId = createRes.body.data.id;

  const updateRes = await request(app)
    .put(`/api/tasks/${taskId}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ status: 'Completed' });
  assert.equal(updateRes.status, 200);
  assert.equal(updateRes.body.data.status, 'Completed');

  const getRes = await request(app).get(`/api/tasks/${taskId}`);
  assert.equal(getRes.body.data.status, 'Completed');
});

test('deletes a task and it 404s afterward', async () => {
  const createRes = await request(app)
    .post('/api/tasks')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Delete me task', employeeId: employee.id });
  const taskId = createRes.body.data.id;

  const deleteRes = await request(app)
    .delete(`/api/tasks/${taskId}`)
    .set('Authorization', `Bearer ${token}`);
  assert.equal(deleteRes.status, 200);

  const getRes = await request(app).get(`/api/tasks/${taskId}`);
  assert.equal(getRes.status, 404);
});

test('filters tasks by status', async () => {
  await request(app)
    .post('/api/tasks')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Pending task one', employeeId: employee.id, status: 'Pending' });
  await request(app)
    .post('/api/tasks')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Completed task one', employeeId: employee.id, status: 'Completed' });

  const res = await request(app).get('/api/tasks').query({ status: 'Completed' });

  assert.equal(res.status, 200);
  assert.ok(res.body.data.length > 0);
  assert.ok(res.body.data.every((t) => t.status === 'Completed'));
});

test('deleting an employee cascades and deletes their tasks', async () => {
  const createRes = await request(app)
    .post('/api/tasks')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Cascade check task', employeeId: employee.id });
  const taskId = createRes.body.data.id;

  const deleteRes = await request(app)
    .delete(`/api/employees/${employee.id}`)
    .set('Authorization', `Bearer ${token}`);
  assert.equal(deleteRes.status, 200);

  const getRes = await request(app).get(`/api/tasks/${taskId}`);
  assert.equal(getRes.status, 404);
});
