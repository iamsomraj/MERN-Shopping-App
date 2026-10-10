import { Order, PAID_STATUSES } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { Review } from '../models/Review.js';
import { User } from '../models/User.js';
import { buildDemoOrders } from './orders.js';
import { products } from './products.js';
import { reviews } from './reviews.js';
import { users } from './users.js';

export const clearDatabase = async (): Promise<void> => {
  await Promise.all([Order.deleteMany(), Review.deleteMany(), Product.deleteMany(), User.deleteMany()]);
};

/**
 * Seeds users and the product catalog. With `demo`, also adds sample orders and reviews
 * so the storefront and admin dashboard look populated.
 */
export const seedDatabase = async ({ demo = true }: { demo?: boolean } = {}): Promise<void> => {
  await clearDatabase();
  const insertedUsers = await User.insertMany(users);
  const [admin] = insertedUsers;
  if (!admin) throw new Error('Seed data has no users');
  const insertedProducts = await Product.insertMany(products.map((product) => ({ ...product, user: admin._id })));
  if (!demo) return;

  const customers = insertedUsers.filter((user) => !user.isAdmin);
  // Timestamps are part of the demo data, so bypass Mongoose's automatic createdAt/updatedAt.
  await Order.insertMany(buildDemoOrders(customers, insertedProducts), { timestamps: false });

  const userByEmail = new Map(insertedUsers.map((user) => [user.email, user]));
  const productBySlug = new Map(insertedProducts.map((product) => [product.slug, product]));
  const paidOrders = await Order.find({ status: { $in: PAID_STATUSES } }, 'user products.product');
  const purchased = new Set(
    paidOrders.flatMap((order) => order.products.map((item) => `${order.user.toString()}:${item.product.toString()}`))
  );

  const DAY = 24 * 60 * 60 * 1000;
  await Review.insertMany(
    reviews.flatMap((seed, index) => {
      const user = userByEmail.get(seed.userEmail);
      const product = productBySlug.get(seed.productSlug);
      if (!user || !product) return [];
      return [
        {
          product: product._id,
          user: user._id,
          name: user.name,
          rating: seed.rating,
          title: seed.title,
          comment: seed.comment,
          isVerifiedPurchase: purchased.has(`${user._id.toString()}:${product._id.toString()}`),
          // Spread over the last few weeks so review dates look realistic.
          createdAt: new Date(Date.now() - ((index * 7) % 40) * DAY - index * 3_600_000),
        },
      ];
    }),
    { timestamps: false }
  );
  await Promise.all(insertedProducts.map((product) => Review.recalcProductRating(product._id)));
};
