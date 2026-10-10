import { beforeEach, describe, expect, it } from 'vitest';
import { CUSTOMER, api, bearer, login, seed } from './helpers.js';

describe('wishlist', () => {
  beforeEach(() => seed());

  it('requires a signed-in user', async () => {
    await api().get('/api/users/wishlist').expect(401);
  });

  it('adds idempotently, lists newest first, and removes', async () => {
    const token = await login(CUSTOMER);
    const [first, second] = (await api().get('/api/products')).body.products;

    await api().post('/api/users/wishlist').set(bearer(token)).send({ productId: first._id }).expect(200);
    const ids = await api().post('/api/users/wishlist').set(bearer(token)).send({ productId: first._id }).expect(200);
    expect(ids.body).toEqual([first._id]);
    await api().post('/api/users/wishlist').set(bearer(token)).send({ productId: second._id }).expect(200);

    const list = await api().get('/api/users/wishlist').set(bearer(token)).expect(200);
    expect(list.body.map((p: { _id: string }) => p._id)).toEqual([second._id, first._id]);

    const after = await api().delete(`/api/users/wishlist/${first._id}`).set(bearer(token)).expect(200);
    expect(after.body).toEqual([second._id]);
  });

  it('rejects unknown or malformed product ids', async () => {
    const token = await login(CUSTOMER);
    await api().post('/api/users/wishlist').set(bearer(token)).send({ productId: 'nope' }).expect(400);
    await api()
      .post('/api/users/wishlist')
      .set(bearer(token))
      .send({ productId: '0123456789abcdef01234567' })
      .expect(404);
  });
});
