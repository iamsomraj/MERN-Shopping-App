import { beforeEach, describe, expect, it } from 'vitest';
import { ADMIN, CUSTOMER, SEED_PASSWORD, api, login, randomPassword, seed } from './helpers.js';

const loginStatus = async (email: string, password: string) =>
  (await api().post('/api/users/login').send({ email, password })).status;

describe('auth', () => {
  beforeEach(seed);

  it('logs in with valid credentials', async () => {
    const res = await api().post('/api/users/login').send({ email: ADMIN, password: SEED_PASSWORD }).expect(200);
    expect(res.body).toMatchObject({ email: ADMIN, isAdmin: true });
    expect(res.body.token).toEqual(expect.any(String));
  });

  it('rejects a wrong password', async () => {
    const res = await api().post('/api/users/login').send({ email: ADMIN, password: randomPassword() }).expect(401);
    expect(res.body.message).toBe('Invalid Email Address or Password');
  });

  it('returns 401 (instead of hanging) when no token is sent', async () => {
    const res = await api().get('/api/users/profile').expect(401);
    expect(res.body.message).toBe('Unauthorized User Access');
  });

  it('returns 401 for an invalid token', async () => {
    await api().get('/api/users/profile').set('Authorization', 'Bearer garbage').expect(401);
  });

  it('blocks non-admins from admin routes', async () => {
    const token = await login(CUSTOMER);
    const res = await api().get('/api/users').set('Authorization', `Bearer ${token}`).expect(401);
    expect(res.body.message).toBe('Unauthorized Admin Access');
  });

  it('registers a user without letting them self-assign admin', async () => {
    const newUser = { name: 'New', email: 'new@example.com', password: randomPassword() };
    const res = await api()
      .post('/api/users')
      .send({ ...newUser, isAdmin: true })
      .expect(201);
    expect(res.body.isAdmin).toBe(false);
    await api().post('/api/users').send(newUser).expect(400);
  });
});

describe('profile', () => {
  beforeEach(seed);

  it('updates the name without corrupting email or password', async () => {
    const token = await login(CUSTOMER);
    const res = await api()
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'John Updated' })
      .expect(201);
    expect(res.body).toMatchObject({ name: 'John Updated', email: CUSTOMER });

    // Saving again must not re-hash the stored hash, so the old password still works.
    expect(await loginStatus(CUSTOMER, SEED_PASSWORD)).toBe(200);
  });

  it('changes the password', async () => {
    const token = await login(CUSTOMER);
    const newPassword = randomPassword();
    await api()
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ password: newPassword })
      .expect(201);
    expect(await loginStatus(CUSTOMER, newPassword)).toBe(200);
    expect(await loginStatus(CUSTOMER, SEED_PASSWORD)).toBe(401);
  });
});

describe('admin users', () => {
  beforeEach(seed);

  it('lists, updates and deletes users', async () => {
    const token = await login(ADMIN);
    const auth = { Authorization: `Bearer ${token}` };
    const list = await api().get('/api/users').set(auth).expect(200);
    const target = list.body.find((u: { email: string }) => u.email === CUSTOMER);
    expect(target.password).toBeUndefined();

    const updated = await api().put(`/api/users/${target._id}`).set(auth).send({ name: 'Renamed' }).expect(200);
    expect(updated.body).toMatchObject({ name: 'Renamed', email: CUSTOMER });

    await api().delete(`/api/users/${target._id}`).set(auth).expect(200);
    await api().get(`/api/users/${target._id}`).set(auth).expect(404);
  });
});
