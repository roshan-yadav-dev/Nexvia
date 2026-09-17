const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const BioProfile = require('../src/models/BioProfile');
const { generateAccessToken } = require('../src/utils/tokenService');

const TEST_MONGO_URI = process.env.TEST_MONGO_URI || 'mongodb://127.0.0.1:27017/shortlink_test';

let userA, tokenA;

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
  await BioProfile.deleteMany({});

  userA = await User.create({
    email: 'sarah@nexvia.io',
    username: 'sarah_creator',
    passwordHash: 'dummyhash',
    isVerified: true
  });

  tokenA = generateAccessToken(userA);
});

describe('Bio-Link Hub (Module 6)', () => {
  it('1. should return default profile structure on GET /api/bio/me when uncreated', async () => {
    const res = await request(app)
      .get('/api/bio/me')
      .set('Authorization', `Bearer ${tokenA}`);

    expect(res.status).toBe(200);
    expect(res.body.profile.username).toBe('sarah_creator');
    expect(res.body.profile.theme).toBe('dark-slate');
    expect(res.body.profile.socialLinks).toEqual([]);
  });

  it('2. should create/update bio profile via POST /api/bio', async () => {
    const payload = {
      displayName: 'Sarah Jenkins',
      bio: 'Building AI tools for modern creators.',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      theme: 'gradient',
      socialLinks: [
        { platform: 'Twitter', title: 'Follow on X', url: 'twitter.com/sarah', order: 0 },
        { platform: 'GitHub', title: 'Open Source', url: 'https://github.com/sarah', order: 1 }
      ]
    };

    const res = await request(app)
      .post('/api/bio')
      .set('Authorization', `Bearer ${tokenA}`)
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body.profile.displayName).toBe('Sarah Jenkins');
    expect(res.body.profile.theme).toBe('gradient');
    expect(res.body.profile.socialLinks).toHaveLength(2);
    expect(res.body.profile.socialLinks[0].url).toBe('https://twitter.com/sarah');
  });

  it('3. should reject invalid themes with 400 VALIDATION_ERROR', async () => {
    const res = await request(app)
      .post('/api/bio')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        displayName: 'Sarah',
        theme: 'unsupported-theme'
      });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('4. should allow public access to /api/bio/:username without authentication', async () => {
    await BioProfile.create({
      userId: userA._id,
      username: 'sarah_creator',
      displayName: 'Sarah Jenkins',
      bio: 'Growth lead at Nexvia',
      theme: 'minimal-light',
      socialLinks: [
        { platform: 'Website', title: 'Portfolio', url: 'https://sarah.design', order: 0 }
      ]
    });

    const res = await request(app).get('/api/bio/sarah_creator');

    expect(res.status).toBe(200);
    expect(res.body.profile.displayName).toBe('Sarah Jenkins');
    expect(res.body.profile.theme).toBe('minimal-light');
    expect(res.body.profile.socialLinks).toHaveLength(1);
  });

  it('5. should return a clean 404 for unknown bio usernames', async () => {
    const res = await request(app).get('/api/bio/nonexistent_user_999');

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
    expect(res.body.error.message).toContain('does not exist');
  });

  it('6. should save and return projects (Selected Work) and experience', async () => {
    const payload = {
      displayName: 'Sarah Jenkins',
      headline: 'Product Designer & Architect',
      projects: [
        { title: 'Project One', description: 'AI platform', year: '2026', technologies: ['React', 'Node'], url: 'https://project1.com' }
      ],
      experience: [
        { company: 'Acme Corp', role: 'Staff Designer', year: '2024 - Present' }
      ]
    };

    const res = await request(app)
      .post('/api/bio')
      .set('Authorization', `Bearer ${tokenA}`)
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body.profile.projects).toHaveLength(1);
    expect(res.body.profile.projects[0].title).toBe('Project One');
    expect(res.body.profile.experience).toHaveLength(1);
    expect(res.body.profile.experience[0].company).toBe('Acme Corp');
  });
});
