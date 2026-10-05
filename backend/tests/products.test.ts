import { beforeEach, describe, expect, it } from 'vitest';
import { api, seed } from './helpers.js';

describe('products', () => {
  beforeEach(seed);

  it('lists products 8 per page with pagination info', async () => {
    const res = await api().get('/api/products?page=1').expect(200);
    expect(res.body.products).toHaveLength(8);
    expect(res.body).toMatchObject({ page: 1, pages: 3 });
    expect(res.body.products[0].image).toMatch(/^\/images\/products\//);
  });

  it('returns the last partial page', async () => {
    const res = await api().get('/api/products?page=3').expect(200);
    expect(res.body.products).toHaveLength(4);
  });

  it('gets a product by id', async () => {
    const list = await api().get('/api/products');
    const id = list.body.products[0]._id;
    const res = await api().get(`/api/products/${id}`).expect(200);
    expect(res.body._id).toBe(id);
  });

  it('returns 404 for a malformed product id', async () => {
    const res = await api().get('/api/products/not-an-id').expect(404);
    expect(res.body.message).toBeTruthy();
  });

  it('returns 404 with a message for unknown routes', async () => {
    const res = await api().get('/api/nope').expect(404);
    expect(res.body.message).toContain('Page Not Found');
  });
});
