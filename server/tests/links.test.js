const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Link = require('../src/models/Link');
const Click = require('../src/models/Click');
const { generateAccessToken } = require('../src/utils/tokenService');

const TEST_MONGO_URI = process.env.TEST_MONGO_URI || 'mongodb://127.0.0.1:27017/shortlink_test';

let userA, userB, tokenA, tokenB;

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
  await Link.deleteMany({});
  await Click.deleteMany({});

  userA = await User.create({
    email: 'usera@nexvia.io',
    username: 'user_a',
    passwordHash: 'dummyhash',
    isVerified: true
  });

  userB = await User.create({
    email: 'userb@nexvia.io',
    username: 'user_b',
    passwordHash: 'dummyhash',
    isVerified: true
  });

  tokenA = generateAccessToken(userA);
  tokenB = generateAccessToken(userB);
});

describe('Link Redirection Engine (Module 3)', () => {
  it('1. should create a short link with auto-generated 6-char slug', async () => {
    const res = await request(app)
      .post('/api/links')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        destinationUrl: 'google.com',
        title: 'Google Homepage'
      });

    expect(res.status).toBe(201);
    expect(res.body.link.destinationUrl).toBe('https://google.com');
    expect(res.body.link.shortCode).toHaveLength(6);
    expect(res.body.link.isCustomAlias).toBe(false);
  });

  it('2. should create a short link with custom vanity slug', async () => {
    const res = await request(app)
      .post('/api/links')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        destinationUrl: 'https://github.com/facebook/react',
        customAlias: 'react-repo',
        title: 'React GitHub'
      });

    expect(res.status).toBe(201);
    expect(res.body.link.shortCode).toBe('react-repo');
    expect(res.body.link.isCustomAlias).toBe(true);
  });

  it('3. should reject duplicate custom slug with 409 CONFLICT', async () => {
    await request(app)
      .post('/api/links')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        destinationUrl: 'https://site-a.com',
        customAlias: 'my-brand'
      });

    const duplicateRes = await request(app)
      .post('/api/links')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({
        destinationUrl: 'https://site-b.com',
        customAlias: 'my-brand'
      });

    expect(duplicateRes.status).toBe(409);
    expect(duplicateRes.body.error.code).toBe('CONFLICT');
  });

  it('4. should reject reserved slugs with 400 RESERVED_SLUG', async () => {
    const res = await request(app)
      .post('/api/links')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        destinationUrl: 'https://example.com',
        customAlias: 'dashboard'
      });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('RESERVED_SLUG');
  });

  it('5. should redirect /r/:shortCode immediately with 302 and log click asynchronously', async () => {
    const createRes = await request(app)
      .post('/api/links')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        destinationUrl: 'https://nexvia.io/docs',
        customAlias: 'docs'
      });

    expect(createRes.status).toBe(201);

    // Hit public redirect
    const redirectRes = await request(app)
      .get('/r/docs')
      .set('User-Agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)')
      .set('Referer', 'https://twitter.com');

    expect(redirectRes.status).toBe(302);
    expect(redirectRes.headers.location).toBe('https://nexvia.io/docs');

    // Wait a brief tick for async setImmediate click write
    await new Promise(r => setTimeout(r, 100));

    const loggedClicks = await Click.find({ linkId: createRes.body.link._id });
    expect(loggedClicks).toHaveLength(1);
    expect(loggedClicks[0].deviceType).toBe('Mobile');
    expect(loggedClicks[0].referrer).toBe('https://twitter.com');
    expect(loggedClicks[0].ipHash).toBeDefined();
  });

  it('6. should return 404 for nonexistent or inactive links', async () => {
    const notFoundRes = await request(app).get('/r/unknown123');
    expect(notFoundRes.status).toBe(404);

    // Create inactive link
    const link = await Link.create({
      userId: userA._id,
      destinationUrl: 'https://example.com',
      shortCode: 'disabled-link',
      isActive: false
    });

    const inactiveRes = await request(app).get('/r/disabled-link');
    expect(inactiveRes.status).toBe(404);
  });

  it('7. should paginate and search user links on GET /api/links', async () => {
    for (let i = 1; i <= 15; i++) {
      await Link.create({
        userId: userA._id,
        destinationUrl: `https://site${i}.com`,
        shortCode: `code${i}`,
        title: `Site Number ${i}`
      });
    }

    const page1Res = await request(app)
      .get('/api/links?page=1&limit=10')
      .set('Authorization', `Bearer ${tokenA}`);

    expect(page1Res.status).toBe(200);
    expect(page1Res.body.links).toHaveLength(10);
    expect(page1Res.body.pagination.totalCount).toBe(15);
    expect(page1Res.body.pagination.totalPages).toBe(2);

    const searchRes = await request(app)
      .get('/api/links?search=Site Number 12')
      .set('Authorization', `Bearer ${tokenA}`);

    expect(searchRes.status).toBe(200);
    expect(searchRes.body.links).toHaveLength(1);
    expect(searchRes.body.links[0].shortCode).toBe('code12');
  });

  it('8. should enforce ownership when deleting links (404/denied for other users)', async () => {
    const linkA = await Link.create({
      userId: userA._id,
      destinationUrl: 'https://userA.com',
      shortCode: 'link-a'
    });

    // User B attempts to delete User A's link
    const unauthorizedDelete = await request(app)
      .delete(`/api/links/${linkA._id}`)
      .set('Authorization', `Bearer ${tokenB}`);

    expect(unauthorizedDelete.status).toBe(404);

    // User A deletes own link
    const authorizedDelete = await request(app)
      .delete(`/api/links/${linkA._id}`)
      .set('Authorization', `Bearer ${tokenA}`);

    expect(authorizedDelete.status).toBe(200);
    expect(authorizedDelete.body.message).toContain('deleted successfully');
  });

  it('9. should update link destination and title via PATCH /api/links/:id', async () => {
    const link = await Link.create({
      userId: userA._id,
      destinationUrl: 'https://initial.com',
      shortCode: 'edit-me',
      title: 'Initial Title'
    });

    const res = await request(app)
      .patch(`/api/links/${link._id}`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        destinationUrl: 'https://updated.com',
        title: 'Updated Title'
      });

    expect(res.status).toBe(200);
    expect(res.body.link.destinationUrl).toBe('https://updated.com');
    expect(res.body.link.title).toBe('Updated Title');
  });
});
