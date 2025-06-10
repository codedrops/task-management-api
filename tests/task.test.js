import supertest from 'supertest';
import app from '../src/index.js';
import sequelize from '../src/config/database.js';
import User from '../src/models/user.js';
import Task from '../src/models/task.js';

describe('Task API', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    await User.create({
      keycloakId: 'test-user',
      email: 'test@example.com',
      role: 'user',
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should create a task', async () => {
    const response = await supertest(app)
      .post('/tasks')
      .set('Authorization', 'Bearer mock-jwt-token')
      .send({
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending',
        notes: 'Test Notes',
      });
    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Test Task');
  });
});