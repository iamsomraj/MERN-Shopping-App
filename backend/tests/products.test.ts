import { beforeEach, describe, expect, it } from 'vitest';
import { ADMIN, CUSTOMER, api, bearer, login, seed } from './helpers.js';

const list = async (query = '') => (await api().get(`/api/products${query}`).expect(200)).body;

describe('product listing', () => {
  beforeEach(() => seed());

  it('lists 12 products per page by default with pagination info', async () => {
    const body = await list();
    expect(body.products).toHaveLength(12);
    expect(body).toMatchObject({ page: 1, pages: 2, total: 20 });
    expect(body.products[0].image).toMatch(/^\/images\/products\/.+\.webp$/);
    expect(body.products[0].slug).toEqual(expect.any(String));
  });

  it('honours page and limit, capping the limit', async () => {
    expect((await list('?page=2')).products).toHaveLength(8);
    expect((await list('?limit=5&page=4')).products).toHaveLength(5);
    await api().get('/api/products?limit=500').expect(400);
  });

  it('searches by keyword across name, brand and category', async () => {
    const byName = await list('?keyword=monitor');
    expect(byName.products.map((p: { name: string }) => p.name)).toEqual(
      expect.arrayContaining([expect.stringMatching(/Monitor/), expect.stringMatching(/Monitor/)])
    );
    expect(byName.total).toBe(2);
    expect((await list('?keyword=WD')).total).toBe(2);
    // Regex special characters are treated literally.
    expect((await list('?keyword=.*')).total).toBe(0);
  });

  it('filters by category, brand, price range, stock and featured', async () => {
    const jewelry = await list('?category=Jewelry');
    expect(jewelry.total).toBe(4);
    expect(jewelry.products.every((p: { category: string }) => p.category === 'Jewelry')).toBe(true);

    expect((await list('?brand=Lumen')).total).toBe(2);

    const range = await list('?minPrice=100&maxPrice=200&limit=48');
    expect(range.products.every((p: { price: number }) => p.price >= 100 && p.price <= 200)).toBe(true);

    const inStock = await list('?category=Jewelry&inStock=true');
    expect(inStock.total).toBe(3);

    const featured = await list('?featured=true');
    expect(featured.products.every((p: { isFeatured: boolean }) => p.isFeatured)).toBe(true);

    const onSale = await list('?onSale=true');
    expect(onSale.total).toBe(5);
    expect(onSale.products.every((p: { compareAtPrice: number; price: number }) => p.compareAtPrice > p.price)).toBe(
      true
    );
  });

  it('sorts by price', async () => {
    const asc = (await list('?sort=price-asc&limit=48')).products.map((p: { price: number }) => p.price);
    expect(asc).toEqual([...asc].sort((a, b) => a - b));
    const desc = (await list('?sort=price-desc&limit=3')).products.map((p: { price: number }) => p.price);
    expect(desc[0]).toBe(999.99);
    await api().get('/api/products?sort=random').expect(400);
  });

  it('hides unavailable products from the public listing', async () => {
    const token = await login(ADMIN);
    const [first] = (await list()).products;
    await api().delete(`/api/products/${first._id}`).set(bearer(token)).expect(200);
    expect((await list()).total).toBe(19);
  });

  it('returns categories, brands and price range for filters', async () => {
    const res = await api().get('/api/products/filters').expect(200);
    expect(res.body.categories).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Electronics', count: 6, image: expect.any(String) })])
    );
    expect(res.body.brands).toContain('WD');
    expect(res.body.priceRange).toEqual({ min: 7.95, max: 999.99 });
  });
});

describe('single product', () => {
  beforeEach(() => seed());

  it('gets a product by id or slug', async () => {
    const [first] = (await list()).products;
    expect((await api().get(`/api/products/${first._id}`).expect(200)).body._id).toBe(first._id);
    expect((await api().get(`/api/products/${first.slug}`).expect(200)).body._id).toBe(first._id);
  });

  it('returns 404 for an unknown product', async () => {
    const res = await api().get('/api/products/not-a-product').expect(404);
    expect(res.body.message).toBeTruthy();
  });

  it('lists related products from the same category', async () => {
    const related = (await api().get('/api/products/21-5-full-hd-ips-monitor/related').expect(200)).body;
    expect(related).toHaveLength(4);
    expect(related.every((p: { category: string; slug: string }) => p.category === 'Electronics')).toBe(true);
    expect(related.map((p: { slug: string }) => p.slug)).not.toContain('21-5-full-hd-ips-monitor');
  });

  it('tops up related products from other categories when the category is small', async () => {
    const related = (await api().get('/api/products/fjallraven-laptop-backpack/related').expect(200)).body;
    expect(related).toHaveLength(4);
    expect(related.every((p: { category: string }) => p.category !== 'Bags')).toBe(true);
  });

  it('returns 404 with a message for unknown routes', async () => {
    const res = await api().get('/api/nope').expect(404);
    expect(res.body.message).toContain('Page Not Found');
  });
});

describe('admin product management', () => {
  beforeEach(() => seed());

  const newProduct = {
    name: 'Canvas Tote Bag',
    description: 'A sturdy canvas tote.',
    category: 'Bags',
    brand: 'Harbor & Co.',
    price: 25,
    compareAtPrice: 35,
    qtyInStock: 10,
    images: ['/images/products/fjallraven-laptop-backpack.webp', 'https://example.com/tote.jpg'],
    isFeatured: true,
  };

  it('creates a product with a generated slug and primary image', async () => {
    const token = await login(ADMIN);
    const res = await api().post('/api/products').set(bearer(token)).send(newProduct).expect(201);
    expect(res.body).toMatchObject({
      slug: 'canvas-tote-bag',
      image: newProduct.images[0],
      images: newProduct.images,
      isAvailable: true,
    });

    // A second product with the same name gets a unique slug.
    const dupe = await api().post('/api/products').set(bearer(token)).send(newProduct).expect(201);
    expect(dupe.body.slug).toMatch(/^canvas-tote-bag-[a-f\d]{6}$/);
  });

  it('validates input', async () => {
    const token = await login(ADMIN);
    await api()
      .post('/api/products')
      .set(bearer(token))
      .send({ ...newProduct, images: [] })
      .expect(400);
    await api()
      .post('/api/products')
      .set(bearer(token))
      .send({ ...newProduct, images: ['javascript:alert(1)'] })
      .expect(400);
    const res = await api()
      .post('/api/products')
      .set(bearer(token))
      .send({ ...newProduct, compareAtPrice: 10 })
      .expect(400);
    expect(res.body.message).toMatch(/compareAtPrice/);
  });

  it('updates a product', async () => {
    const token = await login(ADMIN);
    const [first] = (await list()).products;
    const res = await api()
      .put(`/api/products/${first._id}`)
      .set(bearer(token))
      .send({ price: 1, compareAtPrice: null, qtyInStock: 7, images: ['https://example.com/new.jpg'] })
      .expect(200);
    expect(res.body).toMatchObject({
      price: 1,
      compareAtPrice: null,
      qtyInStock: 7,
      image: 'https://example.com/new.jpg',
    });
    expect(res.body.slug).toBe(first.slug);

    await api().put(`/api/products/${first._id}`).set(bearer(token)).send({ compareAtPrice: 0.5 }).expect(400);
  });

  it('leaves fields that are not sent untouched', async () => {
    const token = await login(ADMIN);
    const before = (await api().get('/api/products/fjallraven-laptop-backpack')).body;
    const res = await api().put(`/api/products/${before._id}`).set(bearer(token)).send({ qtyInStock: 3 }).expect(200);
    expect(res.body).toMatchObject({
      qtyInStock: 3,
      description: before.description,
      brand: before.brand,
      isFeatured: true,
      isAvailable: true,
      compareAtPrice: before.compareAtPrice,
    });
  });

  it('blocks customers from creating or editing products', async () => {
    const token = await login(CUSTOMER);
    await api().post('/api/products').set(bearer(token)).send(newProduct).expect(401);
    const [first] = (await list()).products;
    await api().put(`/api/products/${first._id}`).set(bearer(token)).send({ price: 1 }).expect(401);
  });
});
