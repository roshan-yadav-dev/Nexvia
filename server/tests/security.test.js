const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const { generateAccessToken } = require('../src/utils/tokenService');

const TEST_MONGO_URI = process.env.TEST_MONGO_URI || 'mongodb://127.0.0.1:27017/shortlink_test';

let user, token;

beforeAll(async () => {
  process.env.JWT_ACCESS_SECRET = 'test_access_secret_1234567890123456';
  process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_1234567890123456';
  process.env.NODE_ENV = 'test';
  await mongoose.connect(TEST_MONGO_URI);
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  }
});

beforeEach(async () => {
  await User.deleteMany({});
  user = await User.create({
    email: 'sec_user@nexvia.io',
    username: 'sec_user',
    passwordHash: 'dummyhash',
    isVerified: true
  });
  token = generateAccessToken(user);
});

describe('Security Hardening Pass (Module 7)', () => {
  // Test 1: Helmet security headers
  it('1. should include Helmet security headers in responses', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['x-dns-prefetch-control']).toBe('off');
    expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });

  // Test 2: Malformed input on /api/auth/signup returns 400
  it('2. should reject malformed /api/auth/signup payloads with 400 VALIDATION_ERROR', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'invalid-email',
        username: 'ab', // too short (< 3)
        password: '123' // too short (< 6)
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.details).toBeDefined();
  });

  // Test 3: Malformed input on /api/auth/login returns 400
  it('3. should reject missing fields on /api/auth/login with 400 VALIDATION_ERROR', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  // Test 4: Malformed input on POST /api/links returns 400
  it('4. should reject missing destinationUrl on /api/links with 400 VALIDATION_ERROR', async () => {
    const res = await request(app)
      .post('/api/links')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  // Test 5: Malformed customAlias on POST /api/links returns 400
  it('5. should reject illegal characters in customAlias on /api/links with 400 VALIDATION_ERROR', async () => {
    const res = await request(app)
      .post('/api/links')
      .set('Authorization', `Bearer ${token}`)
      .send({
        destinationUrl: 'https://valid.com',
        customAlias: 'invalid slug with spaces!@#'
      });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  // Test 6: Malformed input on POST /api/bio returns 400
  it('6. should reject invalid theme on /api/bio with 400 VALIDATION_ERROR', async () => {
    const res = await request(app)
      .post('/api/bio')
      .set('Authorization', `Bearer ${token}`)
      .send({
        displayName: 'Test User',
        theme: 'hacked_theme'
      });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  // Test 7: Nonexistent routes return standardized 404
  it('7. should return standardized JSON error for unknown routes', async () => {
    const res = await request(app).get('/api/completely-nonexistent-endpoint');
    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});
