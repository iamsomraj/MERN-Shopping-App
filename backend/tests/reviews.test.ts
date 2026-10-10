import { beforeEach, describe, expect, it } from 'vitest';
import { CUSTOMER, OTHER_CUSTOMER, SHIPPING_ADDRESS, api, bearer, login, seed } from './helpers.js';

const SLUG = 'internal-ssd-sata-iii-1tb';

const review = (token: string, body: object) =>
  api().post(`/api/products/${SLUG}/reviews`).set(bearer(token)).send(body);

describe('reviews', () => {
  beforeEach(() => seed());

  it('requires a signed-in user and valid input', async () => {
    await api().post(`/api/products/${SLUG}/reviews`).send({ rating: 5, comment: 'Great' }).expect(401);
    const token = await login(CUSTOMER);
    expect((await review(token, { rating: 6, comment: 'Great' })).status).toBe(400);
    expect((await review(token, { rating: 4 })).status).toBe(400);
  });

  it('creates one review per user and recalculates the rating', async () => {
    const john = await login(CUSTOMER);
    const jane = await login(OTHER_CUSTOMER);

    const first = await review(john, { rating: 5, title: 'Fast', comment: 'Much faster boot.' });
    expect(first.status).toBe(201);
    expect(first.body).toMatchObject({ name: 'John Doe', rating: 5, isVerifiedPurchase: false });

    expect((await review(john, { rating: 1, comment: 'Changed my mind' })).status).toBe(409);
    await review(jane, { rating: 2, comment: 'Not for me.' }).expect(201);

    const productRes = await api().get(`/api/products/${SLUG}`).expect(200);
    expect(productRes.body).toMatchObject({ rating: 3.5, numReviews: 2 });

    const asJohn = await api().get(`/api/products/${SLUG}/reviews`).set(bearer(john)).expect(200);
    expect(asJohn.body.viewerHasReviewed).toBe(true);
    const list = await api().get(`/api/products/${SLUG}/reviews`).expect(200);
    expect(list.body.viewerHasReviewed).toBe(false);
    expect(list.body).toMatchObject({ total: 2, rating: 3.5, distribution: { 1: 0, 2: 1, 3: 0, 4: 0, 5: 1 } });
    expect(list.body.reviews[0].name).toBe('Jane Doe'); // newest first
  });

  it('marks reviews from paying customers as verified purchases', async () => {
    const token = await login(CUSTOMER);
    const ssd = (await api().get(`/api/products/${SLUG}`)).body;
    const order = (
      await api()
        .post('/api/orders')
        .set(bearer(token))
        .send({ products: [{ product: ssd._id, qty: 1 }], shippingAddress: SHIPPING_ADDRESS })
    ).body;
    await api().put(`/api/orders/${order._id}/pay`).set(bearer(token)).send({ id: 'PAYPAL-1' }).expect(200);

    const res = await review(token, { rating: 4, comment: 'Works great.' });
    expect(res.body.isVerifiedPurchase).toBe(true);
  });
});
