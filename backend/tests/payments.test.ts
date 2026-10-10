import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { resetEnvCache } from '../src/config/env.js';
import { CUSTOMER, SHIPPING_ADDRESS, api, bearer, login, seed } from './helpers.js';

interface FakePaypalOrder {
  referenceId: string;
  value: string;
  status?: string;
}

/** Stands in for the PayPal REST API: OAuth, order lookup and capture. */
const mockPaypal = (orders: Record<string, FakePaypalOrder>) => {
  const captured: string[] = [];
  const realFetch = globalThis.fetch;
  vi.stubGlobal('fetch', async (input: string | URL | Request, init?: RequestInit) => {
    const url = String(input);
    if (!url.startsWith('https://paypal.test')) return realFetch(input, init);
    if (url.endsWith('/v1/oauth2/token')) return Response.json({ access_token: 'token' });
    const match = url.match(/\/v2\/checkout\/orders\/([^/]+)(\/capture)?$/);
    const order = match && orders[decodeURIComponent(match[1]!)];
    if (!order) return new Response('not found', { status: 404 });
    const body = {
      id: match![1],
      purchase_units: [{ reference_id: order.referenceId, amount: { currency_code: 'USD', value: order.value } }],
      payer: { email_address: 'buyer@example.com' },
    };
    if (match![2]) {
      captured.push(match![1]!);
      return Response.json({ ...body, status: 'COMPLETED' });
    }
    return Response.json({ ...body, status: order.status ?? 'APPROVED' });
  });
  return captured;
};

const placeOrder = async (token: string) => {
  const ssd = (await api().get('/api/products/internal-ssd-sata-iii-1tb')).body;
  return (
    await api()
      .post('/api/orders')
      .set(bearer(token))
      .send({ products: [{ product: ssd._id, qty: 1 }], shippingAddress: SHIPPING_ADDRESS })
  ).body as { _id: string; totalPrice: number };
};

describe('server-side PayPal capture', () => {
  beforeEach(async () => {
    process.env.PAYPAL_CLIENT_SECRET = 'test-secret';
    process.env.PAYPAL_API_BASE = 'https://paypal.test';
    resetEnvCache();
    await seed();
  });

  afterEach(() => {
    delete process.env.PAYPAL_CLIENT_SECRET;
    delete process.env.PAYPAL_API_BASE;
    resetEnvCache();
    vi.unstubAllGlobals();
  });

  it('captures an approved PayPal order that matches the order', async () => {
    const token = await login(CUSTOMER);
    const order = await placeOrder(token);
    const captured = mockPaypal({ 'PP-1': { referenceId: order._id, value: order.totalPrice.toFixed(2) } });

    const res = await api().put(`/api/orders/${order._id}/pay`).set(bearer(token)).send({ id: 'PP-1' }).expect(200);
    expect(res.body).toMatchObject({ status: 'paid', paymentResult: { id: 'PP-1', status: 'COMPLETED' } });
    expect(captured).toEqual(['PP-1']);
  });

  it('refuses a PayPal order for a different order or amount, without capturing', async () => {
    const token = await login(CUSTOMER);
    const order = await placeOrder(token);
    const other = await placeOrder(token);
    const captured = mockPaypal({
      'PP-OTHER': { referenceId: other._id, value: order.totalPrice.toFixed(2) },
      'PP-CHEAP': { referenceId: order._id, value: '0.01' },
    });

    await api().put(`/api/orders/${order._id}/pay`).set(bearer(token)).send({ id: 'PP-OTHER' }).expect(400);
    await api().put(`/api/orders/${order._id}/pay`).set(bearer(token)).send({ id: 'PP-CHEAP' }).expect(400);
    expect(captured).toEqual([]);
  });

  it('never reuses one PayPal payment for two orders', async () => {
    const token = await login(CUSTOMER);
    const first = await placeOrder(token);
    const second = await placeOrder(token);
    mockPaypal({ 'PP-1': { referenceId: first._id, value: first.totalPrice.toFixed(2) } });

    await api().put(`/api/orders/${first._id}/pay`).set(bearer(token)).send({ id: 'PP-1' }).expect(200);
    const res = await api().put(`/api/orders/${second._id}/pay`).set(bearer(token)).send({ id: 'PP-1' }).expect(409);
    expect(res.body.message).toMatch(/already been used/);
  });

  it('checks stock before capturing', async () => {
    const token = await login(CUSTOMER);
    const order = await placeOrder(token);
    const captured = mockPaypal({ 'PP-1': { referenceId: order._id, value: order.totalPrice.toFixed(2) } });
    const adminToken = await login('admin@example.com');
    const ssd = (await api().get('/api/products/internal-ssd-sata-iii-1tb')).body;
    await api().put(`/api/products/${ssd._id}`).set(bearer(adminToken)).send({ qtyInStock: 0 }).expect(200);

    await api().put(`/api/orders/${order._id}/pay`).set(bearer(token)).send({ id: 'PP-1' }).expect(409);
    expect(captured).toEqual([]);
  });

  it('reports server capture in the payment config', async () => {
    const { createApp } = await import('../src/app.js');
    const { default: request } = await import('supertest');
    const res = await request(createApp()).get('/api/config/payments').expect(200);
    expect(res.body).toEqual({ paypalClientId: 'test-paypal-client', serverCapture: true });
  });
});
