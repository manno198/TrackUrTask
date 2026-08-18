const { test, before, beforeEach, after } = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');
const request = require('supertest');

const { sequelize, resetDb } = require('./setup');
const app = require('../src/app');
const { User, Employee, Task } = require('../src/models');

let token;
let employeeA;
let employeeB;

before(async () => {
  await resetDb();
});

beforeEach(async () => {
  await Task.destroy({ where: {} });
  await Employee.destroy({ where: {} });
  await User.destroy({ where: {} });

  await User.create({ email: 'admin@company.com', password: await bcrypt.hash('admin123', 10) });
  employeeA = await Employee.create({ name: 'Ada Lovelace', role: 'Engineer', email: 'ada@company.com' });
  employeeB = await Employee.create({ name: 'Bo Jackson', role: 'Designer', email: 'bo@company.com' });

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@company.com', password: 'admin123' });
  token = loginRes.body.token;

  await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({
    title: 'Task one', employeeId: employeeA.id, status: 'Pending', priority: 'High',
  });
  await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({
    title: 'Task two', employeeId: employeeA.id, status: 'Completed', priority: 'Low',
  });
  await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send({
    title: 'Task three', employeeId: employeeB.id, status: 'In Progress', priority: 'Medium',
  });
});

after(async () => {
  await sequelize.close();
});

test('dashboard stats reflect real counts from the database', async () => {
  const res = await request(app).get('/api/stats/dashboard');

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);

  const { data } = res.body;
  assert.equal(data.totalEmployees, 2);
  assert.equal(data.totalTasks, 3);
  assert.deepEqual(data.tasksByStatus, { Pending: 1, 'In Progress': 1, Completed: 1 });
  assert.deepEqual(data.tasksByPriority, { Low: 1, Medium: 1, High: 1 });
  assert.equal(data.recentTasks.length, 3);

  const workloadA = data.employeeWorkload.find((w) => w.employeeId === employeeA.id);
  assert.deepEqual(workloadA, {
    employeeId: employeeA.id,
    name: 'Ada Lovelace',
    role: 'Engineer',
    total: 2,
    pending: 1,
    inProgress: 0,
    completed: 1,
  });

  const workloadB = data.employeeWorkload.find((w) => w.employeeId === employeeB.id);
  assert.equal(workloadB.total, 1);
  assert.equal(workloadB.inProgress, 1);
});

test('dashboard stats reports zeros when there is no data', async () => {
  await Task.destroy({ where: {} });
  await Employee.destroy({ where: {} });

  const res = await request(app).get('/api/stats/dashboard');

  assert.equal(res.status, 200);
  assert.equal(res.body.data.totalEmployees, 0);
  assert.equal(res.body.data.totalTasks, 0);
  assert.deepEqual(res.body.data.tasksByStatus, { Pending: 0, 'In Progress': 0, Completed: 0 });
  assert.deepEqual(res.body.data.employeeWorkload, []);
});
