import request from 'supertest';
import { app } from '../src/app';
import mongoose from 'mongoose';
import User from '../src/models/user.model';

let authToken = '';

beforeAll(async () => {
  // Connect to a test database
  process.env.TEST= true
  // Create a test user and generate a token
  const user = await User.create({ email: 'test@example.com', password: 'password123' });
  authToken = await user.generateToken();
  user.token = authToken;
  await user.save();
});

afterAll(async () => {
  // Clean up test database
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('Auth Endpoints', () => {
  it('should sign up a user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({ email: 'newuser@example.com', password: 'password123' });

    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe('User created successfully');
  });

  it('should log in a user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('User logged in successfully');
    expect(res.headers['set-cookie']).toBeDefined();
  });
});

describe('Queue Endpoints', () => {
  it('should enqueue task A', async () => {
    const res = await request(app)
      .get('/api/v1/enqueue/dotaska')
      .set('Cookie', `token=${authToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Task A added to queue');
  });

  it('should enqueue task B', async () => {
    const res = await request(app)
      .get('/api/v1/enqueue/dotaskb')
      .set('Cookie', `token=${authToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Task B added to queue');
  });

  it('should enqueue task C', async () => {
    const res = await request(app)
      .get('/api/v1/enqueue/dotaskc')
      .set('Cookie', `token=${authToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Task C added to queue');
  });
});

describe('Metrics Endpoint', () => {
  it('should return metrics', async () => {
    const res = await request(app)
      .get('/api/v1/metrics')
      .set('metricspass', process.env.METRICS_PASSWORD);

    expect(res.statusCode).toEqual(200);
    expect(res.headers['content-type']).toContain('text/plain');
  });

  it('should return unauthorized if metrics password is incorrect', async () => {
    const res = await request(app)
      .get('/api/v1/metrics')
      .set('metricspass', 'wrongpassword');

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe('Unauthorized');
  });
});
