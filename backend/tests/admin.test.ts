import { beforeEach, describe, expect, it } from 'vitest';
import { ADMIN, CUSTOMER, api, bearer, login, seedWithDemoData } from './helpers.js';

describe('admin dashboard', () => {
  beforeEach(seedWithDemoData);

  it('returns stats from the demo orders', async () => {
    const token = await login(ADMIN);
    const res = await api().get('/api/admin/stats').set(bearer(token)).expect(200);
    expect(res.body).toMatchObject({
      ordersCount: 12,
      ordersByStatus: { pending: 1, paid: 3, shipped: 3, delivered: 5 },
      usersCount: 4,
      productsCount: 20,
    });
    expect(res.body.revenue).toBeGreaterThan(0);
    expect(res.body.salesByDay).toHaveLength(30);
    const charted = res.body.salesByDay.reduce((acc: number, day: { total: number }) => acc + day.total, 0);
    expect(charted).toBeCloseTo(res.body.revenue, 2);
    expect(res.body.recentOrders).toHaveLength(5);
    expect(res.body.lowStock.map((p: { qtyInStock: number }) => p.qtyInStock)).toEqual([0, 3, 4]);
  });

  it('lists every product including unavailable ones, and the image library', async () => {
    const token = await login(ADMIN);
    const [first] = (await api().get('/api/products')).body.products;
    await api().delete(`/api/products/${first._id}`).set(bearer(token)).expect(200);

    const all = await api().get('/api/admin/products?limit=100').set(bearer(token)).expect(200);
    expect(all.body.total).toBe(20);
    const search = await api().get('/api/admin/products?keyword=ssd').set(bearer(token)).expect(200);
    expect(search.body.total).toBe(2);

    const library = await api().get('/api/admin/image-library').set(bearer(token)).expect(200);
    expect(library.body).toHaveLength(20);
  });

  it('blocks customers', async () => {
    const token = await login(CUSTOMER);
    await api().get('/api/admin/stats').set(bearer(token)).expect(401);
  });
});

describe('demo seed data', () => {
  beforeEach(seedWithDemoData);

  it('aggregates review ratings onto products', async () => {
    const res = await api().get('/api/products/fjallraven-laptop-backpack').expect(200);
    expect(res.body).toMatchObject({ numReviews: 3, rating: 4.7 });
  });
});
