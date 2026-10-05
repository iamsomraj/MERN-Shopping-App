import { beforeEach, describe, expect, it } from 'vitest';
import { ADMIN, CUSTOMER, OTHER_CUSTOMER, api, login, seed } from './helpers.js';

const placeOrder = async (token: string) => {
  const list = await api().get('/api/products');
  const [first, second] = list.body.products;
  // Prices sent by the client are ignored; the server uses database prices.
  return api()
    .post('/api/orders')
    .set('Authorization', `Bearer ${token}`)
    .send({
      products: [
        { product: first._id, name: first.name, price: 0.01, qty: 2 },
        { product: second._id, name: second.name, price: 0.01 },
      ],
    });
};

describe('orders', () => {
  beforeEach(seed);

  it('places an order using database prices', async () => {
    const token = await login(CUSTOMER);
    const res = await placeOrder(token);
    expect(res.status).toBe(201);
    // 2 x 119.99 (backpack) + 1 x 24.99 (t-shirt; missing qty defaults to 1)
    expect(res.body.totalPrice).toBe(264.97);
    expect(res.body.isPaymentDone).toBe(false);
  });

  it('rejects an empty order', async () => {
    const token = await login(CUSTOMER);
    await api().post('/api/orders').set('Authorization', `Bearer ${token}`).send({ products: [] }).expect(400);
  });

  it('lets the owner read and pay, hides it from other users, and shows it to admins', async () => {
    const ownerToken = await login(CUSTOMER);
    const order = (await placeOrder(ownerToken)).body;

    const mine = await api().get('/api/orders').set('Authorization', `Bearer ${ownerToken}`).expect(200);
    expect(mine.body).toHaveLength(1);

    const otherToken = await login(OTHER_CUSTOMER);
    await api().get(`/api/orders/${order._id}`).set('Authorization', `Bearer ${otherToken}`).expect(404);
    await api().put(`/api/orders/${order._id}`).set('Authorization', `Bearer ${otherToken}`).expect(404);

    const paid = await api().put(`/api/orders/${order._id}`).set('Authorization', `Bearer ${ownerToken}`).expect(200);
    expect(paid.body.isPaymentDone).toBe(true);

    const adminToken = await login(ADMIN);
    await api().get(`/api/orders/${order._id}`).set('Authorization', `Bearer ${adminToken}`).expect(200);
    const all = await api().get('/api/orders/admin/all').set('Authorization', `Bearer ${adminToken}`).expect(200);
    expect(all.body).toHaveLength(1);
    expect(all.body[0].user.email).toBe(CUSTOMER);
  });
});

describe('config', () => {
  it('returns the PayPal client id', async () => {
    const res = await api().get('/api/config/paypal').expect(200);
    expect(res.text).toBe('test-paypal-client');
  });
});
