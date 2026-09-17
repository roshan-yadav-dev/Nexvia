const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');

const TEST_MONGO_URI = process.env.TEST_MONGO_URI || 'mongodb://127.0.0.1:27017/shortlink_test';

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
});

describe('Auth System API (Module 2)', () => {
  const testUserData = {
    email: 'creator@nexvia.io',
    username: 'nexvia_creator',
    password: 'password123'
  };

  // Test 1: Signup flow
  it('1. should register a new user as unverified and return 201', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send(testUserData);

    expect(res.status).toBe(201);
    expect(res.body.message).toContain('Registration successful');
    expect(res.body.verificationToken).toBeDefined();

    const createdUser = await User.findOne({ email: testUserData.email });
    expect(createdUser).not.toBeNull();
    expect(createdUser.isVerified).toBe(false);
    expect(createdUser.username).toBe(testUserData.username);
  });

  // Test 2: Conflict on duplicate signup
  it('2. should reject duplicate email or username with 409 CONFLICT', async () => {
    await request(app).post('/api/auth/signup').send(testUserData);

    const duplicateRes = await request(app)
      .post('/api/auth/signup')
      .send(testUserData);

    expect(duplicateRes.status).toBe(409);
    expect(duplicateRes.body.error.code).toBe('CONFLICT');
  });

  // Test 3: Cannot login unverified
  it('3. should deny login if email is not yet verified (403 UNVERIFIED_EMAIL)', async () => {
    await request(app).post('/api/auth/signup').send(testUserData);

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: testUserData.email, password: testUserData.password });

    expect(loginRes.status).toBe(403);
    expect(loginRes.body.error.code).toBe('UNVERIFIED_EMAIL');
  });

  // Test 4: Verify email token
  it('4. should successfully verify email with valid token and allow subsequent login', async () => {
    const signupRes = await request(app)
      .post('/api/auth/signup')
      .send(testUserData);

    const token = signupRes.body.verificationToken;
    expect(token).toBeDefined();

    // Verify token
    const verifyRes = await request(app).get(`/api/auth/verify/${token}`);
    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.message).toContain('verified successfully');

    // Login after verification
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: testUserData.email, password: testUserData.password });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.accessToken).toBeDefined();
    expect(loginRes.body.user.username).toBe(testUserData.username);
    expect(loginRes.headers['set-cookie']).toBeDefined();
  });

  // Test 5: Protected route access with JWT
  it('5. should protect routes with requireAuth middleware (401 on missing or invalid token)', async () => {
    // Missing token
    const unauthedRes = await request(app).get('/api/auth/me');
    expect(unauthedRes.status).toBe(401);
    expect(unauthedRes.body.error.code).toBe('UNAUTHORIZED');

    // Sign up & verify
    const signupRes = await request(app).post('/api/auth/signup').send(testUserData);
    await request(app).get(`/api/auth/verify/${signupRes.body.verificationToken}`);

    // Login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: testUserData.email, password: testUserData.password });

    const token = loginRes.body.accessToken;

    // Authed request
    const authedRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(authedRes.status).toBe(200);
    expect(authedRes.body.user.email).toBe(testUserData.email);
  });

  // Test 6: Refresh token rotation and logout
  it('6. should rotate refresh tokens on /api/auth/refresh and clear cookie on /api/auth/logout', async () => {
    const signupRes = await request(app).post('/api/auth/signup').send(testUserData);
    await request(app).get(`/api/auth/verify/${signupRes.body.verificationToken}`);

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: testUserData.email, password: testUserData.password });

    const cookieHeader = loginRes.headers['set-cookie'][0];
    const rawCookie = cookieHeader.split(';')[0]; // refreshToken=...

    // Refresh token request
    const refreshRes = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', [rawCookie]);

    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body.accessToken).toBeDefined();
    expect(refreshRes.headers['set-cookie']).toBeDefined();

    const newCookieHeader = refreshRes.headers['set-cookie'][0];
    const newRawCookie = newCookieHeader.split(';')[0];

    // Logout
    const logoutRes = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', [newRawCookie]);

    expect(logoutRes.status).toBe(200);
    expect(logoutRes.body.message).toContain('Logged out');
  });

  // Test 7: Password reset flow
  it('7. should handle forgot-password and reset-password cleanly', async () => {
    const signupRes = await request(app).post('/api/auth/signup').send(testUserData);
    await request(app).get(`/api/auth/verify/${signupRes.body.verificationToken}`);

    const forgotRes = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: testUserData.email });

    expect(forgotRes.status).toBe(200);
    const resetToken = forgotRes.body.resetToken;
    expect(resetToken).toBeDefined();

    const resetRes = await request(app)
      .post('/api/auth/reset-password')
      .send({ token: resetToken, newPassword: 'brandNewPassword999' });

    expect(resetRes.status).toBe(200);

    // Verify login with new password
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: testUserData.email, password: 'brandNewPassword999' });

    expect(loginRes.status).toBe(200);
  });
});
