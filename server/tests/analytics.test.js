const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Link = require('../src/models/Link');
const Click = require('../src/models/Click');
const { generateAccessToken } = require('../src/utils/tokenService');

const TEST_MONGO_URI = process.env.TEST_MONGO_URI || 'mongodb://127.0.0.1:27017/shortlink_test';

let userA, userB, tokenA, tokenB, linkA;

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
    email: 'creator_a@nexvia.io',
    username: 'creator_a',
    passwordHash: 'dummyhash',
    isVerified: true
  });

  userB = await User.create({
    email: 'creator_b@nexvia.io',
    username: 'creator_b',
    passwordHash: 'dummyhash',
    isVerified: true
  });

  tokenA = generateAccessToken(userA);
  tokenB = generateAccessToken(userB);

  linkA = await Link.create({
    userId: userA._id,
    destinationUrl: 'https://campaign.io',
    shortCode: 'summer-sale',
    title: 'Summer Sale'
  });

  // Seed clicks with known distributions
  const seedClicks = [
    // 3 Mobile clicks from Twitter, IP 1
    { linkId: linkA._id, timestamp: new Date('2026-06-01T10:00:00Z'), referrer: 'https://twitter.com', deviceType: 'Mobile', ipHash: 'hash_1' },
    { linkId: linkA._id, timestamp: new Date('2026-06-01T11:00:00Z'), referrer: 'https://twitter.com', deviceType: 'Mobile', ipHash: 'hash_1' },
    { linkId: linkA._id, timestamp: new Date('2026-06-01T12:00:00Z'), referrer: 'https://twitter.com', deviceType: 'Mobile', ipHash: 'hash_2' },

    // 2 Desktop clicks from LinkedIn, IP 3
    { linkId: linkA._id, timestamp: new Date('2026-06-02T08:00:00Z'), referrer: 'https://linkedin.com', deviceType: 'Desktop', ipHash: 'hash_3' },
    { linkId: linkA._id, timestamp: new Date('2026-06-02T09:00:00Z'), referrer: 'https://linkedin.com', deviceType: 'Desktop', ipHash: 'hash_3' },

    // 1 Tablet click Direct, IP 4
    { linkId: linkA._id, timestamp: new Date('2026-06-02T10:00:00Z'), referrer: 'Direct / None', deviceType: 'Tablet', ipHash: 'hash_4' }
  ];

  await Click.insertMany(seedClicks);
});

describe('Click Analytics Engine (Module 4)', () => {
  it('1. should calculate exact total clicks and unique visitors for a link', async () => {
    const res = await request(app)
      .get(`/api/analytics/${linkA._id}`)
      .set('Authorization', `Bearer ${tokenA}`);

    expect(res.status).toBe(200);
    expect(res.body.metrics.totalClicks).toBe(6);
    expect(res.body.metrics.uniqueVisitors).toBe(4); // hash_1, hash_2, hash_3, hash_4
  });

  it('2. should aggregate clicks-over-time into correct daily buckets', async () => {
    const res = await request(app)
      .get(`/api/analytics/${linkA._id}`)
      .set('Authorization', `Bearer ${tokenA}`);

    expect(res.status).toBe(200);
    expect(res.body.clicksOverTime).toHaveLength(2);
    expect(res.body.clicksOverTime[0]).toEqual({ date: '2026-06-01', clicks: 3 });
    expect(res.body.clicksOverTime[1]).toEqual({ date: '2026-06-02', clicks: 3 });
  });

  it('3. should aggregate top referrers in descending order of volume', async () => {
    const res = await request(app)
      .get(`/api/analytics/${linkA._id}`)
      .set('Authorization', `Bearer ${tokenA}`);

    expect(res.status).toBe(200);
    expect(res.body.topReferrers).toHaveLength(3);
    expect(res.body.topReferrers[0]).toEqual({ referrer: 'https://twitter.com', count: 3 });
    expect(res.body.topReferrers[1]).toEqual({ referrer: 'https://linkedin.com', count: 2 });
    expect(res.body.topReferrers[2]).toEqual({ referrer: 'Direct / None', count: 1 });
  });

  it('4. should aggregate device distribution correctly', async () => {
    const res = await request(app)
      .get(`/api/analytics/${linkA._id}`)
      .set('Authorization', `Bearer ${tokenA}`);

    expect(res.status).toBe(200);
    const devices = res.body.deviceDistribution;
    expect(devices).toHaveLength(3);

    const mobileEntry = devices.find(d => d.device === 'Mobile');
    const desktopEntry = devices.find(d => d.device === 'Desktop');
    const tabletEntry = devices.find(d => d.device === 'Tablet');

    expect(mobileEntry.count).toBe(3);
    expect(desktopEntry.count).toBe(2);
    expect(tabletEntry.count).toBe(1);
  });

  it('5. should deny access to analytics for links owned by another user', async () => {
    const res = await request(app)
      .get(`/api/analytics/${linkA._id}`)
      .set('Authorization', `Bearer ${tokenB}`);

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('6. should return aggregated user overview analytics on GET /api/analytics/overview', async () => {
    const res = await request(app)
      .get('/api/analytics/overview')
      .set('Authorization', `Bearer ${tokenA}`);

    expect(res.status).toBe(200);
    expect(res.body.totalLinks).toBe(1);
    expect(res.body.totalClicks).toBe(6);
    expect(res.body.uniqueVisitors).toBe(4);
    expect(res.body.topLinks).toHaveLength(1);
    expect(res.body.topLinks[0].shortCode).toBe('summer-sale');
  });
});
