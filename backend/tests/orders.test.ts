import { beforeEach, describe, expect, it } from 'vitest';
import { ADMIN, CUSTOMER, OTHER_CUSTOMER, SHIPPING_ADDRESS, api, bearer, login, seed } from './helpers.js';

const product = async (slug: string) => (await api().get(`/api/products/${slug}`)).body;

const placeOrder = async (token: string, lines?: Array<{ product: string; qty?: number; price?: number }>) => {
  const backpack = await product('fjallraven-laptop-backpack');
  const tee = await product('mens-slim-fit-t-shirt');
  // Prices sent by the client are ignored; the server uses database prices.
  return api()
    .post('/api/orders')
    .set(bearer(token))
    .send({
      products: lines ?? [
        { product: backpack._id, price: 0.01, qty: 2 },
        { product: tee._id, price: 0.01 },
      ],
      shippingAddress: SHIPPING_ADDRESS,
    });
};

const paypalCapture = { id: 'PAYPAL-123', status: 'COMPLETED', payer: { email_address: 'buyer@example.com' } };

describe('placing orders', () => {
  beforeEach(() => seed());

  it('places an order using database prices and free shipping over $100', async () => {
    const token = await login(CUSTOMER);
    const res = await placeOrder(token);
    expect(res.status).toBe(201);
    // 2 x 109.99 (backpack) + 1 x 24.99 (t-shirt; missing qty defaults to 1)
    expect(res.body).toMatchObject({
      itemsPrice: 244.97,
      shippingPrice: 0,
      totalPrice: 244.97,
      status: 'pending',
      isPaymentDone: false,
      shippingAddress: SHIPPING_ADDRESS,
    });
    expect(res.body.products[0].image).toMatch(/\.webp$/);
  });

  it('charges flat shipping under $100', async () => {
    const token = await login(CUSTOMER);
    const tee = await product('mens-slim-fit-t-shirt');
    const res = await placeOrder(token, [{ product: tee._id, qty: 1 }]);
    expect(res.body).toMatchObject({ itemsPrice: 24.99, shippingPrice: 9.99, totalPrice: 34.98 });
  });

  it('rejects empty orders, missing addresses and quantities above stock', async () => {
    const token = await login(CUSTOMER);
    await api()
      .post('/api/orders')
      .set(bearer(token))
      .send({ products: [], shippingAddress: SHIPPING_ADDRESS })
      .expect(400);

    const tee = await product('mens-slim-fit-t-shirt');
    await api()
      .post('/api/orders')
      .set(bearer(token))
      .send({ products: [{ product: tee._id }] })
      .expect(400);

    const shirt = await product('mens-casual-shirt'); // 4 in stock
    const res = await placeOrder(token, [{ product: shirt._id, qty: 5 }]);
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Only 4/);
  });
});

describe('order access and payment', () => {
  beforeEach(() => seed());

  it('lets the owner read and pay, hides it from other users, and shows it to admins', async () => {
    const ownerToken = await login(CUSTOMER);
    const order = (await placeOrder(ownerToken)).body;

    const mine = await api().get('/api/orders').set(bearer(ownerToken)).expect(200);
    expect(mine.body).toHaveLength(1);

    const otherToken = await login(OTHER_CUSTOMER);
    await api().get(`/api/orders/${order._id}`).set(bearer(otherToken)).expect(404);
    await api().put(`/api/orders/${order._id}/pay`).set(bearer(otherToken)).send(paypalCapture).expect(404);

    const paid = await api()
      .put(`/api/orders/${order._id}/pay`)
      .set(bearer(ownerToken))
      .send(paypalCapture)
      .expect(200);
    expect(paid.body).toMatchObject({
      status: 'paid',
      isPaymentDone: true,
      paymentResult: { id: 'PAYPAL-123', status: 'COMPLETED', email: 'buyer@example.com' },
    });
    expect(paid.body.paidAt).toEqual(expect.any(String));

    const adminToken = await login(ADMIN);
    await api().get(`/api/orders/${order._id}`).set(bearer(adminToken)).expect(200);
    const all = await api().get('/api/orders/admin/all').set(bearer(adminToken)).expect(200);
    expect(all.body).toMatchObject({ total: 1, page: 1, pages: 1 });
    expect(all.body.orders[0].user.email).toBe(CUSTOMER);
  });

  it('decrements stock on payment and refuses to pay twice', async () => {
    const token = await login(CUSTOMER);
    const before = await product('fjallraven-laptop-backpack');
    const order = (await placeOrder(token)).body;
    await api().put(`/api/orders/${order._id}/pay`).set(bearer(token)).send(paypalCapture).expect(200);
    expect((await product('fjallraven-laptop-backpack')).qtyInStock).toBe(before.qtyInStock - 2);

    const res = await api().put(`/api/orders/${order._id}/pay`).set(bearer(token)).send(paypalCapture).expect(400);
    expect(res.body.message).toMatch(/already paid/);
  });

  it('requires a PayPal id to pay', async () => {
    const token = await login(CUSTOMER);
    const order = (await placeOrder(token)).body;
    await api().put(`/api/orders/${order._id}/pay`).set(bearer(token)).send({}).expect(400);
  });

  it('lets the owner cancel an unpaid order only', async () => {
    const token = await login(CUSTOMER);
    const order = (await placeOrder(token)).body;
    const cancelled = await api().put(`/api/orders/${order._id}/cancel`).set(bearer(token)).expect(200);
    expect(cancelled.body).toMatchObject({ status: 'cancelled', isPaymentDone: false });
    await api().put(`/api/orders/${order._id}/pay`).set(bearer(token)).send(paypalCapture).expect(400);
    await api().put(`/api/orders/${order._id}/cancel`).set(bearer(token)).expect(400);
  });
});

describe('order status lifecycle', () => {
  beforeEach(() => seed());

  it('moves a paid order through shipped and delivered', async () => {
    const token = await login(CUSTOMER);
    const adminToken = await login(ADMIN);
    const order = (await placeOrder(token)).body;
    const setStatus = (status: string) =>
      api().put(`/api/orders/${order._id}/status`).set(bearer(adminToken)).send({ status });

    expect((await setStatus('shipped')).status).toBe(400); // not paid yet
    await api().put(`/api/orders/${order._id}/pay`).set(bearer(token)).send(paypalCapture).expect(200);

    const shipped = await setStatus('shipped');
    expect(shipped.status).toBe(200);
    expect(shipped.body).toMatchObject({ status: 'shipped', isPaymentDone: true });
    expect(shipped.body.shippedAt).toEqual(expect.any(String));

    const delivered = await setStatus('delivered');
    expect(delivered.body).toMatchObject({ status: 'delivered' });
    expect(delivered.body.deliveredAt).toEqual(expect.any(String));

    expect((await setStatus('cancelled')).status).toBe(400);
    expect((await setStatus('refunded')).status).toBe(400);

    const filtered = await api().get('/api/orders/admin/all?status=delivered').set(bearer(adminToken)).expect(200);
    expect(filtered.body.total).toBe(1);
  });

  it('puts stock back when a paid order is cancelled', async () => {
    const token = await login(CUSTOMER);
    const adminToken = await login(ADMIN);
    const before = (await product('fjallraven-laptop-backpack')).qtyInStock;
    const order = (await placeOrder(token)).body;
    await api().put(`/api/orders/${order._id}/pay`).set(bearer(token)).send(paypalCapture).expect(200);
    expect((await product('fjallraven-laptop-backpack')).qtyInStock).toBe(before - 2);

    await api()
      .put(`/api/orders/${order._id}/status`)
      .set(bearer(adminToken))
      .send({ status: 'cancelled' })
      .expect(200);
    expect((await product('fjallraven-laptop-backpack')).qtyInStock).toBe(before);
  });

  it('pays an order only once under concurrent requests', async () => {
    const token = await login(CUSTOMER);
    const before = (await product('fjallraven-laptop-backpack')).qtyInStock;
    const order = (await placeOrder(token)).body;
    const results = await Promise.all(
      [1, 2, 3].map((n) =>
        api()
          .put(`/api/orders/${order._id}/pay`)
          .set(bearer(token))
          .send({ ...paypalCapture, id: `PAYPAL-${n}` })
      )
    );
    expect(results.filter((res) => res.status === 200)).toHaveLength(1);
    expect((await product('fjallraven-laptop-backpack')).qtyInStock).toBe(before - 2);
  });

  it('blocks customers from changing status', async () => {
    const token = await login(CUSTOMER);
    const order = (await placeOrder(token)).body;
    await api().put(`/api/orders/${order._id}/status`).set(bearer(token)).send({ status: 'cancelled' }).expect(401);
  });
});

describe('config', () => {
  it('returns the PayPal client id', async () => {
    const res = await api().get('/api/config/paypal').expect(200);
    expect(res.text).toBe('test-paypal-client');
  });
});
